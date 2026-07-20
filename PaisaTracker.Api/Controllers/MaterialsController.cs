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
public class MaterialsController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public MaterialsController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record MaterialDto(string Name, string Unit, decimal StockQty, decimal ReorderLevel, string? SupplierName);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Material>>> GetAll()
    {
        return await _db.Materials.Where(m => m.UserId == CurrentUserId).OrderBy(m => m.Name).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Material>> Create(MaterialDto dto)
    {
        var material = new Material { UserId = CurrentUserId, Name = dto.Name, Unit = dto.Unit, StockQty = dto.StockQty, ReorderLevel = dto.ReorderLevel, SupplierName = dto.SupplierName };
        _db.Materials.Add(material);
        await _db.SaveChangesAsync();
        return Ok(material);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, MaterialDto dto)
    {
        var material = await _db.Materials.FirstOrDefaultAsync(m => m.Id == id && m.UserId == CurrentUserId);
        if (material is null) return NotFound();

        material.Name = dto.Name;
        material.Unit = dto.Unit;
        material.StockQty = dto.StockQty;
        material.ReorderLevel = dto.ReorderLevel;
        material.SupplierName = dto.SupplierName;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var material = await _db.Materials.FirstOrDefaultAsync(m => m.Id == id && m.UserId == CurrentUserId);
        if (material is null) return NotFound();

        _db.Materials.Remove(material);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
