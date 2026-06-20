using Microsoft.Azure.Cosmos;

namespace SnapReceipt.Api.Features.Receipts;

/// <summary>Reads and writes <see cref="Receipt"/> documents in Cosmos DB.</summary>
public sealed class ReceiptRepository(Container container)
{
    public async Task<IReadOnlyList<Receipt>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var receipts = new List<Receipt>();
        using var iterator = container.GetItemQueryIterator<Receipt>("SELECT * FROM c");

        while (iterator.HasMoreResults)
        {
            var page = await iterator.ReadNextAsync(cancellationToken);
            receipts.AddRange(page);
        }

        return receipts;
    }

    public Task UpsertAsync(Receipt receipt, CancellationToken cancellationToken = default) =>
        container.UpsertItemAsync(receipt, new PartitionKey(receipt.Id), cancellationToken: cancellationToken);

    public Task DeleteAsync(string id, CancellationToken cancellationToken = default) =>
        container.DeleteItemAsync<Receipt>(id, new PartitionKey(id), cancellationToken: cancellationToken);
}