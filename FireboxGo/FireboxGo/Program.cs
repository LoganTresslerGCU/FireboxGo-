using FireboxGo.DAOs;
using FireboxGo.Services;
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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://192.168.1.28:8081", "https://192.168.1.28:8081")  // React Native app's IP
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Parse("192.168.1.28"), 5189);  // HTTP
    options.Listen(IPAddress.Parse("192.168.1.28"), 7114, listenOptions =>
    {
        listenOptions.UseHttps();  // HTTPS
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
