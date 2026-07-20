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
public class SuppliersController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public SuppliersController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record SupplierDto(string Name, string? ContactPhone, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Supplier>>> GetAll()
    {
        return await _db.Suppliers.Where(s => s.UserId == CurrentUserId).OrderBy(s => s.Name).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Supplier>> Create(SupplierDto dto)
    {
        var supplier = new Supplier { UserId = CurrentUserId, Name = dto.Name, ContactPhone = dto.ContactPhone, Notes = dto.Notes };
        _db.Suppliers.Add(supplier);
        await _db.SaveChangesAsync();
        return Ok(supplier);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, SupplierDto dto)
    {
        var supplier = await _db.Suppliers.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (supplier is null) return NotFound();

        supplier.Name = dto.Name;
        supplier.ContactPhone = dto.ContactPhone;
        supplier.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var supplier = await _db.Suppliers.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (supplier is null) return NotFound();

        _db.Suppliers.Remove(supplier);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
