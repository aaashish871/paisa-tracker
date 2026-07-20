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
public class ProductsController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public ProductsController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record ProductDto(string Name, string? Category, string Unit, decimal UnitPrice, decimal StockQty);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        return await _db.Products.Where(p => p.UserId == CurrentUserId).OrderBy(p => p.Name).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create(ProductDto dto)
    {
        var product = new Product { UserId = CurrentUserId, Name = dto.Name, Category = dto.Category, Unit = dto.Unit, UnitPrice = dto.UnitPrice, StockQty = dto.StockQty };
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return Ok(product);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ProductDto dto)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        if (product is null) return NotFound();

        product.Name = dto.Name;
        product.Category = dto.Category;
        product.Unit = dto.Unit;
        product.UnitPrice = dto.UnitPrice;
        product.StockQty = dto.StockQty;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        if (product is null) return NotFound();

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
