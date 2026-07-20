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
public class BillsController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public BillsController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record BillDto(string Name, string Category, DateTime DueDate, decimal Amount, BillStatus Status, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bill>>> GetAll()
    {
        return await _db.Bills.Where(b => b.UserId == CurrentUserId).OrderBy(b => b.DueDate).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Bill>> GetById(int id)
    {
        var bill = await _db.Bills.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        return bill is null ? NotFound() : bill;
    }

    [HttpPost]
    public async Task<ActionResult<Bill>> Create(BillDto dto)
    {
        var bill = new Bill
        {
            UserId = CurrentUserId,
            Name = dto.Name,
            Category = dto.Category,
            DueDate = dto.DueDate,
            Amount = dto.Amount,
            Status = dto.Status,
            Notes = dto.Notes,
        };
        _db.Bills.Add(bill);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = bill.Id }, bill);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BillDto dto)
    {
        var bill = await _db.Bills.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        if (bill is null) return NotFound();

        bill.Name = dto.Name;
        bill.Category = dto.Category;
        bill.DueDate = dto.DueDate;
        bill.Amount = dto.Amount;
        bill.Status = dto.Status;
        bill.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var bill = await _db.Bills.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        if (bill is null) return NotFound();

        _db.Bills.Remove(bill);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
