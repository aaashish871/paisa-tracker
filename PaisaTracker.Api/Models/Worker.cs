namespace PaisaTracker.Api.Models;

public class Worker
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Role { get; set; }
    public string? Phone { get; set; }
    public decimal MonthlySalary { get; set; }
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
    public bool Active { get; set; } = true;
}
