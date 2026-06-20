namespace SnapReceipt.Api.Features.Receipts;

/// <summary>DELETE /api/receipts/{id} — removes a receipt from Cosmos DB.</summary>
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
        CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(id, cancellationToken);
        return Results.NoContent();
    }
}