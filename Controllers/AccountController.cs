using ChatAppAngular.Model.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatAppAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<IdentityUser> _signInManager;


        public AccountController( UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDTO model) 
        {
            var user = new IdentityUser
            {
                Email = model.Email,
                UserName = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if(result.Succeeded)
            {
                if (!await _roleManager.RoleExistsAsync("User"))
                {
                    var role = new IdentityRole("User");
                    await _roleManager.CreateAsync(role);
                }
                // Add the new user to the User role
                await _userManager.AddToRoleAsync(user, "User");
                return Ok(new { Username = user.UserName });
            }
          
            return BadRequest(result.Errors);
        }

        [HttpPost("Login")]
        public async Task<IActionResult>Login(LoginDTO model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password ,true , false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);


                //Setting the Cookie 
                await _signInManager.SignInAsync(user, isPersistent: true);

                //Retrive the user Role 
                var userRole = await _userManager.GetRolesAsync(user);

                //include the user Email 
                var response = new
                {
                    Email = user.Email,
                    Role = userRole.FirstOrDefault()?.ToString()
                };

                return Ok(response);
            }
            else
            {
                // Handle failed login
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                return BadRequest(ModelState);
            }
            return Unauthorized(model);

        }




        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

    }
 }
