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
public class AccountsController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public AccountsController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public record AccountDto(string Name, string? BankName, string? AccountNumber, AccountType Type, decimal Balance, string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAll()
    {
        return await _db.Accounts.Where(a => a.UserId == CurrentUserId).OrderBy(a => a.Name).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Account>> GetById(int id)
    {
        var account = await _db.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);
        return account is null ? NotFound() : account;
    }

    [HttpPost]
    public async Task<ActionResult<Account>> Create(AccountDto dto)
    {
        var account = new Account
        {
            UserId = CurrentUserId,
            Name = dto.Name,
            BankName = dto.BankName,
            AccountNumber = dto.AccountNumber,
            Type = dto.Type,
            Balance = dto.Balance,
            Notes = dto.Notes,
        };
        _db.Accounts.Add(account);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = account.Id }, account);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, AccountDto dto)
    {
        var account = await _db.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);
        if (account is null) return NotFound();

        account.Name = dto.Name;
        account.BankName = dto.BankName;
        account.AccountNumber = dto.AccountNumber;
        account.Type = dto.Type;
        account.Balance = dto.Balance;
        account.Notes = dto.Notes;
        account.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var account = await _db.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);
        if (account is null) return NotFound();

        _db.Accounts.Remove(account);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
