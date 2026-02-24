using Microsoft.EntityFrameworkCore;
using CompanyBackend.Models;

namespace CompanyBackend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed some initial data
        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1, Name = "Alice Smith", Department = "Engineering", Role = "Frontend Developer" },
            new Employee { Id = 2, Name = "Bob Johnson", Department = "Engineering", Role = "Backend Developer" },
            new Employee { Id = 3, Name = "Charlie Davis", Department = "HR", Role = "HR Manager" },
            new Employee { Id = 4, Name = "Diana Prince", Department = "Management", Role = "CTO" },
            new Employee { Id = 5, Name = "Evan Wright", Department = "Design", Role = "UI/UX Designer" }
        );
    }
}
