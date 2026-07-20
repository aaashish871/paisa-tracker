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
public class AttendanceController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public AttendanceController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record MarkAttendanceDto(int WorkerId, DateTime Date, AttendanceStatus Status);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AttendanceRecord>>> GetRange([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        return await _db.AttendanceRecords
            .Where(a => a.UserId == CurrentUserId && a.Date >= from.Date && a.Date <= to.Date)
            .ToListAsync();
    }

    [HttpPut]
    public async Task<ActionResult<AttendanceRecord>> Mark(MarkAttendanceDto dto)
    {
        var workerOwned = await _db.Workers.AnyAsync(w => w.Id == dto.WorkerId && w.UserId == CurrentUserId);
        if (!workerOwned) return NotFound(new { message = "Worker not found." });

        var date = dto.Date.Date;
        var record = await _db.AttendanceRecords.FirstOrDefaultAsync(
            a => a.UserId == CurrentUserId && a.WorkerId == dto.WorkerId && a.Date == date);

        if (record is null)
        {
            record = new AttendanceRecord
            {
                UserId = CurrentUserId,
                WorkerId = dto.WorkerId,
                Date = date,
                Status = dto.Status,
            };
            _db.AttendanceRecords.Add(record);
        }
        else
        {
            record.Status = dto.Status;
        }

        await _db.SaveChangesAsync();
        return record;
    }
}
