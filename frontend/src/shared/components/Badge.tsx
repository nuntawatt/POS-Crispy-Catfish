import React from 'react';
import { OrderStatus } from '../types';

interface BadgeProps {
  status?: OrderStatus;
  children?: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, children, variant, className = '' }) => {
  if (status) {
    switch (status) {
      case 'pending_payment':
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 ${className}`}>รอชำระเงิน</span>;
      case 'placed':
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ${className}`}>รับออเดอร์แล้ว</span>;
      case 'preparing':
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 animate-pulse ${className}`}>กำลังปรุง</span>;
      case 'ready_for_pickup':
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 ${className}`}>พร้อมรับ / พร้อมส่ง</span>;
      case 'out_for_delivery':
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 ${className}`}>ไรเดอร์กำลังจัดส่ง</span>;
      case 'delivered':
      case 'picked_up':
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 ${className}`}>สำเร็จ</span>;
      case 'canceled':
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 ${className}`}>ยกเลิก</span>;
      default:
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 ${className}`}>{status}</span>;
    }
  }

  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-stone-100 text-stone-800',
  }[variant || 'neutral'];

  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${variantStyles} ${className}`}>{children}</span>;
};
