using System.Security.Claims;
using Microsoft.Identity.Web;

namespace SnapReceipt.Api.Features.Receipts;

/// <summary>PUT /api/receipts/{id} — updates a receipt the signed-in user owns.</summary>
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
        ClaimsPrincipal user,
        CancellationToken cancellationToken)
    {
        var userId = user.GetObjectId();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        // Only allow updating a receipt the caller actually owns.
        var existing = await repository.GetByIdAsync(id, userId, cancellationToken);
        if (existing is null)
            return Results.NotFound();

        var receipt = new Receipt(
            Id: id,
            Merchant: request.Merchant,
            Total: request.Total,
            Currency: request.Currency,
            PurchasedOn: request.PurchasedOn,
            UserId: userId);

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