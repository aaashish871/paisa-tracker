namespace PaisaTracker.Api.Models;

public class Advance
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int WorkerId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
}
