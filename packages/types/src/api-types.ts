// API type definitions for Scout Analytics

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  version: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  location: {
    region: string;
    city: string;
    barangay?: string;
  };
  registrationDate: string;
  lastActiveDate: string;
  totalSpent: number;
  transactionCount: number;
  averageBasketSize: number;
  preferredCategories: string[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  cost?: number;
  margin?: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  timestamp: string;
  items: TransactionItem[];
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  paymentMethod: string;
  location: {
    storeId?: string;
    region: string;
    city: string;
  };
  channel: 'online' | 'retail' | 'mobile';
}

export interface TransactionItem {
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount?: number;
}

export interface KPIMetrics {
  revenue: {
    total: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  transactions: {
    count: number;
    growth: number;
    averageValue: number;
  };
  customers: {
    total: number;
    active: number;
    newCustomers: number;
    retentionRate: number;
  };
  products: {
    totalSKUs: number;
    topSellingCount: number;
    averageMargin: number;
  };
}

export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  regions?: string[];
  categories?: string[];
  brands?: string[];
  customerSegments?: string[];
  channels?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface DashboardMetrics {
  overview: KPIMetrics;
  trends: {
    dailyRevenue: TimeSeriesData[];
    transactionVolume: TimeSeriesData[];
    customerActivity: TimeSeriesData[];
  };
  products: {
    topCategories: CategoryMetric[];
    brandPerformance: BrandMetric[];
    skuCombinations: SKUCombination[];
  };
  customers: {
    demographics: DemographicData;
    segments: CustomerSegment[];
    retention: RetentionMetric[];
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface CategoryMetric {
  name: string;
  revenue: number;
  growth: number;
  share: number;
  transactionCount: number;
}

export interface BrandMetric {
  name: string;
  category: string;
  revenue: number;
  growth: number;
  marketShare: number;
  customerCount: number;
}

export interface SKUCombination {
  sourceProduct: string;
  targetProduct: string;
  frequency: number;
  confidence: number;
  lift: number;
  revenue: number;
}

export interface DemographicData {
  ageDistribution: {
    ageGroup: string;
    count: number;
    percentage: number;
  }[];
  genderDistribution: {
    gender: string;
    count: number;
    percentage: number;
  }[];
  locationDistribution: {
    region: string;
    count: number;
    percentage: number;
  }[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  averageValue: number;
  characteristics: string[];
}

export interface RetentionMetric {
  period: string;
  cohortSize: number;
  retainedCustomers: number;
  retentionRate: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
  permissions: string[];
  lastLogin: string;
}

export interface ApiRequestConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}