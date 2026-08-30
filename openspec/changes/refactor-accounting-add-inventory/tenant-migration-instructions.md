## Migración Multi-Tenant

Para aplicar la migración en las bases de datos de cada tenant:

1. Asegúrate de tener los strings de conexión de cada tenant (por ejemplo, desde el archivo de configuración central o base de datos de catálogos de tenants).
2. Ejecuta el script de migración estructural (dotnet ef migrations script -i > schema_update.sql) y aplícalo en cada base de datos.
3. Ejecuta el script de datos MigrateTenantData.sql adjunto en este directorio sobre cada base de datos para migrar los datos históricos de orígenes al modelo polimórfico.
4. (Opcional) Automatiza este proceso utilizando un script PowerShell/Bash o una herramienta tipo DbUp/Flyway, iterando sobre la lista de tenants conocida.
