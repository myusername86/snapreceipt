using Microsoft.Azure.Cosmos;

namespace SnapReceipt.Api.Features.Receipts;


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
}