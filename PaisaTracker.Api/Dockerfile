FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY PaisaTracker.Api.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_ENVIRONMENT=Production
# Render's containers have a very low inotify instance limit; the default
# appsettings.json file-watcher (reloadOnChange) crashes the app on startup
# trying to create one. We don't need hot config reload in a container.
ENV DOTNET_hostBuilder__reloadConfigOnChange=false
ENTRYPOINT ["dotnet", "PaisaTracker.Api.dll"]
