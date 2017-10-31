using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BLL.Core;
using BLL.Services;
using Microsoft.Extensions.Logging;
using System;
using DAL.Core.Interfaces;

namespace DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }

    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly IAccountManager _accountManager;
        private readonly ILogger _logger;

        public DatabaseInitializer(ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger)
        {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            if (!await _context.Users.AnyAsync())
            {
                _logger.LogInformation("Generating inbuilt accounts");

                const string adminRoleName = "administrator";
                await ensureRoleAsync(adminRoleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());

                ApplicationUser applicationUser = new ApplicationUser
                {
                    UserName = "vmural",
                    FullName = "Віталій Мураль",
                    Email = "vmural@hotmail.com",
                    PhoneNumber = "+38 (073) 008-8500",
                    EmailConfirmed = true,
                    IsEnabled = true
                };

                var result = await _accountManager.CreateUserAsync(applicationUser, new string[] { adminRoleName }, "mural1994");

                if (!result.Item1)
                    throw new Exception($"Seeding user failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");


                _logger.LogInformation("Inbuilt account generation completed");
            }
        }



        private async Task ensureRoleAsync(string roleName, string description, string[] claims)
        {
            //if ((await _accountManager.GetRoleByName(roleName)) == null)
            //{
            //    ApplicationRole applicationRole = new ApplicationRole(roleName, description);

            //    var result = await this._accountManager.CreateRoleAsync(applicationRole, claims);

            //    if (!result.Item1)
            //        throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");
            //}
        }
    }
}
