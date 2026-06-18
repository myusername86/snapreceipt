namespace SnapReceipt.Api.Features.Receipts;

/// <summary>Seeds the receipts container with sample data if it's empty.</summary>
public static class ReceiptSeeder
{
    public static async Task EnsureSeededAsync(ReceiptRepository repository)
    {
        var existing = await repository.GetAllAsync();
        if (existing.Count > 0)
        {
            return;
        }

        Receipt[] seed =
        [
            new("seed-1", "ICA Maxi", 482.50m, "SEK", new DateOnly(2026, 6, 1)),
            new("seed-2", "Systembolaget", 199.00m, "SEK", new DateOnly(2026, 6, 3)),
        ];

        foreach (var receipt in seed)
        {
            await repository.UpsertAsync(receipt);
        }
    }
}