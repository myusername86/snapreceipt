using SnapReceipt.Api.Features.Receipts;

namespace SnapReceipt.Api.Extensions;

public static class EndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapReceiptEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/receipts").WithTags("Receipts");
        GetReceiptsEndpoint.Map(group);
        CreateReceiptEndpoint.Map(group);
        UpdateReceiptEndpoint.Map(group);   
        DeleteReceiptEndpoint.Map(group); 
        return app;
    }
}