import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../cartStore';
import { formatSatang } from '../../../shared/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotalSatang, getItemCount } = useCartStore();

  const subtotalSatang = getSubtotalSatang();
  const itemCount = getItemCount();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-amber-500 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-lg font-bold">ตะกร้าของคุณ ({itemCount} รายการ)</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-amber-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-3">
                <ShoppingBag className="w-16 h-16 stroke-1 text-stone-300" />
                <p className="text-base font-medium">ยังไม่มีรายการในตะกร้า</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition"
                >
                  เลือกเมนูอาหาร
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.nameTh}
                      className="w-18 h-18 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-800 text-sm leading-tight truncate">
                      {item.product.nameTh}
                    </h4>
                    <p className="text-xs text-stone-400 truncate">{item.product.name}</p>

                    {item.selectedOptions.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.selectedOptions.map((opt) => (
                          <span
                            key={opt.id}
                            className="text-[11px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                          >
                            +{opt.nameTh} {opt.priceSatang > 0 && `(${formatSatang(opt.priceSatang)})`}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-stone-500 mt-1 italic">
                        โน้ต: {item.notes}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-700 text-sm">
                          {formatSatang(item.totalSatang)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-300 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-50 border-t border-stone-100 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>ยอดรวมค่าอาหาร</span>
                  <span className="font-semibold">{formatSatang(subtotalSatang)}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>(ค่าจัดส่งจะคำนวณในขั้นตอนชำระเงิน)</span>
                  <span>คำนวณถัดไป</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                  <span>ยอดรวมโดยประมาณ</span>
                  <span className="text-amber-600 text-lg">{formatSatang(subtotalSatang)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition transform active:scale-[0.99]"
              >
                <span>ดำเนินการชำระเงิน</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
