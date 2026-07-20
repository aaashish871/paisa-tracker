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
public class EmisController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public EmisController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record EmiDto(string Name, decimal Principal, decimal MonthlyAmount, int TenureMonths, int RemainingMonths, DateTime NextDueDate, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Emi>>> GetAll()
    {
        return await _db.Emis.Where(e => e.UserId == CurrentUserId).OrderBy(e => e.NextDueDate).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Emi>> GetById(int id)
    {
        var emi = await _db.Emis.FirstOrDefaultAsync(e => e.Id == id && e.UserId == CurrentUserId);
        return emi is null ? NotFound() : emi;
    }

    [HttpPost]
    public async Task<ActionResult<Emi>> Create(EmiDto dto)
    {
        var emi = new Emi
        {
            UserId = CurrentUserId,
            Name = dto.Name,
            Principal = dto.Principal,
            MonthlyAmount = dto.MonthlyAmount,
            TenureMonths = dto.TenureMonths,
            RemainingMonths = dto.RemainingMonths,
            NextDueDate = dto.NextDueDate,
            Notes = dto.Notes,
        };
        _db.Emis.Add(emi);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = emi.Id }, emi);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, EmiDto dto)
    {
        var emi = await _db.Emis.FirstOrDefaultAsync(e => e.Id == id && e.UserId == CurrentUserId);
        if (emi is null) return NotFound();

        emi.Name = dto.Name;
        emi.Principal = dto.Principal;
        emi.MonthlyAmount = dto.MonthlyAmount;
        emi.TenureMonths = dto.TenureMonths;
        emi.RemainingMonths = dto.RemainingMonths;
        emi.NextDueDate = dto.NextDueDate;
        emi.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var emi = await _db.Emis.FirstOrDefaultAsync(e => e.Id == id && e.UserId == CurrentUserId);
        if (emi is null) return NotFound();

        _db.Emis.Remove(emi);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
