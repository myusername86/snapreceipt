namespace SnapReceipt.Api.Features.Receipts;

public static class GetReceiptsEndpoint
{
    public static void Map(IEndpointRouteBuilder group)
    {
        group.MapGet("/", Handle).WithName("GetReceipts").Produces<IReadOnlyList<Receipt>>();
    }

    private static IResult Handle()
    {
        IReadOnlyList<Receipt> receipts =
        [
            new("seed-1", "ICA Maxi", 482.50m, "SEK", new DateOnly(2026, 6, 1)),
            new("seed-2", "Systembolaget", 199.00m, "SEK", new DateOnly(2026, 6, 3)),
        ];
        return Results.Ok(receipts);
    }
}