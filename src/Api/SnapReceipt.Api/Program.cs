using System.Text.Json;
using Microsoft.Azure.Cosmos;
using Scalar.AspNetCore;
using SnapReceipt.Api.Extensions;
using SnapReceipt.Api.Features.Receipts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();
builder.Services.AddProblemDetails();

const string FrontendCors = "frontend";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCors, policy => policy
        .WithOrigins(
            "http://localhost:5173",
            "https://thankful-dune-03b097403.7.azurestaticapps.net")
        .AllowAnyHeader()
        .AllowAnyMethod()));

// --- Cosmos DB ---
var cosmosConnectionString = builder.Configuration["Cosmos:ConnectionString"]
    ?? throw new InvalidOperationException("Cosmos:ConnectionString is not configured.");
var cosmosDatabaseName = builder.Configuration["Cosmos:Database"] ?? "snapreceipt";
var cosmosContainerName = builder.Configuration["Cosmos:Container"] ?? "receipts";

builder.Services.AddSingleton(_ => new CosmosClient(
    cosmosConnectionString,
    new CosmosClientOptions
    {
        UseSystemTextJsonSerializerWithOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        },
    }));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<CosmosClient>().GetContainer(cosmosDatabaseName, cosmosContainerName));

builder.Services.AddScoped<ReceiptRepository>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors(FrontendCors);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapHealthChecks("/health");
app.MapReceiptEndpoints();

// --- Ensure the database/container exist, then seed sample data ---
using (var scope = app.Services.CreateScope())
{
    var cosmosClient = scope.ServiceProvider.GetRequiredService<CosmosClient>();
    var database = await cosmosClient.CreateDatabaseIfNotExistsAsync(cosmosDatabaseName);
    await database.Database.CreateContainerIfNotExistsAsync(cosmosContainerName, "/id");

    var repository = scope.ServiceProvider.GetRequiredService<ReceiptRepository>();
    await ReceiptSeeder.EnsureSeededAsync(repository);
}

app.Run();

public partial class Program;