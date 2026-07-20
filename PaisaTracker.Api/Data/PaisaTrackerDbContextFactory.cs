using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PaisaTracker.Api.Data;

public class PaisaTrackerDbContextFactory : IDesignTimeDbContextFactory<PaisaTrackerDbContext>
{
    public PaisaTrackerDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PaisaTrackerDbContext>();
        optionsBuilder.UseSqlite("Data Source=paisatracker.db");
        return new PaisaTrackerDbContext(optionsBuilder.Options);
    }
}
