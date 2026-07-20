namespace PaisaTracker.Api.Models;

public enum AccountType
{
    Savings,
    Current,
    Cash
}

public class Account
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? BankName { get; set; }
    public string? AccountNumber { get; set; }
    public AccountType Type { get; set; }
    public decimal Balance { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
