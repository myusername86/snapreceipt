using System.Security.Claims;
using Microsoft.Identity.Web;

namespace SnapReceipt.Api.Features.Receipts;

/// <summary>DELETE /api/receipts/{id} — removes a receipt the signed-in user owns.</summary>
public static class DeleteReceiptEndpoint
{
    public static void Map(IEndpointRouteBuilder group)
    {
        group.MapDelete("/{id}", Handle)
            .WithName("DeleteReceipt")
            .WithSummary("Delete a receipt")
            .Produces(StatusCodes.Status204NoContent);
    }

    private static async Task<IResult> Handle(
        string id,
        ReceiptRepository repository,
        ClaimsPrincipal user,
        CancellationToken cancellationToken)
    {
        var userId = user.GetObjectId();
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        // Only allow deleting a receipt the caller actually owns.
        var existing = await repository.GetByIdAsync(id, userId, cancellationToken);
        if (existing is null)
            return Results.NotFound();

        await repository.DeleteAsync(id, cancellationToken);
        return Results.NoContent();
    }
}