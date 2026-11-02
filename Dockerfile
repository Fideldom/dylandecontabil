# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o ficheiro csproj e restaura as dependências
COPY ["DylandeContabil.csproj", "./"]
RUN dotnet restore "DylandeContabil.csproj"

# Copia o restante do código e publica
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Estágio de Execução
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "DylandeContabil.dll"]