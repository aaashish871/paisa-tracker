using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PaisaTracker.Api.Models;
using PaisaTracker.Api.Services;

namespace PaisaTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, JwtTokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    public record LoginDto(string Username, string Password);
    public record LoginResponse(string Token, string Username, string? DisplayName, IList<string> Roles);

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user is null)
            return Unauthorized(new { message = "Invalid username or password." });

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: true);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid username or password." });

        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.CreateToken(user, roles);

        return new LoginResponse(token, user.UserName!, user.DisplayName, roles);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<LoginResponse>> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);
        if (user is null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        return new LoginResponse(string.Empty, user.UserName!, user.DisplayName, roles);
    }
}
