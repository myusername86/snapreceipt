using System;
using System.IO;
using System.Threading.Tasks;
using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace SnapReceipt.Functions;

public class ScanReceipt
{
    private readonly ILogger<ScanReceipt> _logger;

    public ScanReceipt(ILogger<ScanReceipt> logger)
    {
        _logger = logger;
    }

    [Function("ScanReceipt")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
    {
        _logger.LogInformation("ScanReceipt called.");

        // 1. Read the uploaded image bytes from the request body
        using var ms = new MemoryStream();
        await req.Body.CopyToAsync(ms);
        var imageBytes = ms.ToArray();

        if (imageBytes.Length == 0)
        {
            return new BadRequestObjectResult("No image was uploaded.");
        }

        // 2. Read endpoint + key from configuration (local.settings.json locally)
        var endpoint = Environment.GetEnvironmentVariable("DOCINTEL_ENDPOINT");
        var key = Environment.GetEnvironmentVariable("DOCINTEL_KEY");

        if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(key))
        {
            return new ObjectResult("Document Intelligence is not configured.") { StatusCode = 500 };
        }

        // 3. Call Document Intelligence prebuilt-receipt model
        var client = new DocumentIntelligenceClient(new Uri(endpoint), new AzureKeyCredential(key));
        var options = new AnalyzeDocumentOptions("prebuilt-receipt", BinaryData.FromBytes(imageBytes));

        Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, options);
        AnalyzeResult result = operation.Value;

        if (result.Documents.Count == 0)
        {
            return new OkObjectResult(new ScanResult(null, null, null, null));
        }

        AnalyzedDocument receipt = result.Documents[0];

        // 4. Pull out the fields we care about
        string? merchant = null;
        decimal? total = null;
        string? currency = null;
        string? purchasedOn = null;

        if (receipt.Fields.TryGetValue("MerchantName", out var merchantField))
        {
            merchant = merchantField.ValueString;
        }

        if (receipt.Fields.TryGetValue("Total", out var totalField) && totalField.ValueCurrency is not null)
        {
            total = (decimal)totalField.ValueCurrency.Amount;
            currency = totalField.ValueCurrency.CurrencyCode;
        }

        if (receipt.Fields.TryGetValue("TransactionDate", out var dateField) && dateField.ValueDate is not null)
        {
            purchasedOn = dateField.ValueDate.Value.ToString("yyyy-MM-dd");
        }

        // 5. Return JSON the Add Receipt form can pre-fill
        return new OkObjectResult(new ScanResult(merchant, total, currency, purchasedOn));
    }

    private record ScanResult(string? Merchant, decimal? Total, string? Currency, string? PurchasedOn);
}