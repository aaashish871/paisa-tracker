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
public class WorkersController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public WorkersController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record WorkerDto(string Name, string? Role, string? Phone, decimal MonthlySalary, DateTime JoinedDate, bool Active);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Worker>>> GetAll()
    {
        return await _db.Workers.Where(w => w.UserId == CurrentUserId).OrderBy(w => w.Name).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Worker>> GetById(int id)
    {
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.Id == id && w.UserId == CurrentUserId);
        return worker is null ? NotFound() : worker;
    }

    [HttpPost]
    public async Task<ActionResult<Worker>> Create(WorkerDto dto)
    {
        var worker = new Worker
        {
            UserId = CurrentUserId,
            Name = dto.Name,
            Role = dto.Role,
            Phone = dto.Phone,
            MonthlySalary = dto.MonthlySalary,
            JoinedDate = dto.JoinedDate,
            Active = dto.Active,
        };
        _db.Workers.Add(worker);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = worker.Id }, worker);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, WorkerDto dto)
    {
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.Id == id && w.UserId == CurrentUserId);
        if (worker is null) return NotFound();

        worker.Name = dto.Name;
        worker.Role = dto.Role;
        worker.Phone = dto.Phone;
        worker.MonthlySalary = dto.MonthlySalary;
        worker.JoinedDate = dto.JoinedDate;
        worker.Active = dto.Active;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var worker = await _db.Workers.FirstOrDefaultAsync(w => w.Id == id && w.UserId == CurrentUserId);
        if (worker is null) return NotFound();

        _db.Workers.Remove(worker);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
