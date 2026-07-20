namespace PaisaTracker.Api.Models;

public enum CreditCardStatus
{
    Paid,
    Unpaid,
    DueSoon
}

public class CreditCard
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? BankName { get; set; }
    public string? CardNumberLast4 { get; set; }
    public decimal CreditLimit { get; set; }
    public decimal CurrentOutstanding { get; set; }
    public decimal MinimumDue { get; set; }
    public DateTime StatementDate { get; set; }
    public DateTime DueDate { get; set; }
    public CreditCardStatus Status { get; set; } = CreditCardStatus.Unpaid;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
