import React from 'react';
import { useAuthStore } from '../authStore';
import { Modal } from '../../../shared/components/Modal';
import { Role } from '../../../shared/types';
import { User, ShieldCheck, ChefHat, Bike, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { user, loginAs } = useAuthStore();

  const roles: { role: Role; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'customer',
      label: 'ลูกค้า (Customer)',
      desc: 'สั่งอาหารออนไลน์ ตรวจสอบสถานะ รีวิว',
      icon: <User className="w-5 h-5 text-amber-600" />,
    },
    {
      role: 'staff',
      label: 'พนักงานหน้าร้าน / แคชเชียร์ (Staff)',
      desc: 'ใช้งาน POS รับออเดอร์หน้าร้าน คิวห้องครัว',
      icon: <ChefHat className="w-5 h-5 text-blue-600" />,
    },
    {
      role: 'admin',
      label: 'เจ้าของร้าน / ผู้ดูแล (Admin)',
      desc: 'ดูยอดขาย จัดการเมนู และการตั้งค่าระบบ',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
    },
    {
      role: 'rider',
      label: 'ไรเดอร์ส่งอาหาร (Rider)',
      desc: 'รับงานจัดส่ง อัปเดตตำแหน่งจัดส่ง',
      icon: <Bike className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const handleSelectRole = (r: Role) => {
    loginAs(r);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เปลี่ยนบทบาทผู้ใช้งาน (Switch Role)">
      <div className="space-y-4">
        <p className="text-xs text-stone-500">
          เลือกระดับสิทธิ์เพื่อทดสอบระบบตามความต้องการ:
        </p>
        <div className="space-y-2.5">
          {roles.map((item) => {
            const isCurrent = user?.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleSelectRole(item.role)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between transition ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-sm border border-stone-100">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-800">{item.label}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                {isCurrent && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-2" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
