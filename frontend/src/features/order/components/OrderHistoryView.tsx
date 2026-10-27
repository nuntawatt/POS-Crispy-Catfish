import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { formatSatang } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';
import { Clock, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.getOrders(),
  });

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') {
      return !['delivered', 'picked_up', 'canceled'].includes(o.status);
    }
    if (filter === 'completed') {
      return ['delivered', 'picked_up'].includes(o.status);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">ประวัติคำสั่งซื้อ</h1>
          <p className="text-xs text-stone-500 mt-0.5">ติดตามสถานะและดูรายการสั่งซื้อย้อนหลัง</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ทั้งหมด ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'active' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            กำลังดำเนินการ
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'completed' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/80 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800">ไม่มีคำสั่งซื้อในหมวดนี้</h3>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition"
          >
            สั่งอาหารตอนนี้
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/order/${order.id}`)}
              className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-stone-900 text-base">
                    #{order.orderNumber}
                  </span>
                  <Badge status={order.status} />
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('th-TH', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-sm text-stone-600">
                  {order.items.map((i) => `${i.quantity}x ${i.productNameTh}`).join(', ')}
                </p>

                <div className="text-xs text-stone-400">
                  ผู้รับ: {order.customerName} ({order.fulfillmentType === 'delivery' ? 'จัดส่ง' : 'รับหน้าร้าน'})
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-stone-400 block font-normal">ยอดสุทธิ</span>
                  <span className="text-lg font-black text-amber-600">
                    {formatSatang(order.totalSatang)}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-stone-50 group-hover:bg-amber-500 group-hover:text-white transition flex items-center justify-center text-stone-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
