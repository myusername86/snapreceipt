# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY global.json Directory.Build.props ./
COPY src/Api/SnapReceipt.Api/SnapReceipt.Api.csproj src/Api/SnapReceipt.Api/
RUN dotnet restore src/Api/SnapReceipt.Api/SnapReceipt.Api.csproj
COPY src/Api/SnapReceipt.Api/ src/Api/SnapReceipt.Api/
RUN dotnet publish src/Api/SnapReceipt.Api/SnapReceipt.Api.csproj -c Release -o /app/publish

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "SnapReceipt.Api.dll"]