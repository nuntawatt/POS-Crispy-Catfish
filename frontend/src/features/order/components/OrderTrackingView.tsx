import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { OrderStatus, formatSatang } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';
import { ReviewModal } from '../../review';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  ShoppingBag,
  ArrowLeft,
  Star,
  MapPin,
  Phone,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => (id ? api.getOrderById(id) : null),
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      api.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-stone-500">กำลังโหลดข้อมูลออเดอร์...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto" />
        <h2 className="text-lg font-bold text-stone-800">ไม่พบข้อมูลออเดอร์นี้</h2>
        <p className="text-xs text-stone-500">โปรดตรวจสอบหมายเลขออเดอร์หรือกลับไปหน้าหลัก</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'placed', label: 'รับออเดอร์', icon: <CheckCircle2 className="w-5 h-5" /> },
    { status: 'preparing', label: 'กำลังปรุงอาหาร', icon: <ChefHat className="w-5 h-5" /> },
    {
      status: order.fulfillmentType === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup',
      label: order.fulfillmentType === 'delivery' ? 'ไรเดอร์กำลังจัดส่ง' : 'พร้อมรับหน้าร้าน',
      icon: order.fulfillmentType === 'delivery' ? <Bike className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
    },
    {
      status: order.fulfillmentType === 'delivery' ? 'delivered' : 'picked_up',
      label: 'เสร็จสิ้นเรียบร้อย',
      icon: <PackageCheck className="w-5 h-5" />,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return -1;
      case 'placed':
        return 0;
      case 'preparing':
        return 1;
      case 'ready_for_pickup':
      case 'out_for_delivery':
        return 2;
      case 'delivered':
      case 'picked_up':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCompleted = order.status === 'delivered' || order.status === 'picked_up';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ดูประวัติคำสั่งซื้อทั้งหมด</span>
        </button>
        <span className="text-xs text-stone-400">อัปเดตอัตโนมัติทุก 5 วินาที</span>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl md:text-2xl font-black text-stone-900">
                ออเดอร์ #{order.orderNumber}
              </h2>
              <Badge status={order.status} />
            </div>
            <p className="text-xs text-stone-400 mt-1">
              สั่งเมื่อ {new Date(order.createdAt).toLocaleString('th-TH')}
            </p>
          </div>

          {/* Quick Demo Controls to test status changes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 font-medium mr-1">จำลองสถานะ:</span>
            <button
              onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'preparing' })}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            >
              ปรุงอาหาร
            </button>
            <button
              onClick={() =>
                updateStatusMutation.mutate({
                  orderId: order.id,
                  status: order.fulfillmentType === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup',
                })
              }
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            >
              พร้อมส่ง
            </button>
            <button
              onClick={() =>
                updateStatusMutation.mutate({
                  orderId: order.id,
                  status: order.fulfillmentType === 'delivery' ? 'delivered' : 'picked_up',
                })
              }
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold"
            >
              สำเร็จ
            </button>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="py-4">
          <div className="grid grid-cols-4 gap-2 relative">
            {steps.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-2 relative">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition shadow-sm ${
                      isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-bounce'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-amber-600'
                        : isPast
                        ? 'text-emerald-700'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery / Pickup Info */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <span className="font-bold">ผู้รับอาหาร:</span>
            <span>{order.customerName}</span>
            <span className="text-stone-400">|</span>
            <Phone className="w-3.5 h-3.5 text-stone-400" />
            <span>{order.customerPhone}</span>
          </div>

          {order.customerAddress && (
            <div className="flex items-start gap-2 text-stone-700 pt-1 border-t border-stone-200/50">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>ที่อยู่จัดส่ง: {order.customerAddress}</span>
            </div>
          )}

          {order.tableNumber && (
            <div className="flex items-center gap-2 text-stone-700 font-bold">
              <span>ทานที่ร้าน: โต๊ะ {order.tableNumber}</span>
            </div>
          )}
        </div>

        {/* Items Breakdown */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-stone-800">รายการอาหารที่สั่ง</h4>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between text-sm">
                <div>
                  <div className="font-bold text-stone-800">
                    {item.quantity}x {item.productNameTh}
                  </div>
                  {item.optionsSnapshot && item.optionsSnapshot.length > 0 && (
                    <div className="text-xs text-stone-400 mt-0.5">
                      {item.optionsSnapshot.map((o) => o.nameTh).join(', ')}
                    </div>
                  )}
                </div>
                <span className="font-bold text-stone-800">
                  {formatSatang(item.subtotalSatang)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>ค่าอาหาร</span>
              <span>{formatSatang(order.subtotalSatang)}</span>
            </div>
            {order.deliveryFeeSatang > 0 && (
              <div className="flex justify-between">
                <span>ค่าจัดส่ง (7 กม.)</span>
                <span>{formatSatang(order.deliveryFeeSatang)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-black text-amber-600">
              <span>ยอดสุทธิ</span>
              <span>{formatSatang(order.totalSatang)}</span>
            </div>
          </div>
        </div>

        {/* Review Action if completed */}
        {isCompleted && (
          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={() => setIsReviewOpen(true)}
              className="w-full py-3 px-4 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>ให้คะแนนและรีวิวความอร่อย</span>
            </button>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        orderId={order.id}
      />
    </div>
  );
};
