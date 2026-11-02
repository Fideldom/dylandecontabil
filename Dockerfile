# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o csproj e restaura as dependências (ajuste o caminho se necessário)
COPY ["DylandeContabil/DylandeContabil.csproj", "DylandeContabil/"]
RUN dotnet restore "DylandeContabil/DylandeContabil.csproj"

# Copia o restante do código e publica
COPY . .
WORKDIR "/src/DylandeContabil"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Estágio de Execução
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "DylandeContabil.dll"]