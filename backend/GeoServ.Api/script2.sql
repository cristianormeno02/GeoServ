CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "FixedCostCategories" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        CONSTRAINT "PK_FixedCostCategories" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "Roles" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        CONSTRAINT "PK_Roles" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "ServiceOrderStatuses" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        "OrderIndex" integer NOT NULL,
        CONSTRAINT "PK_ServiceOrderStatuses" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "ServiceTypes" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        CONSTRAINT "PK_ServiceTypes" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "FixedCosts" (
        "Id" uuid NOT NULL,
        "Description" text NOT NULL,
        "Amount" numeric(18,2) NOT NULL,
        "Date" timestamp with time zone NOT NULL,
        "CategoryId" uuid NOT NULL,
        CONSTRAINT "PK_FixedCosts" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_FixedCosts_FixedCostCategories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "FixedCostCategories" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "RoleId" uuid NOT NULL,
        "Name" text NOT NULL,
        "Email" text NOT NULL,
        "PasswordHash" text NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Users_Roles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "Roles" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "Clients" (
        "Id" uuid NOT NULL,
        "UserId" uuid,
        "CompanyName" text NOT NULL,
        "TaxId" text NOT NULL,
        "ContactEmail" text NOT NULL,
        "ContactPhone" text NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Clients" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Clients_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "ServiceOrders" (
        "Id" uuid NOT NULL,
        "ClientId" uuid NOT NULL,
        "ServiceTypeId" uuid NOT NULL,
        "StatusId" uuid NOT NULL,
        "Description" text,
        "BudgetedAmount" numeric(18,2) NOT NULL,
        "Discount" numeric(18,2) NOT NULL,
        "TotalAmount" numeric(18,2) NOT NULL,
        "ExpensePercentage" numeric(5,2) NOT NULL,
        "CapitalizationPercentage" numeric(5,2) NOT NULL,
        "FeePercentage" numeric(5,2) NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone NOT NULL,
        "StartDate" timestamp with time zone,
        "EstimatedDeliveryDate" timestamp with time zone,
        "PaidAt" timestamp with time zone,
        "CanceledAt" timestamp with time zone,
        CONSTRAINT "PK_ServiceOrders" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_ServiceOrders_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "Clients" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_ServiceOrders_ServiceOrderStatuses_StatusId" FOREIGN KEY ("StatusId") REFERENCES "ServiceOrderStatuses" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_ServiceOrders_ServiceTypes_ServiceTypeId" FOREIGN KEY ("ServiceTypeId") REFERENCES "ServiceTypes" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "AccountingMovements" (
        "Id" uuid NOT NULL,
        "IsIncome" boolean NOT NULL,
        "Amount" numeric(18,2) NOT NULL,
        "Date" timestamp with time zone NOT NULL,
        "Description" text NOT NULL,
        "ServiceOrderId" uuid,
        "RegisteredByUserId" uuid NOT NULL,
        CONSTRAINT "PK_AccountingMovements" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_AccountingMovements_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id"),
        CONSTRAINT "FK_AccountingMovements_Users_RegisteredByUserId" FOREIGN KEY ("RegisteredByUserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "DirectCosts" (
        "Id" uuid NOT NULL,
        "ServiceOrderId" uuid NOT NULL,
        "Description" text NOT NULL,
        "Amount" numeric(18,2) NOT NULL,
        "Date" timestamp with time zone NOT NULL,
        "RegisteredByUserId" uuid NOT NULL,
        CONSTRAINT "PK_DirectCosts" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_DirectCosts_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_DirectCosts_Users_RegisteredByUserId" FOREIGN KEY ("RegisteredByUserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE TABLE "RevenueDistributions" (
        "Id" uuid NOT NULL,
        "ServiceOrderId" uuid NOT NULL,
        "CalculatedExpenseAmount" numeric(18,2) NOT NULL,
        "CalculatedCapitalizationAmount" numeric(18,2) NOT NULL,
        "CalculatedFeeAmount" numeric(18,2) NOT NULL,
        "ActualCapitalizationAmount" numeric(18,2) NOT NULL,
        "ActualFeePaidAmount" numeric(18,2) NOT NULL,
        "DistributionDate" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_RevenueDistributions" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_RevenueDistributions_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_AccountingMovements_RegisteredByUserId" ON "AccountingMovements" ("RegisteredByUserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_AccountingMovements_ServiceOrderId" ON "AccountingMovements" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_Clients_UserId" ON "Clients" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_DirectCosts_RegisteredByUserId" ON "DirectCosts" ("RegisteredByUserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_DirectCosts_ServiceOrderId" ON "DirectCosts" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_FixedCosts_CategoryId" ON "FixedCosts" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_RevenueDistributions_ServiceOrderId" ON "RevenueDistributions" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_ServiceOrders_ClientId" ON "ServiceOrders" ("ClientId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_ServiceOrders_ServiceTypeId" ON "ServiceOrders" ("ServiceTypeId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_ServiceOrders_StatusId" ON "ServiceOrders" ("StatusId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    CREATE INDEX "IX_Users_RoleId" ON "Users" ("RoleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260817235009_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260817235009_InitialCreate', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260818123404_MoveAdminUserToEndpoint') THEN
    INSERT INTO "FixedCostCategories" ("Id", "Description", "Name")
    VALUES ('c1111111-1111-1111-1111-111111111111', 'Pagos de alquiler de oficina o locales', 'Alquileres');
    INSERT INTO "FixedCostCategories" ("Id", "Description", "Name")
    VALUES ('c2222222-2222-2222-2222-222222222222', 'Nómina de empleados fijos', 'Sueldos y Cargas Sociales');
    INSERT INTO "FixedCostCategories" ("Id", "Description", "Name")
    VALUES ('c3333333-3333-3333-3333-333333333333', 'Luz, agua, internet, telefonía', 'Servicios Básicos');
    INSERT INTO "FixedCostCategories" ("Id", "Description", "Name")
    VALUES ('c4444444-4444-4444-4444-444444444444', 'Suscripciones, licencias, hosting', 'Software e IT');
    INSERT INTO "FixedCostCategories" ("Id", "Description", "Name")
    VALUES ('c5555555-5555-5555-5555-555555555555', 'Tasas municipales, seguros de responsabilidad, etc.', 'Impuestos y Seguros');
    INSERT INTO "FixedCostCategories" ("Id", "Description", "Name")
    VALUES ('c6666666-6666-6666-6666-666666666666', 'Contadores, abogados (fijos)', 'Honorarios Profesionales');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260818123404_MoveAdminUserToEndpoint') THEN
    INSERT INTO "ServiceOrderStatuses" ("Id", "Description", "Name", "OrderIndex")
    VALUES ('a1111111-1111-1111-1111-111111111111', 'Orden recién registrada', 'Alta', 1);
    INSERT INTO "ServiceOrderStatuses" ("Id", "Description", "Name", "OrderIndex")
    VALUES ('a2222222-2222-2222-2222-222222222222', 'Presupuesto enviado al cliente', 'Presupuestada', 2);
    INSERT INTO "ServiceOrderStatuses" ("Id", "Description", "Name", "OrderIndex")
    VALUES ('a3333333-3333-3333-3333-333333333333', 'Presupuesto aprobado por el cliente', 'Aprobada', 3);
    INSERT INTO "ServiceOrderStatuses" ("Id", "Description", "Name", "OrderIndex")
    VALUES ('a4444444-4444-4444-4444-444444444444', 'Trabajo en ejecución', 'Iniciada', 4);
    INSERT INTO "ServiceOrderStatuses" ("Id", "Description", "Name", "OrderIndex")
    VALUES ('a5555555-5555-5555-5555-555555555555', 'Trabajo entregado al cliente', 'Entregada', 5);
    INSERT INTO "ServiceOrderStatuses" ("Id", "Description", "Name", "OrderIndex")
    VALUES ('a6666666-6666-6666-6666-666666666666', 'Orden pagada en su totalidad', 'Cobrada', 6);
    INSERT INTO "ServiceOrderStatuses" ("Id", "Description", "Name", "OrderIndex")
    VALUES ('a7777777-7777-7777-7777-777777777777', 'Orden anulada o cancelada', 'Cancelada', 7);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260818123404_MoveAdminUserToEndpoint') THEN
    INSERT INTO "ServiceTypes" ("Id", "Description", "Name")
    VALUES ('b1111111-1111-1111-1111-111111111111', 'Medición y representación gráfica del terreno', 'Levantamiento Topográfico');
    INSERT INTO "ServiceTypes" ("Id", "Description", "Name")
    VALUES ('b2222222-2222-2222-2222-222222222222', 'Determinación de límites de propiedad', 'Mensura');
    INSERT INTO "ServiceTypes" ("Id", "Description", "Name")
    VALUES ('b3333333-3333-3333-3333-333333333333', 'Posicionamiento de alta precisión', 'Estudio Geodésico');
    INSERT INTO "ServiceTypes" ("Id", "Description", "Name")
    VALUES ('b4444444-4444-4444-4444-444444444444', 'Levantamiento mediante drones o imágenes satelitales', 'Fotogrametría');
    INSERT INTO "ServiceTypes" ("Id", "Description", "Name")
    VALUES ('b5555555-5555-5555-5555-555555555555', 'Asesoramiento en proyectos de ingeniería', 'Consultoría Técnica');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260818123404_MoveAdminUserToEndpoint') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260818123404_MoveAdminUserToEndpoint', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260818173029_AddEmpresaTenant') THEN
    CREATE TABLE "Empresas" (
        "Id" uuid NOT NULL,
        "Nombre" text NOT NULL,
        "Correo" text NOT NULL,
        "Telefono" text NOT NULL,
        "Direccion" text NOT NULL,
        "LogoSvg" text NOT NULL,
        "Subdominio" text NOT NULL,
        CONSTRAINT "PK_Empresas" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260818173029_AddEmpresaTenant') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260818173029_AddEmpresaTenant', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819030827_AddCompanyType') THEN
    ALTER TABLE "Clients" ADD "CompanyTypeId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819030827_AddCompanyType') THEN
    CREATE TABLE "CompanyTypes" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        CONSTRAINT "PK_CompanyTypes" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819030827_AddCompanyType') THEN
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d1111111-1111-1111-1111-111111111111', NULL, 'Proyecto Minero');
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d2222222-2222-2222-2222-222222222222', NULL, 'Consultora Minera');
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d3333333-3333-3333-3333-333333333333', NULL, 'Contratista Minero');
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d4444444-4444-4444-4444-444444444444', NULL, 'Establecimiento Gubernamental');
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d5555555-5555-5555-5555-555555555555', NULL, 'Académico / Universitario');
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d6666666-6666-6666-6666-666666666666', NULL, 'Particular / Inversionista');
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d7777777-7777-7777-7777-777777777777', NULL, 'Otro');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819030827_AddCompanyType') THEN
    CREATE INDEX "IX_Clients_CompanyTypeId" ON "Clients" ("CompanyTypeId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819030827_AddCompanyType') THEN
    ALTER TABLE "Clients" ADD CONSTRAINT "FK_Clients_CompanyTypes_CompanyTypeId" FOREIGN KEY ("CompanyTypeId") REFERENCES "CompanyTypes" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819030827_AddCompanyType') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260819030827_AddCompanyType', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819040748_AddCompaniaMineraSeedData') THEN
    INSERT INTO "CompanyTypes" ("Id", "Description", "Name")
    VALUES ('d8888888-8888-8888-8888-888888888888', NULL, 'Compañía Minera');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819040748_AddCompaniaMineraSeedData') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260819040748_AddCompaniaMineraSeedData', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819135450_AddTaxIdToEmpresa') THEN
    ALTER TABLE "Empresas" ADD "TaxId" text NOT NULL DEFAULT '';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819135450_AddTaxIdToEmpresa') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260819135450_AddTaxIdToEmpresa', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    DROP TABLE "RevenueDistributions";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" DROP COLUMN "CapitalizationPercentage";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" DROP COLUMN "ExpensePercentage";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" DROP COLUMN "FeePercentage";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" RENAME COLUMN "StartDate" TO "EstimatedStartDate";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" RENAME COLUMN "PaidAt" TO "EstimatedEndDate";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" RENAME COLUMN "EstimatedDeliveryDate" TO "CollectionDate";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" ADD "ActualEndDate" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" ADD "ActualStartDate" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" ADD "CollectedAmount" numeric(18,2) NOT NULL DEFAULT 0.0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" ADD "OrderNumber" text NOT NULL DEFAULT '';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" ADD "Priority" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" ADD "ProjectId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE TABLE "DistributionConcepts" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_DistributionConcepts" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE TABLE "Projects" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Projects" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE TABLE "Responsibles" (
        "Id" uuid NOT NULL,
        "ServiceOrderId" uuid NOT NULL,
        "Name" text NOT NULL,
        "Position" text,
        "Title" text,
        "Specialties" text,
        "UserId" uuid,
        CONSTRAINT "PK_Responsibles" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Responsibles_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_Responsibles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE TABLE "ServiceOrderActivities" (
        "Id" uuid NOT NULL,
        "ServiceOrderId" uuid NOT NULL,
        "ShortDetail" text NOT NULL,
        "LongDetail" text,
        "State" integer NOT NULL,
        "ProgressPercentage" integer NOT NULL,
        CONSTRAINT "PK_ServiceOrderActivities" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_ServiceOrderActivities_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE TABLE "ServiceOrderDocuments" (
        "Id" uuid NOT NULL,
        "ServiceOrderId" uuid NOT NULL,
        "FileName" text NOT NULL,
        "FilePath" text NOT NULL,
        "ContentType" text,
        "IsVisibleToClient" boolean NOT NULL,
        "UploadedAt" timestamp with time zone NOT NULL,
        "UploadedById" uuid,
        CONSTRAINT "PK_ServiceOrderDocuments" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_ServiceOrderDocuments_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_ServiceOrderDocuments_Users_UploadedById" FOREIGN KEY ("UploadedById") REFERENCES "Users" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE TABLE "ServiceOrderDistributions" (
        "Id" uuid NOT NULL,
        "ServiceOrderId" uuid NOT NULL,
        "DistributionConceptId" uuid NOT NULL,
        "Percentage" numeric(5,2) NOT NULL,
        "ExpectedAmount" numeric(18,2) NOT NULL,
        "ActualAmount" numeric(18,2) NOT NULL,
        CONSTRAINT "PK_ServiceOrderDistributions" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_ServiceOrderDistributions_DistributionConcepts_Distribution~" FOREIGN KEY ("DistributionConceptId") REFERENCES "DistributionConcepts" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_ServiceOrderDistributions_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    INSERT INTO "DistributionConcepts" ("Id", "IsActive", "Name")
    VALUES ('e1111111-1111-1111-1111-111111111111', TRUE, 'Amortización Gastos');
    INSERT INTO "DistributionConcepts" ("Id", "IsActive", "Name")
    VALUES ('e2222222-2222-2222-2222-222222222222', TRUE, 'Capitalización');
    INSERT INTO "DistributionConcepts" ("Id", "IsActive", "Name")
    VALUES ('e3333333-3333-3333-3333-333333333333', TRUE, 'Honorarios');
    INSERT INTO "DistributionConcepts" ("Id", "IsActive", "Name")
    VALUES ('e4444444-4444-4444-4444-444444444444', TRUE, 'Utilidad');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE UNIQUE INDEX "IX_ServiceOrders_OrderNumber" ON "ServiceOrders" ("OrderNumber");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_ServiceOrders_ProjectId" ON "ServiceOrders" ("ProjectId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_Responsibles_ServiceOrderId" ON "Responsibles" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_Responsibles_UserId" ON "Responsibles" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_ServiceOrderActivities_ServiceOrderId" ON "ServiceOrderActivities" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_ServiceOrderDistributions_DistributionConceptId" ON "ServiceOrderDistributions" ("DistributionConceptId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_ServiceOrderDistributions_ServiceOrderId" ON "ServiceOrderDistributions" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_ServiceOrderDocuments_ServiceOrderId" ON "ServiceOrderDocuments" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    CREATE INDEX "IX_ServiceOrderDocuments_UploadedById" ON "ServiceOrderDocuments" ("UploadedById");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    ALTER TABLE "ServiceOrders" ADD CONSTRAINT "FK_ServiceOrders_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260819163607_UpdateServiceOrderDomain') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260819163607_UpdateServiceOrderDomain', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "Responsibles" DROP CONSTRAINT "FK_Responsibles_ServiceOrders_ServiceOrderId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    DROP INDEX "IX_Responsibles_ServiceOrderId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    DROP INDEX "IX_Responsibles_UserId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "Responsibles" DROP COLUMN "ServiceOrderId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "ServiceOrders" ADD "CurrencyId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "ServiceOrders" ADD "ExchangeRateAtBudget" numeric(18,4);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "ServiceOrders" ADD "ExchangeRateAtCollection" numeric(18,4);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "ServiceOrders" ADD "ForeignAmount" numeric(18,2);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "ServiceOrders" ADD "RequestDate" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    CREATE TABLE "Currencies" (
        "Id" uuid NOT NULL,
        "Code" text NOT NULL,
        "Symbol" text NOT NULL,
        "Name" text NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_Currencies" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    CREATE TABLE "ServiceOrderResponsibles" (
        "ServiceOrderId" uuid NOT NULL,
        "ResponsibleId" uuid NOT NULL,
        CONSTRAINT "PK_ServiceOrderResponsibles" PRIMARY KEY ("ServiceOrderId", "ResponsibleId"),
        CONSTRAINT "FK_ServiceOrderResponsibles_Responsibles_ResponsibleId" FOREIGN KEY ("ResponsibleId") REFERENCES "Responsibles" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_ServiceOrderResponsibles_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    INSERT INTO "Currencies" ("Id", "Code", "IsActive", "Name", "Symbol")
    VALUES ('f1111111-1111-1111-1111-111111111111', 'ARS', TRUE, 'Peso Argentino', '$');
    INSERT INTO "Currencies" ("Id", "Code", "IsActive", "Name", "Symbol")
    VALUES ('f2222222-2222-2222-2222-222222222222', 'USD', TRUE, 'Dólar Estadounidense', 'U$D');
    INSERT INTO "Currencies" ("Id", "Code", "IsActive", "Name", "Symbol")
    VALUES ('f3333333-3333-3333-3333-333333333333', 'CLP', TRUE, 'Peso Chileno', '$');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    CREATE INDEX "IX_ServiceOrders_CurrencyId" ON "ServiceOrders" ("CurrencyId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    CREATE UNIQUE INDEX "IX_Responsibles_UserId" ON "Responsibles" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    CREATE INDEX "IX_ServiceOrderResponsibles_ResponsibleId" ON "ServiceOrderResponsibles" ("ResponsibleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    ALTER TABLE "ServiceOrders" ADD CONSTRAINT "FK_ServiceOrders_Currencies_CurrencyId" FOREIGN KEY ("CurrencyId") REFERENCES "Currencies" ("Id") ON DELETE CASCADE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260820133101_UpdateServiceOrderAndResponsible2') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260820133101_UpdateServiceOrderAndResponsible2', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260821025702_AddObservationsAndBudgetedTasksDetail') THEN
    ALTER TABLE "ServiceOrders" ADD "BudgetedTasksDetail" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260821025702_AddObservationsAndBudgetedTasksDetail') THEN
    CREATE TABLE "ServiceOrderObservations" (
        "Id" uuid NOT NULL,
        "ServiceOrderId" uuid NOT NULL,
        "Text" text NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_ServiceOrderObservations" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_ServiceOrderObservations_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260821025702_AddObservationsAndBudgetedTasksDetail') THEN
    CREATE INDEX "IX_ServiceOrderObservations_ServiceOrderId" ON "ServiceOrderObservations" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260821025702_AddObservationsAndBudgetedTasksDetail') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260821025702_AddObservationsAndBudgetedTasksDetail', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260821045609_UpdateServiceOrderObservations') THEN
    ALTER TABLE "ServiceOrderObservations" ADD "ObservationType" text NOT NULL DEFAULT '';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260821045609_UpdateServiceOrderObservations') THEN
    ALTER TABLE "ServiceOrderObservations" ADD "UserId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260821045609_UpdateServiceOrderObservations') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260821045609_UpdateServiceOrderObservations', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" RENAME COLUMN "Amount" TO "UnitPrice";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "CategoryId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "Observations" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "PaidById" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "PaymentMethodId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "ProviderId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "Quantity" numeric(18,2) NOT NULL DEFAULT 0.0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "Status" text NOT NULL DEFAULT '';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "TotalAmount" numeric(18,2) NOT NULL DEFAULT 0.0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD "UnitId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE TABLE "DirectCostCategories" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_DirectCostCategories" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE TABLE "PaymentMethods" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_PaymentMethods" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE TABLE "Providers" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_Providers" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE TABLE "Units" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_Units" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE INDEX "IX_ServiceOrderObservations_UserId" ON "ServiceOrderObservations" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE INDEX "IX_DirectCosts_CategoryId" ON "DirectCosts" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE INDEX "IX_DirectCosts_PaidById" ON "DirectCosts" ("PaidById");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE INDEX "IX_DirectCosts_PaymentMethodId" ON "DirectCosts" ("PaymentMethodId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE INDEX "IX_DirectCosts_ProviderId" ON "DirectCosts" ("ProviderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    CREATE INDEX "IX_DirectCosts_UnitId" ON "DirectCosts" ("UnitId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD CONSTRAINT "FK_DirectCosts_DirectCostCategories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "DirectCostCategories" ("Id") ON DELETE CASCADE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD CONSTRAINT "FK_DirectCosts_PaymentMethods_PaymentMethodId" FOREIGN KEY ("PaymentMethodId") REFERENCES "PaymentMethods" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD CONSTRAINT "FK_DirectCosts_Providers_ProviderId" FOREIGN KEY ("ProviderId") REFERENCES "Providers" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD CONSTRAINT "FK_DirectCosts_Responsibles_PaidById" FOREIGN KEY ("PaidById") REFERENCES "Responsibles" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "DirectCosts" ADD CONSTRAINT "FK_DirectCosts_Units_UnitId" FOREIGN KEY ("UnitId") REFERENCES "Units" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    DELETE FROM "ServiceOrderObservations" WHERE "UserId" NOT IN (SELECT "Id" FROM "Users");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    ALTER TABLE "ServiceOrderObservations" ADD CONSTRAINT "FK_ServiceOrderObservations_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260822024744_AddDirectCostsUpdate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260822024744_AddDirectCostsUpdate', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824145323_AddRefreshTokenToUser') THEN
    ALTER TABLE "Users" ADD "RefreshToken" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824145323_AddRefreshTokenToUser') THEN
    ALTER TABLE "Users" ADD "RefreshTokenExpiryTime" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824145323_AddRefreshTokenToUser') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260824145323_AddRefreshTokenToUser', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" DROP CONSTRAINT "FK_AccountingMovements_ServiceOrders_ServiceOrderId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "AssetId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "Category" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "CheckId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "DirectCostId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "FinancialAccountId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "FixedCostId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "PaymentMethodId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD "ResponsibleId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE TABLE "Assets" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text NOT NULL,
        "PurchasePrice" numeric(18,2) NOT NULL,
        "PurchaseDate" timestamp with time zone NOT NULL,
        "ProviderId" uuid,
        CONSTRAINT "PK_Assets" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Assets_Providers_ProviderId" FOREIGN KEY ("ProviderId") REFERENCES "Providers" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE TABLE "Checks" (
        "Id" uuid NOT NULL,
        "CheckNumber" text NOT NULL,
        "BankName" text NOT NULL,
        "IssuerName" text NOT NULL,
        "Amount" numeric(18,2) NOT NULL,
        "IssueDate" timestamp with time zone NOT NULL,
        "DueDate" timestamp with time zone NOT NULL,
        "Status" integer NOT NULL,
        "ReceivedFromClientId" uuid,
        "Observations" text,
        CONSTRAINT "PK_Checks" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Checks_Clients_ReceivedFromClientId" FOREIGN KEY ("ReceivedFromClientId") REFERENCES "Clients" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE TABLE "FinancialAccounts" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "AccountNumber" text NOT NULL,
        "AccountType" text NOT NULL,
        "CurrencyId" uuid NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_FinancialAccounts" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_FinancialAccounts_Currencies_CurrencyId" FOREIGN KEY ("CurrencyId") REFERENCES "Currencies" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_AccountingMovements_AssetId" ON "AccountingMovements" ("AssetId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_AccountingMovements_CheckId" ON "AccountingMovements" ("CheckId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_AccountingMovements_DirectCostId" ON "AccountingMovements" ("DirectCostId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_AccountingMovements_FinancialAccountId" ON "AccountingMovements" ("FinancialAccountId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_AccountingMovements_FixedCostId" ON "AccountingMovements" ("FixedCostId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_AccountingMovements_PaymentMethodId" ON "AccountingMovements" ("PaymentMethodId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_AccountingMovements_ResponsibleId" ON "AccountingMovements" ("ResponsibleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_Assets_ProviderId" ON "Assets" ("ProviderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_Checks_ReceivedFromClientId" ON "Checks" ("ReceivedFromClientId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    CREATE INDEX "IX_FinancialAccounts_CurrencyId" ON "FinancialAccounts" ("CurrencyId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_Assets_AssetId" FOREIGN KEY ("AssetId") REFERENCES "Assets" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_Checks_CheckId" FOREIGN KEY ("CheckId") REFERENCES "Checks" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_DirectCosts_DirectCostId" FOREIGN KEY ("DirectCostId") REFERENCES "DirectCosts" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_FinancialAccounts_FinancialAccountId" FOREIGN KEY ("FinancialAccountId") REFERENCES "FinancialAccounts" ("Id") ON DELETE CASCADE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_FixedCosts_FixedCostId" FOREIGN KEY ("FixedCostId") REFERENCES "FixedCosts" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_PaymentMethods_PaymentMethodId" FOREIGN KEY ("PaymentMethodId") REFERENCES "PaymentMethods" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_Responsibles_ResponsibleId" FOREIGN KEY ("ResponsibleId") REFERENCES "Responsibles" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id") ON DELETE RESTRICT;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260824175526_FinancialModuleRefactor') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260824175526_FinancialModuleRefactor', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825130915_MoveCategoryToEntity') THEN
    ALTER TABLE "AccountingMovements" DROP COLUMN "Category";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825130915_MoveCategoryToEntity') THEN
    ALTER TABLE "AccountingMovements" ADD "CategoryId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825130915_MoveCategoryToEntity') THEN
    CREATE TABLE "MovementCategories" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text NOT NULL,
        "IsIncome" boolean NOT NULL,
        "IsActive" boolean NOT NULL,
        CONSTRAINT "PK_MovementCategories" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825130915_MoveCategoryToEntity') THEN
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a1111111-1111-1111-1111-111111111111', 'Ingreso por trabajos realizados', TRUE, TRUE, 'Cobro de Orden de Servicio');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a2222222-2222-2222-2222-222222222222', 'Ingreso de fondos por cheque', TRUE, TRUE, 'Acreditación de Cheque');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a3333333-3333-3333-3333-333333333333', 'Entrada de fondos desde otra cuenta propia', TRUE, TRUE, 'Transferencia Interna (Ingreso)');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a4444444-4444-4444-4444-444444444444', 'Ingreso por aportes de capital', TRUE, TRUE, 'Aporte de Socios / Capital');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a5555555-5555-5555-5555-555555555555', 'Ingreso por subsidios', TRUE, TRUE, 'Subsidio / Aporte Estatal');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a6666666-6666-6666-6666-666666666666', 'Luz, internet, alquiler', TRUE, FALSE, 'Pago de Gasto Fijo');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a7777777-7777-7777-7777-777777777777', 'Insumos para obras', TRUE, FALSE, 'Pago de Costo Directo');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a8888888-8888-8888-8888-888888888888', 'Equipamiento, rodados', TRUE, FALSE, 'Compra de Activo');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('a9999999-9999-9999-9999-999999999999', 'Honorarios de socios o terceros', TRUE, FALSE, 'Pago de Honorarios');
    INSERT INTO "MovementCategories" ("Id", "Description", "IsActive", "IsIncome", "Name")
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Salida de fondos hacia otra cuenta propia', TRUE, FALSE, 'Transferencia Interna (Egreso)');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825130915_MoveCategoryToEntity') THEN
    CREATE INDEX "IX_AccountingMovements_CategoryId" ON "AccountingMovements" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825130915_MoveCategoryToEntity') THEN
    ALTER TABLE "AccountingMovements" ADD CONSTRAINT "FK_AccountingMovements_MovementCategories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "MovementCategories" ("Id") ON DELETE CASCADE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825130915_MoveCategoryToEntity') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260825130915_MoveCategoryToEntity', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825153136_AddCreatedAtToMovement') THEN
    ALTER TABLE "AccountingMovements" ADD "CreatedAt" timestamp with time zone NOT NULL DEFAULT TIMESTAMPTZ '-infinity';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825153136_AddCreatedAtToMovement') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260825153136_AddCreatedAtToMovement', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825165356_AddEmpresaConfiguracion') THEN
    CREATE TABLE "EmpresaConfiguraciones" (
        "Id" uuid NOT NULL,
        "EmpresaId" uuid NOT NULL,
        "Key" text NOT NULL,
        "Value" text NOT NULL,
        "ValueType" text NOT NULL,
        "Description" text,
        CONSTRAINT "PK_EmpresaConfiguraciones" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_EmpresaConfiguraciones_Empresas_EmpresaId" FOREIGN KEY ("EmpresaId") REFERENCES "Empresas" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825165356_AddEmpresaConfiguracion') THEN
    CREATE UNIQUE INDEX "IX_EmpresaConfiguraciones_EmpresaId_Key" ON "EmpresaConfiguraciones" ("EmpresaId", "Key");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260825165356_AddEmpresaConfiguracion') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260825165356_AddEmpresaConfiguracion', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    ALTER TABLE "Assets" ADD "UsefulLifeMonths" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE TABLE "ConsumableTypes" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        CONSTRAINT "PK_ConsumableTypes" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE TABLE "FixedCostItems" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "CategoryId" uuid NOT NULL,
        "ProviderId" uuid,
        "InitialAmount" numeric(18,2) NOT NULL,
        "IsRecurring" boolean NOT NULL,
        "Observation" text,
        CONSTRAINT "PK_FixedCostItems" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_FixedCostItems_FixedCostCategories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "FixedCostCategories" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_FixedCostItems_Providers_ProviderId" FOREIGN KEY ("ProviderId") REFERENCES "Providers" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE TABLE "ConsumableClasses" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "ConsumableTypeId" uuid NOT NULL,
        CONSTRAINT "PK_ConsumableClasses" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_ConsumableClasses_ConsumableTypes_ConsumableTypeId" FOREIGN KEY ("ConsumableTypeId") REFERENCES "ConsumableTypes" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE TABLE "FixedCostPayments" (
        "Id" uuid NOT NULL,
        "FixedCostItemId" uuid NOT NULL,
        "DueDate" timestamp with time zone NOT NULL,
        "Amount" numeric(18,2) NOT NULL,
        "IsPaid" boolean NOT NULL,
        "PaymentDate" timestamp with time zone,
        "PaymentMethodId" uuid,
        "ReceiptNumber" text,
        CONSTRAINT "PK_FixedCostPayments" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_FixedCostPayments_FixedCostItems_FixedCostItemId" FOREIGN KEY ("FixedCostItemId") REFERENCES "FixedCostItems" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_FixedCostPayments_PaymentMethods_PaymentMethodId" FOREIGN KEY ("PaymentMethodId") REFERENCES "PaymentMethods" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE TABLE "Consumables" (
        "Id" uuid NOT NULL,
        "PurchaseDate" timestamp with time zone NOT NULL,
        "ConsumableClassId" uuid NOT NULL,
        "Description" text NOT NULL,
        "Quantity" numeric(18,2) NOT NULL,
        "UnitId" uuid NOT NULL,
        "UnitCost" numeric(18,2) NOT NULL,
        "TotalCost" numeric(18,2) NOT NULL,
        "ProviderId" uuid,
        "Observation" text,
        CONSTRAINT "PK_Consumables" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Consumables_ConsumableClasses_ConsumableClassId" FOREIGN KEY ("ConsumableClassId") REFERENCES "ConsumableClasses" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_Consumables_Providers_ProviderId" FOREIGN KEY ("ProviderId") REFERENCES "Providers" ("Id"),
        CONSTRAINT "FK_Consumables_Units_UnitId" FOREIGN KEY ("UnitId") REFERENCES "Units" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_ConsumableClasses_ConsumableTypeId" ON "ConsumableClasses" ("ConsumableTypeId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_Consumables_ConsumableClassId" ON "Consumables" ("ConsumableClassId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_Consumables_ProviderId" ON "Consumables" ("ProviderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_Consumables_UnitId" ON "Consumables" ("UnitId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_FixedCostItems_CategoryId" ON "FixedCostItems" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_FixedCostItems_ProviderId" ON "FixedCostItems" ("ProviderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_FixedCostPayments_FixedCostItemId" ON "FixedCostPayments" ("FixedCostItemId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    CREATE INDEX "IX_FixedCostPayments_PaymentMethodId" ON "FixedCostPayments" ("PaymentMethodId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260827150248_AddConsumablesAndFixedCostsHeader') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260827150248_AddConsumablesAndFixedCostsHeader', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830032354_PolymorphicAccountingMovement') THEN
    ALTER TABLE "AccountingMovements" ADD "SourceId" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830032354_PolymorphicAccountingMovement') THEN
    ALTER TABLE "AccountingMovements" ADD "SourceType" text NOT NULL DEFAULT '';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830032354_PolymorphicAccountingMovement') THEN
    CREATE INDEX "IX_AccountingMovements_SourceType_SourceId" ON "AccountingMovements" ("SourceType", "SourceId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830032354_PolymorphicAccountingMovement') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260830032354_PolymorphicAccountingMovement', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830034303_InventoryMovement') THEN
    ALTER TABLE "Consumables" DROP COLUMN "Quantity";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830034303_InventoryMovement') THEN
    CREATE TABLE "InventoryMovements" (
        "Id" uuid NOT NULL,
        "ConsumableId" uuid NOT NULL,
        "Cantidad" numeric(18,2) NOT NULL,
        "MovementType" text NOT NULL,
        "ServiceOrderId" uuid,
        "Motivo" text,
        "Fecha" timestamp with time zone NOT NULL,
        "UserId" uuid NOT NULL,
        CONSTRAINT "PK_InventoryMovements" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_InventoryMovements_Consumables_ConsumableId" FOREIGN KEY ("ConsumableId") REFERENCES "Consumables" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_InventoryMovements_ServiceOrders_ServiceOrderId" FOREIGN KEY ("ServiceOrderId") REFERENCES "ServiceOrders" ("Id"),
        CONSTRAINT "FK_InventoryMovements_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830034303_InventoryMovement') THEN
    CREATE INDEX "IX_InventoryMovements_ConsumableId" ON "InventoryMovements" ("ConsumableId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830034303_InventoryMovement') THEN
    CREATE INDEX "IX_InventoryMovements_ServiceOrderId" ON "InventoryMovements" ("ServiceOrderId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830034303_InventoryMovement') THEN
    CREATE INDEX "IX_InventoryMovements_UserId" ON "InventoryMovements" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260830034303_InventoryMovement') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260830034303_InventoryMovement', '9.0.0');
    END IF;
END $EF$;
COMMIT;

