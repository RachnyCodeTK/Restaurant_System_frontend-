import { apiRequest } from './api';

// ============================================
// ANALYTICS API SERVICES
// ============================================

export const getSalesSummary = async () => {
  return apiRequest('/analytics/sales-summary');
};

export const getSalesTrend = async (period = 'daily') => {
  return apiRequest(`/analytics/sales-trend?period=${period}`);
};

export const getTopProducts = async (limit = 10) => {
  return apiRequest(`/analytics/top-products?limit=${limit}`);
};

export const getTopCustomers = async (limit = 10) => {
  return apiRequest(`/analytics/top-customers?limit=${limit}`);
};

export const getPaymentMethodStats = async () => {
  return apiRequest('/analytics/payment-methods');
};

// ============================================
// INVENTORY API SERVICES
// ============================================

export const getStockLevels = async () => {
  return apiRequest('/inventory/stock-levels');
};

export const getLowStockAlerts = async (threshold = 10) => {
  return apiRequest(`/inventory/low-stock-alerts?threshold=${threshold}`);
};

export const getStockAdjustments = async (productId = null, limit = 50) => {
  let url = `/inventory/stock-adjustments?limit=${limit}`;
  if (productId) url += `&product_id=${productId}`;
  return apiRequest(url);
};

export const getInventorySummary = async () => {
  return apiRequest('/inventory/summary');
};

export const getStockByCategory = async () => {
  return apiRequest('/inventory/by-category');
};
