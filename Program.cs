using ChatAppAngular;
using ChatAppAngular.DataSeeder;
using ChatAppAngular.Mapping;
using ChatAppAngular.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.WithOrigins("http://localhost:4200") // Replace with your Angular app's URL
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});



builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnectionString"));
});


//builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
//{
//    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
//    options.Password.RequireDigit = true; // Requires a number
//    options.Password.RequireLowercase = true; // Requires lowercase letter
//    options.Password.RequireUppercase = true; // Requires uppercase letter
//    options.Password.RequiredLength = 8; // Set the minimum length here
//    options.Password.RequireNonAlphanumeric = true; // Set to true if you require a non-alphanumeric character
//})
//            .AddEntityFrameworkStores<ApplicationDbContext>()
//            .AddDefaultTokenProviders();


builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();


builder.Services.AddAuthentication();

builder.Services.ConfigureApplicationCookie(options =>
{
    // Cookie settings
    options.Cookie.Name = "livechat";
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    options.Cookie.SameSite = SameSiteMode.None;
    options.SlidingExpiration = true;
    options.Cookie.IsEssential = true;
    options.LoginPath = "/api/Account/Login";
    options.LogoutPath = "/api/Account/logout";
    // ... other options
});



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<ConnectionMapping<string>>();
builder.Services.AddSignalR();





var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}




using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    await DataSeeder.SeedAdminUserAsync(userManager, roleManager);
}




app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();


app.UseHttpsRedirection();



app.MapControllers();

app.MapHub<ChatHub>("/chatHub");

app.Run();
