namespace PaisaTracker.Api.Models;

public class Expense
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Category { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string? Note { get; set; }
    public decimal Amount { get; set; }
}
