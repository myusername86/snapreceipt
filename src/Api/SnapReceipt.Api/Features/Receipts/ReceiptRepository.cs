using Microsoft.Azure.Cosmos;

namespace SnapReceipt.Api.Features.Receipts;

/// <summary>Reads and writes <see cref="Receipt"/> documents in Cosmos DB, scoped per user.</summary>
public sealed class ReceiptRepository(Container container)
{
    /// <summary>Returns only the receipts owned by the given user.</summary>
    public async Task<IReadOnlyList<Receipt>> GetAllAsync(string userId, CancellationToken cancellationToken = default)
    {
        var receipts = new List<Receipt>();
        var query = new QueryDefinition("SELECT * FROM c WHERE c.userId = @userId")
            .WithParameter("@userId", userId);

        using var iterator = container.GetItemQueryIterator<Receipt>(query);
        while (iterator.HasMoreResults)
        {
            var page = await iterator.ReadNextAsync(cancellationToken);
            receipts.AddRange(page);
        }

        return receipts;
    }

    /// <summary>Gets a single receipt only if it belongs to the given user; otherwise null.</summary>
    public async Task<Receipt?> GetByIdAsync(string id, string userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await container.ReadItemAsync<Receipt>(
                id, new PartitionKey(id), cancellationToken: cancellationToken);
            return response.Resource.UserId == userId ? response.Resource : null;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public Task UpsertAsync(Receipt receipt, CancellationToken cancellationToken = default) =>
        container.UpsertItemAsync(receipt, new PartitionKey(receipt.Id), cancellationToken: cancellationToken);

    public Task DeleteAsync(string id, CancellationToken cancellationToken = default) =>
        container.DeleteItemAsync<Receipt>(id, new PartitionKey(id), cancellationToken: cancellationToken);

    /// <summary>
    /// One-time backfill: assigns every owner-less receipt (userId == null) to the given user.
    /// Lets you keep the receipts you created before per-user ownership existed.
    /// </summary>
    public async Task<int> ClaimOrphansAsync(string userId, CancellationToken cancellationToken = default)
    {
        var orphans = new List<Receipt>();
        using var iterator = container.GetItemQueryIterator<Receipt>(
            "SELECT * FROM c WHERE NOT IS_DEFINED(c.userId) OR c.userId = null");

        while (iterator.HasMoreResults)
        {
            var page = await iterator.ReadNextAsync(cancellationToken);
            orphans.AddRange(page);
        }

        foreach (var orphan in orphans)
        {
            var owned = orphan with { UserId = userId };
            await container.UpsertItemAsync(owned, new PartitionKey(owned.Id), cancellationToken: cancellationToken);
        }

        return orphans.Count;
    }
}