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
public class CustomersController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public CustomersController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record CustomerDto(string Name, string? ContactPhone, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetAll()
    {
        return await _db.Customers.Where(c => c.UserId == CurrentUserId).OrderBy(c => c.Name).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Customer>> Create(CustomerDto dto)
    {
        var customer = new Customer { UserId = CurrentUserId, Name = dto.Name, ContactPhone = dto.ContactPhone, Notes = dto.Notes };
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
        return Ok(customer);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CustomerDto dto)
    {
        var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (customer is null) return NotFound();

        customer.Name = dto.Name;
        customer.ContactPhone = dto.ContactPhone;
        customer.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (customer is null) return NotFound();

        _db.Customers.Remove(customer);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
