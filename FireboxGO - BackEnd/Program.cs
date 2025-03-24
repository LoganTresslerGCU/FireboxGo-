using FireboxGo.DAOs;
using FireboxGo.Services;
using FireboxGo.Security;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<DataService>();
builder.Services.AddScoped<UserDAO>();
builder.Services.AddScoped<FolderDAO>();
builder.Services.AddScoped<ItemDAO>();
builder.Services.AddScoped<DocDAO>();
builder.Services.AddScoped<SecurityHasher>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://172.24.16.220:8081", "https://172.24.16.220:8081") 
            .AllowAnyMethod()
            .AllowAnyHeader();
        /*
        builder.WithOrigins("http://192.168.1.29:8081", "https://192.168.1.29:8081")
            .AllowAnyMethod()
            .AllowAnyHeader();
        */
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Parse("172.24.44.3"), 5189);  // HTTP
    options.Listen(IPAddress.Parse("172.24.44.3"), 7114, listenOptions =>
    {
        listenOptions.UseHttps();  // HTTPS
    });
    
    /*
    options.Listen(IPAddress.Parse("192.168.1.29"), 5189);  // HTTP
    options.Listen(IPAddress.Parse("192.168.1.29"), 7114, listenOptions =>
    {
        listenOptions.UseHttps();  // HTTPS
    });
    */
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
