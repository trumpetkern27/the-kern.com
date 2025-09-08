# Use the official .NET 9 SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy everything and restore dependencies
COPY . .
RUN dotnet restore "./the-kern.com.csproj"

# Build and publish the app
RUN dotnet publish "./the-kern.com.csproj" -c Release -o /app/publish

# Use the ASP.NET 9 runtime for the final container
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "the-kern.com.dll"]
