# Utilizar la imagen oficial del SDK de .NET 9 para compilar
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar el csproj y restaurar las dependencias
COPY ["GeoServ.Api.csproj", "./"]
RUN dotnet restore "GeoServ.Api.csproj"

# Copiar el resto del código fuente y compilar
COPY . .
RUN dotnet publish "GeoServ.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Construir la imagen de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render provee el puerto a través de la variable de entorno PORT, 
# pero si está ausente usamos el 8080. 
# En .NET 8 y 9 el puerto por defecto es 8080.
EXPOSE 8080

# Desactivar la recarga de configuración para evitar errores de inotify en Render
ENV DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false

ENTRYPOINT ["dotnet", "GeoServ.Api.dll"]
