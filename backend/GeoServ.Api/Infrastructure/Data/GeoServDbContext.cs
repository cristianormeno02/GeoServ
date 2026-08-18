using GeoServ.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Infrastructure.Data;

public class GeoServDbContext : DbContext
{
    public GeoServDbContext(DbContextOptions<GeoServDbContext> options) : base(options)
    {
    }

    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Client> Clients { get; set; } = null!;
    public DbSet<ServiceType> ServiceTypes { get; set; } = null!;
    public DbSet<ServiceOrderStatus> ServiceOrderStatuses { get; set; } = null!;
    public DbSet<ServiceOrder> ServiceOrders { get; set; } = null!;
    public DbSet<RevenueDistribution> RevenueDistributions { get; set; } = null!;
    public DbSet<DirectCost> DirectCosts { get; set; } = null!;
    public DbSet<FixedCostCategory> FixedCostCategories { get; set; } = null!;
    public DbSet<FixedCost> FixedCosts { get; set; } = null!;
    public DbSet<AccountingMovement> AccountingMovements { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuraciones de precisión para montos monetarios
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.BudgetedAmount).HasPrecision(18, 2);
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.Discount).HasPrecision(18, 2);
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.TotalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.ExpensePercentage).HasPrecision(5, 2);
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.CapitalizationPercentage).HasPrecision(5, 2);
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.FeePercentage).HasPrecision(5, 2);

        modelBuilder.Entity<RevenueDistribution>()
            .Property(r => r.CalculatedExpenseAmount).HasPrecision(18, 2);
        modelBuilder.Entity<RevenueDistribution>()
            .Property(r => r.CalculatedCapitalizationAmount).HasPrecision(18, 2);
        modelBuilder.Entity<RevenueDistribution>()
            .Property(r => r.CalculatedFeeAmount).HasPrecision(18, 2);
        modelBuilder.Entity<RevenueDistribution>()
            .Property(r => r.ActualCapitalizationAmount).HasPrecision(18, 2);
        modelBuilder.Entity<RevenueDistribution>()
            .Property(r => r.ActualFeePaidAmount).HasPrecision(18, 2);

        modelBuilder.Entity<DirectCost>()
            .Property(d => d.Amount).HasPrecision(18, 2);

        modelBuilder.Entity<FixedCost>()
            .Property(f => f.Amount).HasPrecision(18, 2);

        modelBuilder.Entity<AccountingMovement>()
            .Property(a => a.Amount).HasPrecision(18, 2);

        // Índices únicos
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Relaciones específicas
        // Un cliente puede estar vinculado a un usuario (acceso a portal)
        modelBuilder.Entity<Client>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .IsRequired(false);
            
        // Relación 1:1 entre ServiceOrder y RevenueDistribution
        modelBuilder.Entity<ServiceOrder>()
            .HasOne(s => s.RevenueDistribution)
            .WithOne(r => r.ServiceOrder)
            .HasForeignKey<RevenueDistribution>(r => r.ServiceOrderId);
    }
}
