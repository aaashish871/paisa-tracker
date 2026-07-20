using Microsoft.EntityFrameworkCore;
using PaisaTracker.Api.Models;

namespace PaisaTracker.Api.Data;

public class PaisaTrackerDbContext : DbContext
{
    public PaisaTrackerDbContext(DbContextOptions<PaisaTrackerDbContext> options) : base(options) { }

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<CreditCard> CreditCards => Set<CreditCard>();
}
