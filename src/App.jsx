import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/Frontend/HomePage/HomePage";
import POS from "./page/Frontend/POS/POS";
import AddProductPage from "./page/Frontend/Products/AddProductPage";
import ProductListPage from "./page/Frontend/Products/ProductListPage";
import AdjustProduct from "./page/Frontend/Products/AddjustProduct";
import EditProductPage from "./page/Frontend/Products/EditProduct";
import CustomerShop from "./page/Frontend/customer/CustomerShop";
import CartPageCustomer from "./page/Frontend/customer/components/CartPageCustomer";
import CartPage from "./page/Frontend/Cart/CartPage";
import Checkout from "./page/Frontend/Checkout/Checkout";
import Login from "./page/Frontend/Auth/Login";
import CustomerLogin from "./page/Frontend/customer/components/CustomerLogin";
import SaleReport from "./page/Frontend/Analytics/SaleReport";
import SaleDetailsReport from "./page/Frontend/Analytics/SaleDetailsReport";
import CustomerOrders from "./page/Frontend/Analytics/CustomerOrder";
import StockAlert from "./page/Frontend/Inventory/StockAlert";
import StockLevel from "./page/Frontend/Inventory/StockLevel";
import AnalyticsDashboard from "./page/Frontend/Analytics/AnalyticsDashboard";
import InventoryDashboard from "./page/Frontend/Inventory/InventoryDashboard";
import SupplierManagement from "./page/Frontend/Purchese/SupplierManagement";
import AddSupplier from "./page/Frontend/Purchese/AddSupplier";
import PurchaseOrder from "./page/Frontend/Purchese/PurchaseOrder";
import PurchaseListReport from "./page/Frontend/Purchese/PurchaseListReport";
import ProfileSetting from "./page/Setting/ProfileSetting";
import SettingSystem from "./page/Setting/SettingSystem";
import UserSetting from "./page/Setting/UserSetting";
import UserDetail from "./page/Setting/UserDetail";

import OnlineHistory from "./page/Frontend/customer/components/OnlineHistory";

import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CustomerShop />} />
          <Route path="/login-customer" element={<CustomerLogin />} />
          <Route path="/CartPage" element={<CartPageCustomer />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products-list" element={<ProductListPage />} />
          <Route path="/adjustment" element={<AdjustProduct />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/report" element={<SaleReport />} />
          <Route path="/report/close" element={<SaleReport />} />
          <Route path="/report/details" element={<SaleDetailsReport />} />
          <Route path="/order-history" element={<CustomerOrders />} />
          <Route path="/customer/online-order" element={<OnlineHistory />} />

          <Route path="/stock-alert" element={<StockAlert />} />
          <Route path="/stock-level" element={<StockLevel />} />

          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/inventory" element={<InventoryDashboard />} />

          <Route path="/supplier-management" element={<SupplierManagement />} />
          <Route path="/add-supplier" element={<AddSupplier />} />

          <Route path="/purchase-order" element={<PurchaseOrder />} />
          <Route path="/purchase-list" element={<PurchaseListReport />} />

          <Route path="/profile-settings" element={<ProfileSetting />} /> 
          <Route path="/system-settings" element={<SettingSystem />} />
          <Route path="/user-settings" element={<UserSetting />} />
          <Route path="/user-details/:id" element={<UserDetail />} />
          <Route path="/customer-details/:id" element={<UserDetail />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;