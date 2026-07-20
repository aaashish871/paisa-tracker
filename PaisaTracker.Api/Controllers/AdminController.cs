using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PaisaTracker.Api.Models;

namespace PaisaTracker.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = Roles.Admin)]
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public record UserDto(string Id, string Username, string? DisplayName, string Role, DateTime CreatedAt);
    public record CreateUserDto(string Username, string Password, string? DisplayName, string Role);
    public record ResetPasswordDto(string NewPassword);
    public record ChangeRoleDto(string Role);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = _userManager.Users.ToList();
        var result = new List<UserDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new UserDto(user.Id, user.UserName!, user.DisplayName, roles.FirstOrDefault() ?? "", user.CreatedAt));
        }
        return result.OrderBy(u => u.Username).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto dto)
    {
        if (dto.Role != Roles.Admin && dto.Role != Roles.SuperUser)
            return BadRequest(new { message = "Role must be Admin or SuperUser." });

        var user = new ApplicationUser
        {
            UserName = dto.Username,
            DisplayName = dto.DisplayName,
            EmailConfirmed = true,
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });

        await _userManager.AddToRoleAsync(user, dto.Role);

        return new UserDto(user.Id, user.UserName!, user.DisplayName, dto.Role, user.CreatedAt);
    }

    [HttpPut("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(string id, ResetPasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join(" ", result.Errors.Select(e => e.Description)) });

        return NoContent();
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> ChangeRole(string id, ChangeRoleDto dto)
    {
        if (dto.Role != Roles.Admin && dto.Role != Roles.SuperUser)
            return BadRequest(new { message = "Role must be Admin or SuperUser." });

        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, dto.Role);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();

        await _userManager.DeleteAsync(user);
        return NoContent();
    }
}
