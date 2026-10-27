import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { formatSatang, OrderStatus } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Utensils,
  Check,
  X,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders'>('overview');
  const [searchMenu, setSearchMenu] = useState('');

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.getOrders(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.updateProductAvailability(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      api.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Calculate statistics
  const totalSalesSatang = orders
    .filter((o) => o.paymentStatus === 'succeeded' || o.status === 'delivered' || o.status === 'picked_up')
    .reduce((sum, o) => sum + o.totalSatang, 0);

  const completedOrders = orders.filter(
    (o) => o.status === 'delivered' || o.status === 'picked_up'
  ).length;

  const averageTicketSatang =
    completedOrders > 0 ? Math.round(totalSalesSatang / completedOrders) : 0;

  const filteredProducts = products.filter(
    (p) =>
      p.nameTh.toLowerCase().includes(searchMenu.toLowerCase()) ||
      p.name.toLowerCase().includes(searchMenu.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">ระบบจัดการหลังร้าน (Admin Portal)</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            ภาพรวมยอดขาย สต๊อกเมนูอาหาร และรายการคำสั่งซื้อ
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ภาพรวมยอดขาย
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'menu'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            จัดการเมนู & สต็อก
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            คำสั่งซื้อทั้งหมด ({orders.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">ยอดขายรวมทั้งหมด</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                {formatSatang(totalSalesSatang)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>คำนวณจาก Satang แม่นยำ 100%</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">จำนวนออเดอร์สำเร็จ</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                {completedOrders} / {orders.length}
              </h3>
              <p className="text-[11px] text-stone-400">ออเดอร์ทั้งหน้าร้านและออนไลน์</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">ยอดเฉลี่ยต่อบิล</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Utensils className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                {formatSatang(averageTicketSatang)}
              </h3>
              <p className="text-[11px] text-stone-400">Ticket Average</p>
            </div>
          </div>

          {/* Quick Orders List */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">ออเดอร์ล่าสุด</h3>
            <div className="divide-y divide-stone-100 overflow-x-auto">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between min-w-[500px]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">#{order.orderNumber}</span>
                      <Badge status={order.status} />
                    </div>
                    <p className="text-xs text-stone-500">
                      {order.customerName} •{' '}
                      {order.items.map((i) => `${i.quantity}x ${i.productNameTh}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-600 block">
                      {formatSatang(order.totalSatang)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(order.createdAt).toLocaleTimeString('th-TH')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Menu Stock Management */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">จัดการสถานะและสต็อกเมนู</h3>
              <p className="text-xs text-stone-500">
                คลิกสวิตช์เพื่อ เปิด/ปิด เมนูอาหารที่หมดได้อย่างรวดเร็ว
              </p>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchMenu}
                onChange={(e) => setSearchMenu(e.target.value)}
                placeholder="ค้นหาชื่อเมนู..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.nameTh}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-100"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{product.nameTh}</h4>
                    <p className="text-xs text-amber-600 font-bold">
                      {formatSatang(product.priceSatang)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold ${
                      product.isAvailable ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {product.isAvailable ? 'พร้อมขาย' : 'สินค้าหมด'}
                  </span>
                  <button
                    onClick={() =>
                      toggleAvailabilityMutation.mutate({
                        id: product.id,
                        isAvailable: !product.isAvailable,
                      })
                    }
                    className={`w-12 h-7 rounded-full p-1 transition flex items-center ${
                      product.isAvailable
                        ? 'bg-emerald-500 justify-end'
                        : 'bg-stone-300 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center">
                      {product.isAvailable ? (
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      ) : (
                        <X className="w-3 h-3 text-stone-400 stroke-[3]" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: All Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-stone-900">จัดการสถานะออเดอร์ทั้งหมด</h3>
          <div className="divide-y divide-stone-100 overflow-x-auto">
            {orders.map((order) => (
              <div key={order.id} className="py-4 space-y-2 min-w-[600px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-stone-900 text-sm">#{order.orderNumber}</span>
                    <Badge status={order.status} />
                    <span className="text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleString('th-TH')}
                    </span>
                  </div>
                  <span className="font-black text-amber-600 text-sm">
                    {formatSatang(order.totalSatang)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>
                    ผู้สั่ง: {order.customerName} ({order.fulfillmentType}) • {order.items.length}{' '}
                    รายการ
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-400">เปลี่ยนสถานะ:</span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatusMutation.mutate({
                          orderId: order.id,
                          status: e.target.value as OrderStatus,
                        })
                      }
                      className="px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white font-medium focus:outline-none"
                    >
                      <option value="pending_payment">รอชำระเงิน</option>
                      <option value="placed">รับออเดอร์แล้ว</option>
                      <option value="preparing">กำลังปรุง</option>
                      <option value="ready_for_pickup">พร้อมรับ/ส่ง</option>
                      <option value="out_for_delivery">ไรเดอร์กำลังส่ง</option>
                      <option value="delivered">จัดส่งสำเร็จ</option>
                      <option value="picked_up">ลูกค้ารับแล้ว</option>
                      <option value="canceled">ยกเลิก</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
