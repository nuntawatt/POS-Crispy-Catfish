import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { OrderStatus } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';
import { ChefHat, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const KitchenQueueView: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.getOrders(),
    refetchInterval: 3000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      api.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Filter only active kitchen orders
  const activeOrders = orders.filter((o) =>
    ['placed', 'preparing', 'ready_for_pickup'].includes(o.status)
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 rounded-2xl text-stone-900">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black">จอคิวห้องครัว (Kitchen KDS)</h1>
            <p className="text-xs text-stone-400 mt-0.5">
              อัปเดตแบบเรียลไทม์เพื่อเร่งการปรุงอาหารและเตรียมจัดส่ง
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-stone-800 rounded-xl text-xs font-bold border border-stone-700">
            กำลังรอคิว: <span className="text-amber-400 text-sm">{activeOrders.length}</span> ออเดอร์
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold text-stone-800">ไม่มีออเดอร์ค้างในครัว</h3>
          <p className="text-xs text-stone-400">ทุกรายการปรุงเสร็จเรียบร้อยแล้ว!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order) => {
            const isPlaced = order.status === 'placed';
            const isPreparing = order.status === 'preparing';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border-2 flex flex-col justify-between shadow-sm transition overflow-hidden ${
                  isPlaced
                    ? 'border-blue-400 ring-2 ring-blue-100'
                    : isPreparing
                    ? 'border-amber-400 ring-2 ring-amber-100'
                    : 'border-emerald-400'
                }`}
              >
                {/* Header */}
                <div
                  className={`p-4 flex items-center justify-between text-white ${
                    isPlaced
                      ? 'bg-blue-600'
                      : isPreparing
                      ? 'bg-amber-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  <div>
                    <h3 className="font-black text-lg">#{order.orderNumber}</h3>
                    <p className="text-xs opacity-90">
                      {order.tableNumber ? `โต๊ะ ${order.tableNumber}` : order.customerName} (
                      {order.fulfillmentType === 'delivery' ? 'เดลิเวอรี' : 'รับหน้าร้าน'})
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="neutral" className="bg-white/20 text-white border-0">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(order.createdAt).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Badge>
                  </div>
                </div>

                {/* Body - Items */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="divide-y divide-stone-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-2.5 first:pt-0">
                        <div className="flex items-start justify-between">
                          <span className="font-black text-stone-900 text-base">
                            <span className="text-amber-600 mr-2">{item.quantity}x</span>
                            {item.productNameTh}
                          </span>
                        </div>
                        {item.optionsSnapshot && item.optionsSnapshot.length > 0 && (
                          <div className="text-xs font-semibold text-rose-600 mt-0.5 pl-6">
                            ★ {item.optionsSnapshot.map((o) => o.nameTh).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>โน้ตลูกค้า: {order.notes}</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex gap-2">
                  {isPlaced && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: order.id, status: 'preparing' })
                      }
                      className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>เริ่มปรุงอาหาร</span>
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          orderId: order.id,
                          status: order.fulfillmentType === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup',
                        })
                      }
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ปรุงเสร็จแล้ว (พร้อมเสิร์ฟ/ส่ง)</span>
                    </button>
                  )}

                  {order.status === 'ready_for_pickup' && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: order.id, status: 'picked_up' })
                      }
                      className="flex-1 py-3 px-4 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ลูกค้ารับอาหารแล้ว (จบงาน)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
