namespace SnapReceipt.Api.Features.Receipts;

/// <summary>PUT /api/receipts/{id} — updates an existing receipt in Cosmos DB.</summary>
public static class UpdateReceiptEndpoint
{
    public static void Map(IEndpointRouteBuilder group)
    {
        group.MapPut("/{id}", Handle)
            .WithName("UpdateReceipt")
            .WithSummary("Update a receipt")
            .Produces<Receipt>();
    }

    private static async Task<IResult> Handle(
        string id,
        UpdateReceiptRequest request,
        ReceiptRepository repository,
        CancellationToken cancellationToken)
    {
        var receipt = new Receipt(
            Id: id,
            Merchant: request.Merchant,
            Total: request.Total,
            Currency: request.Currency,
            PurchasedOn: request.PurchasedOn);

        await repository.UpsertAsync(receipt, cancellationToken);

        return Results.Ok(receipt);
    }
}

/// <summary>Incoming data for updating a receipt — the Id comes from the route.</summary>
public sealed record UpdateReceiptRequest(
    string Merchant,
    decimal Total,
    string Currency,
    DateOnly PurchasedOn);