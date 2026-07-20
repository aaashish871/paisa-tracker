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
public class SalesController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public SalesController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record SaleDto(DateTime Date, string CustomerName, string ProductName, decimal Quantity, decimal Amount, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sale>>> GetAll()
    {
        return await _db.Sales.Where(s => s.UserId == CurrentUserId).OrderByDescending(s => s.Date).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Sale>> GetById(int id)
    {
        var sale = await _db.Sales.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        return sale is null ? NotFound() : sale;
    }

    [HttpPost]
    public async Task<ActionResult<Sale>> Create(SaleDto dto)
    {
        var sale = new Sale
        {
            UserId = CurrentUserId,
            Date = dto.Date,
            CustomerName = dto.CustomerName,
            ProductName = dto.ProductName,
            Quantity = dto.Quantity,
            Amount = dto.Amount,
            Notes = dto.Notes,
        };
        _db.Sales.Add(sale);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = sale.Id }, sale);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, SaleDto dto)
    {
        var sale = await _db.Sales.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (sale is null) return NotFound();

        sale.Date = dto.Date;
        sale.CustomerName = dto.CustomerName;
        sale.ProductName = dto.ProductName;
        sale.Quantity = dto.Quantity;
        sale.Amount = dto.Amount;
        sale.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sale = await _db.Sales.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (sale is null) return NotFound();

        _db.Sales.Remove(sale);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
