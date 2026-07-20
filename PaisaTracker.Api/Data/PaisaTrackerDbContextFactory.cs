using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PaisaTracker.Api.Data;

public class PaisaTrackerDbContextFactory : IDesignTimeDbContextFactory<PaisaTrackerDbContext>
{
    public PaisaTrackerDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PaisaTrackerDbContext>();
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Host=localhost;Database=paisatracker;Username=postgres;Password=postgres";
        optionsBuilder.UseNpgsql(connectionString);
        return new PaisaTrackerDbContext(optionsBuilder.Options);
    }
}
