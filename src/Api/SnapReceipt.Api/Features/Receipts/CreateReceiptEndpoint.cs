namespace SnapReceipt.Api.Features.Receipts;

/// <summary>POST /api/receipts — creates a new receipt in Cosmos DB.</summary>
public static class CreateReceiptEndpoint
{
    public static void Map(IEndpointRouteBuilder group)
    {
        group.MapPost("/", Handle)
            .WithName("CreateReceipt")
            .WithSummary("Create a receipt")
            .Produces<Receipt>(StatusCodes.Status201Created);
    }

    private static async Task<IResult> Handle(
        CreateReceiptRequest request,
        ReceiptRepository repository,
        CancellationToken cancellationToken)
    {
        var receipt = new Receipt(
            Id: Guid.NewGuid().ToString(),
            Merchant: request.Merchant,
            Total: request.Total,
            Currency: request.Currency,
            PurchasedOn: request.PurchasedOn);

        await repository.UpsertAsync(receipt, cancellationToken);

        return Results.Created($"/api/receipts/{receipt.Id}", receipt);
    }
}

/// <summary>Incoming data for a new receipt — the server assigns the Id.</summary>
public sealed record CreateReceiptRequest(
    string Merchant,
    decimal Total,
    string Currency,
    DateOnly PurchasedOn);