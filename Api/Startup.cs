using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using Newtonsoft.Json;
using BLL.Helpers;
using BLL.Policies;
using AppPermissions = BLL.Core.ApplicationPermissions;
using AspNet.Security.OpenIdConnect.Primitives;
using BLL.Services;
using System.Reflection;
using BLL.Core;
using BLL.DTO;
using CryptoHelper;
using DAL.Core.Interfaces;
using Hangfire;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Serialization;
using NLog.Extensions.Logging;
using NLog.Web;
using OpenIddict.Core;
using Swashbuckle.AspNetCore.Swagger;
using Workers.Messaging;
using Workers.Messaging.Jobs;

namespace Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Enable cors if required
            services.AddCors();

            services.AddMvc();


            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"],
                    b => b.MigrationsAssembly(typeof(Startup).GetTypeInfo().Assembly.GetName().Name));
                options.UseOpenIddict();
            });

            // add identity
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Configure Identity options and password complexity here
            services.Configure<IdentityOptions>(options =>
            {
                // User settings
                options.User.RequireUniqueEmail = true;

                //// Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 5;

                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            services.AddAuthentication(options => {
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddOAuthValidation();


            // Register the OpenIddict services.
            services.AddOpenIddict(options =>
            {
                options.AddEntityFrameworkCoreStores<ApplicationDbContext>();
                options.AddMvcBinders();
                options.EnableTokenEndpoint("/connect/token");
                options.AllowPasswordFlow();
                options.AllowRefreshTokenFlow();
                options.DisableHttpsRequirement();
                //options.UseJsonWebTokens(); //Use JWT if preferred
            });

            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("BearerAuth", new ApiKeyScheme
                {
                    Name = "Authorization",
                    Description = "Login with your bearer authentication token. e.g. Bearer <auth-token>",
                    In = "header",
                    Type = "apiKey"
                });

                c.SwaggerDoc("v1", new Info { Title = "QuickApp API", Version = "v1" });
            });


            //Add Custom Services
            AddServices(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IDatabaseInitializer databaseInitializer)
        {
            //app.UseMiddleware<RequestResponseLoggingMiddleware>();

            if (env.IsDevelopment())
            {
                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                app.UseDeveloperExceptionPage();
            }
            else
            {
                loggerFactory.AddNLog();
                app.AddNLogWeb();

                app.UseExceptionHandler("/Home/Error");
            }

            app.UseExceptionHandler(builder =>
            {
                builder.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = MediaTypeNames.ApplicationJson;

                    var error = context.Features.Get<IExceptionHandlerFeature>();

                    if (error != null)
                    {
                        string errorMsg = JsonConvert.SerializeObject(new { error = error.Error.Message });
                        await context.Response.WriteAsync(errorMsg).ConfigureAwait(false);
                    }
                });
            });


            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "QuickApp API V1");
            });
            app.UseHangfireServer();
            app.UseHangfireDashboard();

            // Configure Cors if enabled
            app.UseCors(builder => builder
                //.WithOrigins("http://admin.forfun.dp.ua")
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod());


            app.UseAuthentication();
            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
                routes.MapSpaFallbackRoute("spa-fallback", new { controller = "Home", action = "Index" });
            });

            //try
            //{
            //    databaseInitializer.SeedAsync().Wait();
            //}
            //catch (Exception ex)
            //{
            //    loggerFactory.CreateLogger<Startup>().LogCritical(LoggingEvents.INIT_DATABASE, ex, LoggingEvents.INIT_DATABASE.Name);
            //    throw;
            //}
        }

        private void AddServices(IServiceCollection services)
        {
            EmailSender.Configuration = new SmtpConfig
            {
                Host = Configuration["SmtpConfig:Host"],
                Port = int.Parse(Configuration["SmtpConfig:Port"]),
                UseSsl = bool.Parse(Configuration["SmtpConfig:UseSSL"]),
                Name = Configuration["SmtpConfig:Name"],
                Username = Configuration["SmtpConfig:Username"],
                EmailAddress = Configuration["SmtpConfig:EmailAddress"],
                Password = Configuration["SmtpConfig:Password"]
            };

            services.AddHangfire(x => x.UseSqlServerStorage(Configuration["Data:DefaultConnection:ConnectionString"]));
          

            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });

            // Add Json CamelCaseNames and ReferenceLoopHandling
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            //Todo: ***Using DataAnnotations for validation until Swashbuckle supports FluentValidation***
            //services.AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());

            services.AddAuthorization(options =>
            {

                options.AddPolicy(AuthPolicies.ViewUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewUsers));
                options.AddPolicy(AuthPolicies.ManageUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageUsers));

                options.AddPolicy(AuthPolicies.ViewRolesPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewRoles));

                options.AddPolicy(AuthPolicies.ManageRolesPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageRoles));

                options.AddPolicy(AuthPolicies.CanCreateOrderPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.CreateOrder));

                options.AddPolicy(AuthPolicies.CanReadOrderPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ReadOrder));

                options.AddPolicy(AuthPolicies.CanUpdateOrderPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.UpdateOrder));

                options.AddPolicy(AuthPolicies.CanDeleteOrderPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.DeleteOrder));


                options.AddPolicy(AuthPolicies.CanCreateProductPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.CreateProduct));

                options.AddPolicy(AuthPolicies.CanReadProductPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ReadProduct));

                options.AddPolicy(AuthPolicies.CanUpdateProductPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.UpdateProduct));

                options.AddPolicy(AuthPolicies.CanDeleteProductPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.DeleteProduct));
            });

            services.AddScoped<ICounterpartiesService, CounterpartiesService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IOrdersService, OrdersService>();
            services.AddScoped<IProductsService, ProductsService>();
            services.AddScoped<IProductCategoriesService, ProductCategoriesService>();
            services.AddScoped<IShipmentsService, ShipmentsService>();
            services.AddScoped<IStoragesService, StoragesService>();
            services.AddScoped<IUtilsService, UtilsService>();
            services.AddScoped<IActivityLogService, ActivityLogService>();
            
            // Repositories
            services.AddScoped<IUnitOfWork, HttpUnitOfWork>();
            services.AddScoped<IAccountManager, AccountManager>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // DB Creation and Seeding
            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();


            services.AddScoped<BLL.Services.Public.IProductsService, BLL.Services.Public.ProductsService>();

        }
    }
}