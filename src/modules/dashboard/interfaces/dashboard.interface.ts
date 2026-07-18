export interface DashboardFilterQuery {
  startDate?: string;
  endDate?: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalTransaction: number;
  averageTransaction: number;
  revenueGrowthPercentage: number;
  transactionGrowthPercentage: number;
  averageGrowthPercentage: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  transaction: number;
}

export interface WeeklySalesData {
  label: string;
  total: number;
}

export interface PaymentMethodData {
  method: string;
  total: number;
  percentage: number;
}

export interface CategorySalesData {
  category: string;
  total: number;
  percentage: number;
}

export interface BestSellerData {
  itemId: string;
  name: string;
  image: string;
  quantitySold: number;
  revenue: number;
}

export interface NeedUpsellingData {
  itemId: string;
  name: string;
  image: string;
  quantitySold: number;
  revenue: number;
  isAvailable: boolean;
}

export interface TransactionHistoryQuery extends DashboardFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  paymentMethod?: string;
  cashierId?: string;
}
