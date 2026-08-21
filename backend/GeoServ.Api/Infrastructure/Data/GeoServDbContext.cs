using GeoServ.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Infrastructure.Data;

public class GeoServDbContext : DbContext
{
    public GeoServDbContext(DbContextOptions<GeoServDbContext> options) : base(options)
    {
    }

    public DbSet<Empresa> Empresas { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Client> Clients { get; set; } = null!;
    public DbSet<ServiceType> ServiceTypes { get; set; } = null!;
    public DbSet<CompanyType> CompanyTypes { get; set; } = null!;
    public DbSet<ServiceOrder> ServiceOrders { get; set; } = null!;
    public DbSet<ServiceOrderStatus> ServiceOrderStatuses { get; set; } = null!;
    public DbSet<DistributionConcept> DistributionConcepts { get; set; } = null!;
    public DbSet<ServiceOrderDistribution> ServiceOrderDistributions { get; set; } = null!;
    public DbSet<ServiceOrderActivity> ServiceOrderActivities { get; set; } = null!;
    public DbSet<Responsible> Responsibles { get; set; } = null!;
    public DbSet<ServiceOrderResponsible> ServiceOrderResponsibles { get; set; } = null!;
    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<ServiceOrderDocument> ServiceOrderDocuments { get; set; } = null!;
    public DbSet<Currency> Currencies { get; set; } = null!;
    public DbSet<DirectCost> DirectCosts { get; set; } = null!;
    public DbSet<FixedCostCategory> FixedCostCategories { get; set; } = null!;
    public DbSet<FixedCost> FixedCosts { get; set; } = null!;
    public DbSet<AccountingMovement> AccountingMovements { get; set; } = null!;
    public DbSet<ServiceOrderObservation> ServiceOrderObservations { get; set; } = null!;

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
            .Property(o => o.CollectedAmount).HasPrecision(18, 2);

        modelBuilder.Entity<ServiceOrderDistribution>()
            .Property(d => d.Percentage).HasPrecision(5, 2);
        modelBuilder.Entity<ServiceOrderDistribution>()
            .Property(d => d.ExpectedAmount).HasPrecision(18, 2);
        modelBuilder.Entity<ServiceOrderDistribution>()
            .Property(d => d.ActualAmount).HasPrecision(18, 2);

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

        modelBuilder.Entity<ServiceOrder>()
            .HasIndex(s => s.OrderNumber)
            .IsUnique();

        // Relaciones específicas
        // Un cliente puede estar vinculado a un usuario (acceso a portal)
        modelBuilder.Entity<Client>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .IsRequired(false);
            
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.ForeignAmount).HasPrecision(18, 2);
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.ExchangeRateAtBudget).HasPrecision(18, 4);
        modelBuilder.Entity<ServiceOrder>()
            .Property(o => o.ExchangeRateAtCollection).HasPrecision(18, 4);

        // Relación N:M ServiceOrder - Responsible
        modelBuilder.Entity<ServiceOrderResponsible>()
            .HasKey(sor => new { sor.ServiceOrderId, sor.ResponsibleId });

        modelBuilder.Entity<ServiceOrderResponsible>()
            .HasOne(sor => sor.ServiceOrder)
            .WithMany(so => so.Responsibles)
            .HasForeignKey(sor => sor.ServiceOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ServiceOrderResponsible>()
            .HasOne(sor => sor.Responsible)
            .WithMany()
            .HasForeignKey(sor => sor.ResponsibleId)
            .OnDelete(DeleteBehavior.Restrict);

        // Restricción única de Usuario por Responsable
        modelBuilder.Entity<Responsible>()
            .HasIndex(r => r.UserId)
            .IsUnique();

        modelBuilder.Entity<ServiceOrder>()
            .HasMany(s => s.Activities)
            .WithOne(a => a.ServiceOrder)
            .HasForeignKey(a => a.ServiceOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ServiceOrder>()
            .HasMany(s => s.Distributions)
            .WithOne(d => d.ServiceOrder)
            .HasForeignKey(d => d.ServiceOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ServiceOrder>()
            .HasMany(s => s.Documents)
            .WithOne(d => d.ServiceOrder)
            .HasForeignKey(d => d.ServiceOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ServiceOrder>()
            .HasMany(s => s.Observations)
            .WithOne(o => o.ServiceOrder)
            .HasForeignKey(o => o.ServiceOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // --- Seed Data ---
        
        modelBuilder.Entity<DistributionConcept>().HasData(
            new DistributionConcept { Id = Guid.Parse("E1111111-1111-1111-1111-111111111111"), Name = "Amortización Gastos" },
            new DistributionConcept { Id = Guid.Parse("E2222222-2222-2222-2222-222222222222"), Name = "Capitalización" },
            new DistributionConcept { Id = Guid.Parse("E3333333-3333-3333-3333-333333333333"), Name = "Honorarios" },
            new DistributionConcept { Id = Guid.Parse("E4444444-4444-4444-4444-444444444444"), Name = "Utilidad" }
        );

        modelBuilder.Entity<ServiceOrderStatus>().HasData(
            new ServiceOrderStatus { Id = Guid.Parse("A1111111-1111-1111-1111-111111111111"), Name = "Alta", Description = "Orden recién registrada", OrderIndex = 1 },
            new ServiceOrderStatus { Id = Guid.Parse("A2222222-2222-2222-2222-222222222222"), Name = "Presupuestada", Description = "Presupuesto enviado al cliente", OrderIndex = 2 },
            new ServiceOrderStatus { Id = Guid.Parse("A3333333-3333-3333-3333-333333333333"), Name = "Aprobada", Description = "Presupuesto aprobado por el cliente", OrderIndex = 3 },
            new ServiceOrderStatus { Id = Guid.Parse("A4444444-4444-4444-4444-444444444444"), Name = "Iniciada", Description = "Trabajo en ejecución", OrderIndex = 4 },
            new ServiceOrderStatus { Id = Guid.Parse("A5555555-5555-5555-5555-555555555555"), Name = "Entregada", Description = "Trabajo entregado al cliente", OrderIndex = 5 },
            new ServiceOrderStatus { Id = Guid.Parse("A6666666-6666-6666-6666-666666666666"), Name = "Cobrada", Description = "Orden pagada en su totalidad", OrderIndex = 6 },
            new ServiceOrderStatus { Id = Guid.Parse("A7777777-7777-7777-7777-777777777777"), Name = "Cancelada", Description = "Orden anulada o cancelada", OrderIndex = 7 }
        );

        modelBuilder.Entity<ServiceType>().HasData(
            new ServiceType { Id = Guid.Parse("B1111111-1111-1111-1111-111111111111"), Name = "Levantamiento Topográfico", Description = "Medición y representación gráfica del terreno" },
            new ServiceType { Id = Guid.Parse("B2222222-2222-2222-2222-222222222222"), Name = "Mensura", Description = "Determinación de límites de propiedad" },
            new ServiceType { Id = Guid.Parse("B3333333-3333-3333-3333-333333333333"), Name = "Estudio Geodésico", Description = "Posicionamiento de alta precisión" },
            new ServiceType { Id = Guid.Parse("B4444444-4444-4444-4444-444444444444"), Name = "Fotogrametría", Description = "Levantamiento mediante drones o imágenes satelitales" },
            new ServiceType { Id = Guid.Parse("B5555555-5555-5555-5555-555555555555"), Name = "Consultoría Técnica", Description = "Asesoramiento en proyectos de ingeniería" }
        );

        modelBuilder.Entity<FixedCostCategory>().HasData(
            new FixedCostCategory { Id = Guid.Parse("C1111111-1111-1111-1111-111111111111"), Name = "Alquileres", Description = "Pagos de alquiler de oficina o locales" },
            new FixedCostCategory { Id = Guid.Parse("C2222222-2222-2222-2222-222222222222"), Name = "Sueldos y Cargas Sociales", Description = "Nómina de empleados fijos" },
            new FixedCostCategory { Id = Guid.Parse("C3333333-3333-3333-3333-333333333333"), Name = "Servicios Básicos", Description = "Luz, agua, internet, telefonía" },
            new FixedCostCategory { Id = Guid.Parse("C4444444-4444-4444-4444-444444444444"), Name = "Software e IT", Description = "Suscripciones, licencias, hosting" },
            new FixedCostCategory { Id = Guid.Parse("C5555555-5555-5555-5555-555555555555"), Name = "Impuestos y Seguros", Description = "Tasas municipales, seguros de responsabilidad, etc." },
            new FixedCostCategory { Id = Guid.Parse("C6666666-6666-6666-6666-666666666666"), Name = "Honorarios Profesionales", Description = "Contadores, abogados (fijos)" }
        );

        modelBuilder.Entity<CompanyType>().HasData(
            new CompanyType { Id = Guid.Parse("D1111111-1111-1111-1111-111111111111"), Name = "Proyecto Minero" },
            new CompanyType { Id = Guid.Parse("D2222222-2222-2222-2222-222222222222"), Name = "Consultora Minera" },
            new CompanyType { Id = Guid.Parse("D3333333-3333-3333-3333-333333333333"), Name = "Contratista Minero" },
            new CompanyType { Id = Guid.Parse("D4444444-4444-4444-4444-444444444444"), Name = "Establecimiento Gubernamental" },
            new CompanyType { Id = Guid.Parse("D5555555-5555-5555-5555-555555555555"), Name = "Académico / Universitario" },
            new CompanyType { Id = Guid.Parse("D6666666-6666-6666-6666-666666666666"), Name = "Particular / Inversionista" },
            new CompanyType { Id = Guid.Parse("D8888888-8888-8888-8888-888888888888"), Name = "Compañía Minera" },
            new CompanyType { Id = Guid.Parse("D7777777-7777-7777-7777-777777777777"), Name = "Otro" }
        );

        modelBuilder.Entity<Currency>().HasData(
            new Currency { Id = Guid.Parse("F1111111-1111-1111-1111-111111111111"), Code = "ARS", Symbol = "$", Name = "Peso Argentino", IsActive = true },
            new Currency { Id = Guid.Parse("F2222222-2222-2222-2222-222222222222"), Code = "USD", Symbol = "U$D", Name = "Dólar Estadounidense", IsActive = true },
            new Currency { Id = Guid.Parse("F3333333-3333-3333-3333-333333333333"), Code = "CLP", Symbol = "$", Name = "Peso Chileno", IsActive = true }
        );
    }
}
