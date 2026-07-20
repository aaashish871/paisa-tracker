namespace PaisaTracker.Api.Models;

public class Supplier
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public string? Notes { get; set; }
}
