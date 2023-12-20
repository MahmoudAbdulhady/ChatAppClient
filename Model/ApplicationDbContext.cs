using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatAppAngular.Model
{
    public class ApplicationDbContext : IdentityDbContext
    {

        public ApplicationDbContext()
        {

        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<IdentityRole>().HasData(
       new IdentityRole
       {
           Id = "3",
           Name = "Admin",
           NormalizedName = "ADMIN"
       }
   );

            modelBuilder.Entity<IdentityRole>().HasData(
          new IdentityRole
          {
              Id = "4",
              Name= "User",
              NormalizedName="USER"
          }
      );

            modelBuilder.Entity<IdentityUser>().HasData(
                new IdentityUser
                {
                    Id = "3",
                    UserName = "admin@gmail.com",
                    NormalizedUserName = "ADMIN@GMAIL.COM",
                    Email = "admin@gmail.com",
                    NormalizedEmail = "ADMIN@GMAIL.COM",
                    EmailConfirmed = true,
                    PasswordHash = "Test@2023",
                    SecurityStamp = string.Empty
                }
            );



            modelBuilder.Entity<IdentityUser>().HasData(
              new IdentityUser
              {
                  Id ="4",
                  UserName = "user@gmail.com",
                  NormalizedUserName = "user@GMAIL.COM",
                  Email = "user@gmail.com",
                  NormalizedEmail = "ADMIN@GMAIL.COM",
                  EmailConfirmed = true,
                  PasswordHash = "<HashedPasswordHere>",
                  SecurityStamp = string.Empty
              }
          );


            modelBuilder.Entity<IdentityUserRole<string>>().HasData(
    new IdentityUserRole<string>
    {
        RoleId = "3", // Admin Role ID
        UserId = "3"   // Admin User ID
    },
    new IdentityUserRole<string>
    {
        RoleId = "4", 
        UserId = "4"  
    }
);

        }
    }
}
