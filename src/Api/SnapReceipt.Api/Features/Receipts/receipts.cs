namespace SnapReceipt.Api.Features.Receipts;

public sealed record Receipt(
    string Id,
    string Merchant,
    decimal Total,
    string Currency,
    DateOnly PurchasedOn,
    string? UserId = null);