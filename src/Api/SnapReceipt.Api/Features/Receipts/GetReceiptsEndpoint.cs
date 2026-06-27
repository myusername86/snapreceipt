using System.Security.Claims;
using Microsoft.Identity.Web;

namespace SnapReceipt.Api.Features.Receipts;

/// <summary>GET /api/receipts — returns the signed-in user's receipts from Cosmos DB.</summary>
public static class GetReceiptsEndpoint
{
    public static void Map(IEndpointRouteBuilder group)
    {
        group.MapGet("/", Handle)
            .WithName("GetReceipts")
            .Produces<IReadOnlyList<Receipt>>();
    }

    private static async Task<IResult> Handle(
        ReceiptRepository repository,
        ClaimsPrincipal user,
        CancellationToken cancellationToken)
    {
        var userId = user.GetObjectId();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var receipts = await repository.GetAllAsync(userId, cancellationToken);
        return Results.Ok(receipts);
    }
}