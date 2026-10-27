import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { MenuList } from '../features/menu';
import { CheckoutView } from '../features/checkout';
import { OrderTrackingView, OrderHistoryView, KitchenQueueView } from '../features/order';
import { POSTerminal } from '../features/pos';
import { AdminDashboard } from '../features/admin';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Customer Storefront & Ordering */}
        <Route path="/" element={<MenuList />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/order/:id" element={<OrderTrackingView />} />
        <Route path="/history" element={<OrderHistoryView />} />

        {/* Staff & Cashier POS */}
        <Route path="/pos" element={<POSTerminal />} />

        {/* Kitchen KDS Queue */}
        <Route path="/kitchen" element={<KitchenQueueView />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
