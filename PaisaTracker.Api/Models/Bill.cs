namespace PaisaTracker.Api.Models;

public enum BillStatus
{
    Upcoming,
    DueSoon,
    Unpaid,
    Paid
}

public class Bill
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public BillStatus Status { get; set; } = BillStatus.Upcoming;
    public string? Notes { get; set; }
}
