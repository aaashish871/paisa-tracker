using Microsoft.AspNetCore.Identity;
using PaisaTracker.Api.Models;

namespace PaisaTracker.Api.Services;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration config)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        foreach (var role in new[] { Roles.Admin, Roles.SuperUser })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        var seedSection = config.GetSection("SeedAdmin");
        var adminUsername = seedSection["Username"] ?? "admin";
        var adminPassword = seedSection["Password"] ?? "ChangeMe#2026";

        if (await userManager.FindByNameAsync(adminUsername) is null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminUsername,
                DisplayName = "Administrator",
                EmailConfirmed = true,
            };
            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, Roles.Admin);
            }
        }
    }
}
