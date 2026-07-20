namespace PaisaTracker.Api.Models;

public class Material
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; } = "kg";
    public decimal StockQty { get; set; }
    public decimal ReorderLevel { get; set; }
    public string? SupplierName { get; set; }
}
