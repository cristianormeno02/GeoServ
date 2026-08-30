UPDATE AccountingMovements
SET SourceType = 'ServiceOrderIncome',
    SourceId = CAST(ServiceOrderId AS VARCHAR(50))
WHERE ServiceOrderId IS NOT NULL;

UPDATE AccountingMovements
SET SourceType = 'DirectCost',
    SourceId = CAST(DirectCostId AS VARCHAR(50))
WHERE DirectCostId IS NOT NULL;

UPDATE AccountingMovements
SET SourceType = 'FixedCostPayment',
    SourceId = CAST(FixedCostId AS VARCHAR(50))
WHERE FixedCostId IS NOT NULL;

UPDATE AccountingMovements
SET SourceType = 'AssetPurchase',
    SourceId = CAST(AssetId AS VARCHAR(50))
WHERE AssetId IS NOT NULL;
