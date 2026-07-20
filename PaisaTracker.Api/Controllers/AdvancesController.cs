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
public class AdvancesController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public AdvancesController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record AdvanceDto(int WorkerId, DateTime Date, decimal Amount, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Advance>>> GetAll([FromQuery] int? year, [FromQuery] int? month)
    {
        var query = _db.Advances.Where(a => a.UserId == CurrentUserId);
        if (year.HasValue && month.HasValue)
        {
            query = query.Where(a => a.Date.Year == year && a.Date.Month == month);
        }
        return await query.OrderByDescending(a => a.Date).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Advance>> Create(AdvanceDto dto)
    {
        var workerOwned = await _db.Workers.AnyAsync(w => w.Id == dto.WorkerId && w.UserId == CurrentUserId);
        if (!workerOwned) return NotFound(new { message = "Worker not found." });

        var advance = new Advance
        {
            UserId = CurrentUserId,
            WorkerId = dto.WorkerId,
            Date = dto.Date,
            Amount = dto.Amount,
            Notes = dto.Notes,
        };
        _db.Advances.Add(advance);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { }, advance);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var advance = await _db.Advances.FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);
        if (advance is null) return NotFound();

        _db.Advances.Remove(advance);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
