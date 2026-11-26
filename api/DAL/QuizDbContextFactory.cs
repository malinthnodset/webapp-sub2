using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace api.DAL;

// tells the EF core's command-line how to create a QuizDbContext
// when there is no running app to get one from
public class QuizDbContextFactory : IDesignTimeDbContextFactory<QuizDbContext>
{
    public QuizDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("QuizDbContextConnection")
            ?? throw new InvalidOperationException("Connection string 'QuizDbContextConnection' was not found.");

        var options = new DbContextOptionsBuilder<QuizDbContext>()
            .UseSqlite(connectionString)
            .Options;

        return new QuizDbContext(options);
    }
}
