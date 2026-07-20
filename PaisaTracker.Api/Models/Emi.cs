namespace PaisaTracker.Api.Models;

public class Emi
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Principal { get; set; }
    public decimal MonthlyAmount { get; set; }
    public int TenureMonths { get; set; }
    public int RemainingMonths { get; set; }
    public DateTime NextDueDate { get; set; }
    public string? Notes { get; set; }
}
