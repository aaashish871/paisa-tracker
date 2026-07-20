using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaisaTracker.Api.Data;
using PaisaTracker.Api.Models;

namespace PaisaTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.SuperUser)]
public class PayrollController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public PayrollController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record PayrollRow(
        int WorkerId,
        string Name,
        decimal MonthlySalary,
        int PresentDays,
        int HalfDays,
        int AbsentDays,
        decimal PerDayWage,
        decimal GrossEarned,
        decimal AdvancesTaken,
        decimal NetPayable);

    [HttpGet("report")]
    public async Task<ActionResult<IEnumerable<PayrollRow>>> Report([FromQuery] int year, [FromQuery] int month)
    {
        if (month < 1 || month > 12) return BadRequest(new { message = "Month must be between 1 and 12." });

        var daysInMonth = DateTime.DaysInMonth(year, month);
        var monthStart = new DateTime(year, month, 1);
        var monthEnd = monthStart.AddMonths(1).AddDays(-1);

        var workers = await _db.Workers.Where(w => w.UserId == CurrentUserId).OrderBy(w => w.Name).ToListAsync();

        var attendance = await _db.AttendanceRecords
            .Where(a => a.UserId == CurrentUserId && a.Date >= monthStart && a.Date <= monthEnd)
            .ToListAsync();

        var advances = await _db.Advances
            .Where(a => a.UserId == CurrentUserId && a.Date >= monthStart && a.Date <= monthEnd)
            .ToListAsync();

        var rows = new List<PayrollRow>();
        foreach (var worker in workers)
        {
            var workerAttendance = attendance.Where(a => a.WorkerId == worker.Id).ToList();
            var present = workerAttendance.Count(a => a.Status == AttendanceStatus.Present);
            var half = workerAttendance.Count(a => a.Status == AttendanceStatus.HalfDay);
            var absent = workerAttendance.Count(a => a.Status == AttendanceStatus.Absent);

            var perDayWage = daysInMonth > 0 ? worker.MonthlySalary / daysInMonth : 0;
            var grossEarned = perDayWage * (present + half * 0.5m);
            var advancesTaken = advances.Where(a => a.WorkerId == worker.Id).Sum(a => a.Amount);
            var netPayable = grossEarned - advancesTaken;

            rows.Add(new PayrollRow(
                worker.Id, worker.Name, worker.MonthlySalary,
                present, half, absent,
                Math.Round(perDayWage, 2), Math.Round(grossEarned, 2), advancesTaken, Math.Round(netPayable, 2)));
        }

        return rows;
    }
}
