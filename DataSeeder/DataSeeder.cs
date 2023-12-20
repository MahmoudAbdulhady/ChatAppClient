using Microsoft.AspNetCore.Identity;

namespace ChatAppAngular.DataSeeder
{
    public class DataSeeder
    {
        public static async Task SeedAdminUserAsync(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            string adminEmail = "mahmoud@admin.com";
            string adminPassword = "Mahmoud@20";
            string adminRoleName = "Admin";

            // Check if the Admin role exists
            if (!await roleManager.RoleExistsAsync(adminRoleName))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRoleName));
            }

            // Check if the Admin user exists
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRoleName);
                }
            }
        }
    }
}
