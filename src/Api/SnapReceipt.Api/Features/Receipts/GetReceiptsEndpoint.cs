namespace SnapReceipt.Api.Features.Receipts;

/// <summary>GET /api/receipts — returns the user's receipts from Cosmos DB.</summary>
public static class GetReceiptsEndpoint
{
    public static void Map(IEndpointRouteBuilder group)
    {
        group.MapGet("/", Handle)
            .WithName("GetReceipts")
            .Produces<IReadOnlyList<Receipt>>();
    }

    private static async Task<IResult> Handle(ReceiptRepository repository, CancellationToken cancellationToken)
    {
        var receipts = await repository.GetAllAsync(cancellationToken);
        return Results.Ok(receipts);
    }
}