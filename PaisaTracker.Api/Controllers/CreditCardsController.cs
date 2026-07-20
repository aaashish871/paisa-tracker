using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaisaTracker.Api.Data;
using PaisaTracker.Api.Models;

namespace PaisaTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CreditCardsController : ControllerBase
{
    private readonly PaisaTrackerDbContext _db;

    public CreditCardsController(PaisaTrackerDbContext db)
    {
        _db = db;
    }

    public record CreditCardDto(
        string Name,
        string? BankName,
        string? CardNumberLast4,
        decimal CreditLimit,
        decimal CurrentOutstanding,
        decimal MinimumDue,
        DateTime StatementDate,
        DateTime DueDate,
        CreditCardStatus Status,
        string? Notes);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CreditCard>>> GetAll()
    {
        return await _db.CreditCards.OrderBy(c => c.DueDate).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CreditCard>> GetById(int id)
    {
        var card = await _db.CreditCards.FindAsync(id);
        return card is null ? NotFound() : card;
    }

    [HttpPost]
    public async Task<ActionResult<CreditCard>> Create(CreditCardDto dto)
    {
        var card = new CreditCard
        {
            Name = dto.Name,
            BankName = dto.BankName,
            CardNumberLast4 = dto.CardNumberLast4,
            CreditLimit = dto.CreditLimit,
            CurrentOutstanding = dto.CurrentOutstanding,
            MinimumDue = dto.MinimumDue,
            StatementDate = dto.StatementDate,
            DueDate = dto.DueDate,
            Status = dto.Status,
            Notes = dto.Notes,
        };
        _db.CreditCards.Add(card);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = card.Id }, card);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CreditCardDto dto)
    {
        var card = await _db.CreditCards.FindAsync(id);
        if (card is null) return NotFound();

        card.Name = dto.Name;
        card.BankName = dto.BankName;
        card.CardNumberLast4 = dto.CardNumberLast4;
        card.CreditLimit = dto.CreditLimit;
        card.CurrentOutstanding = dto.CurrentOutstanding;
        card.MinimumDue = dto.MinimumDue;
        card.StatementDate = dto.StatementDate;
        card.DueDate = dto.DueDate;
        card.Status = dto.Status;
        card.Notes = dto.Notes;
        card.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var card = await _db.CreditCards.FindAsync(id);
        if (card is null) return NotFound();

        _db.CreditCards.Remove(card);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
