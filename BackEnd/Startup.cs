using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BookApi.Repository;
using BookApi.Data;
using Microsoft.EntityFrameworkCore;

namespace BookApi
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IRelatoriosRepository, RelatoriosRepository>();


            var connection = @"server=DESKTOP-RIQ2O00\SQLEXPRESS_2017;database=Locadora;user=sa;password=plkadmin2002@";
            services.AddDbContext<DataContext>(options => options.UseSqlServer(connection));

            services.AddMvcCore();
            services.AddCors();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(
                options => options.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                );

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    context.Response.Headers.Add("Content-Type", "text/html; charset=utf-8");
                    await context.Response.WriteAsync("Web API");
                });

                endpoints.MapControllers();
            });
        }
    }
}
