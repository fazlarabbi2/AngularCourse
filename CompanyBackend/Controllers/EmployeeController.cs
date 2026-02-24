using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using CompanyBackend.Models;
using CompanyBackend.Data;

namespace CompanyBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly ILogger<EmployeeController> _logger;

    public EmployeeController(AppDbContext context, IDistributedCache cache, ILogger<EmployeeController> logger)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        string cacheKey = "employeeList";
        var cachedData = await _cache.GetStringAsync(cacheKey);

        if (!string.IsNullOrEmpty(cachedData))
        {
            _logger.LogInformation("Returning employees from Redis cache.");
            return Ok(JsonSerializer.Deserialize<List<Employee>>(cachedData));
        }

        _logger.LogInformation("Simulating slow database lookup...");
        await Task.Delay(2000); // 2 seconds artificial delay for DB query

        var employees = await _context.Employees.ToListAsync();
        var serializedData = JsonSerializer.Serialize(employees);

        // Cache for 30 seconds
        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
        };

        await _cache.SetStringAsync(cacheKey, serializedData, cacheOptions);
        _logger.LogInformation("Employees cached in Redis.");

        return Ok(employees);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return NotFound(new { message = "Employee not found." });

        return Ok(employee);
    }

    [HttpPost("secret")]
    public IActionResult GetSecretData()
    {
        // Simple mock authentication check - requires "Authorization: Bearer my-auth-token-12345"
        if (!Request.Headers.TryGetValue("Authorization", out var authHeader) || !authHeader.ToString().StartsWith("Bearer my-auth-token-12345"))
        {
            return Unauthorized(new { message = "Unauthorized: Invalid or missing token." });
        }

        return Ok(new { message = "Super secret company data accessed successfully!" });
    }

    [HttpGet("/api/error/{statusCode}")]
    public IActionResult TriggerError(int statusCode)
    {
        return StatusCode(statusCode, new { message = $"This is an artificially triggered {statusCode} error." });
    }
}
