export interface AccountKpi {
  id: string;
  name: string;
  accountType: string;
  accountNumber: string;
  currentBalance: number;
  trend: number[];
}

export interface FinancialKpisResponse {
  totalBalanceAllAccounts: number;
  accounts: AccountKpi[];
  monthlyIncome: {
    value: number;
    trend: number[];
  };
  monthlyNetResult: {
    value: number;
    variationPercentage: number;
  };
  accumulatedCoverage: {
    value: number;
    semanticStatus: 'Positive' | 'Negative' | string;
  };
}

export interface MonthlyCoverageGaugeResponse {
  ingresos: number;
  gastosFijos: number;
  gastosDirectos: number;
  honorarios: number;
  totalCostos: number;
  coveragePercentage: number;
  isCovered: boolean;
}

export interface AverageOrderMarginResponse {
  averageMarginPercentage: number;
  ordersCount: number;
  totalIncome: number;
  totalDirectCosts: number;
}

export interface MonthlyCoverageReportItem {
  periodo: string;
  ingresos: number;
  gastosFijos: number;
  gastosDirectos: number;
  honorarios: number;
  resultadoMes: number;
  saldoAcumulado: number;
}

export interface FixedCostsAgingBucket {
  range: string;
  count: number;
  totalAmount: number;
  color?: string;
}

export interface FixedCostsAgingResponse {
  buckets: FixedCostsAgingBucket[];
  totalPendingAmount: number;
  totalCount: number;
}

export interface CommittedExpensesProjectionResponse {
  projection30d: number;
  projection60d: number;
  projection90d: number;
  totalCommitted: number;
}

export interface OrderProfitability {
  id: string;
  orderNumber: string;
  clientName: string;
  serviceTypeName: string;
  income: number;
  directCosts: number;
  profit: number;
  marginPercentage: number;
}

export interface ServiceOrdersProfitabilityResponse {
  topOrders: OrderProfitability[];
  bottomOrders: OrderProfitability[];
  totalAnalyzed: number;
}

export interface DistributionConceptSummary {
  conceptName: string;
  expectedAmount: number;
  actualAmount: number;
}

export interface DistributionSummaryResponse {
  byConcept: DistributionConceptSummary[];
  totalExpected: number;
  totalActual: number;
}

export interface DirectCostCategoryBreakdown {
  categoryName: string;
  totalAmount: number;
  percentage: number;
}

export interface DirectCostProviderBreakdown {
  providerName: string;
  totalAmount: number;
  count: number;
}

export interface DirectCostsBreakdownResponse {
  totalAmount: number;
  byCategory: DirectCostCategoryBreakdown[];
  byProvider: DirectCostProviderBreakdown[];
}

export interface FixedCostEvolutionItem {
  periodo: string;
  categoryName: string;
  amount: number;
}

export interface AssetSummaryItem {
  id: string;
  name: string;
  purchaseDate: string;
  purchasePrice: number;
  description: string;
}

export interface AssetsValuationResponse {
  periodPurchasesTotal: number;
  historicalAssetsTotal: number;
  recentAssets: AssetSummaryItem[];
}
