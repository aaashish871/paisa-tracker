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
public class PurchasesController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public PurchasesController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record PurchaseDto(DateTime Date, string SupplierName, string MaterialName, decimal Quantity, decimal Amount, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Purchase>>> GetAll()
    {
        return await _db.Purchases.Where(p => p.UserId == CurrentUserId).OrderByDescending(p => p.Date).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Purchase>> GetById(int id)
    {
        var purchase = await _db.Purchases.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        return purchase is null ? NotFound() : purchase;
    }

    [HttpPost]
    public async Task<ActionResult<Purchase>> Create(PurchaseDto dto)
    {
        var purchase = new Purchase
        {
            UserId = CurrentUserId,
            Date = dto.Date,
            SupplierName = dto.SupplierName,
            MaterialName = dto.MaterialName,
            Quantity = dto.Quantity,
            Amount = dto.Amount,
            Notes = dto.Notes,
        };
        _db.Purchases.Add(purchase);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = purchase.Id }, purchase);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, PurchaseDto dto)
    {
        var purchase = await _db.Purchases.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        if (purchase is null) return NotFound();

        purchase.Date = dto.Date;
        purchase.SupplierName = dto.SupplierName;
        purchase.MaterialName = dto.MaterialName;
        purchase.Quantity = dto.Quantity;
        purchase.Amount = dto.Amount;
        purchase.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var purchase = await _db.Purchases.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        if (purchase is null) return NotFound();

        _db.Purchases.Remove(purchase);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
