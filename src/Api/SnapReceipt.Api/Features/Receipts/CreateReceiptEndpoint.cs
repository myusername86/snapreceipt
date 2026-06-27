using System.Security.Claims;
using Microsoft.Identity.Web;

namespace SnapReceipt.Api.Features.Receipts;

/// <summary>POST /api/receipts — creates a new receipt owned by the signed-in user.</summary>
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
        ClaimsPrincipal user,
        CancellationToken cancellationToken)
    {
        var userId = user.GetObjectId();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var receipt = new Receipt(
            Id: Guid.NewGuid().ToString(),
            Merchant: request.Merchant,
            Total: request.Total,
            Currency: request.Currency,
            PurchasedOn: request.PurchasedOn,
            UserId: userId);

        await repository.UpsertAsync(receipt, cancellationToken);

        return Results.Created($"/api/receipts/{receipt.Id}", receipt);
    }
}

/// <summary>Incoming data for a new receipt — the server assigns the Id and owner.</summary>
public sealed record CreateReceiptRequest(
    string Merchant,
    decimal Total,
    string Currency,
    DateOnly PurchasedOn);