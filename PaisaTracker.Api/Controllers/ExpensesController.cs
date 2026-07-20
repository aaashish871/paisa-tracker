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
public class ExpensesController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public ExpensesController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record ExpenseDto(DateTime Date, string Category, string PaymentMethod, string? Note, decimal Amount);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetAll()
    {
        return await _db.Expenses.Where(e => e.UserId == CurrentUserId).OrderByDescending(e => e.Date).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Expense>> GetById(int id)
    {
        var expense = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == CurrentUserId);
        return expense is null ? NotFound() : expense;
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> Create(ExpenseDto dto)
    {
        var expense = new Expense
        {
            UserId = CurrentUserId,
            Date = dto.Date,
            Category = dto.Category,
            PaymentMethod = dto.PaymentMethod,
            Note = dto.Note,
            Amount = dto.Amount,
        };
        _db.Expenses.Add(expense);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == CurrentUserId);
        if (expense is null) return NotFound();

        _db.Expenses.Remove(expense);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
