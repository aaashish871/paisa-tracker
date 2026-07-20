namespace PaisaTracker.Api.Models;

public class Purchase
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string SupplierName { get; set; } = string.Empty;
    public string MaterialName { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
}
