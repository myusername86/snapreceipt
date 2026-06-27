using System.Security.Claims;
using Microsoft.Identity.Web;

namespace SnapReceipt.Api.Features.Receipts;

/// <summary>
/// POST /api/receipts/claim-orphans — one-time backfill that assigns every receipt
/// with no owner to the signed-in user. Lets you keep pre-auth receipts as your own.
/// </summary>
public static class ClaimOrphansEndpoint
{
    public static void Map(IEndpointRouteBuilder group)
    {
        group.MapPost("/claim-orphans", Handle)
            .WithName("ClaimOrphans")
            .WithSummary("Assign all owner-less receipts to the signed-in user");
    }

    private static async Task<IResult> Handle(
        ReceiptRepository repository,
        ClaimsPrincipal user,
        CancellationToken cancellationToken)
    {
        var userId = user.GetObjectId();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var claimed = await repository.ClaimOrphansAsync(userId, cancellationToken);
        return Results.Ok(new { claimed });
    }
}