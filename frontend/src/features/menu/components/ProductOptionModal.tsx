import React, { useState, useEffect } from 'react';
import { Product, SelectedOption, formatSatang } from '../../../shared/types';
import { Modal } from '../../../shared/components/Modal';
import { Plus, Minus, Flame, Sparkles } from 'lucide-react';

interface ProductOptionModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options: SelectedOption[], notes?: string) => void;
}

export const ProductOptionModal: React.FC<ProductOptionModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      // Default option if any free choice is available
      const defaults: SelectedOption[] = [];
      if (product.options && product.options.length > 0) {
        // e.g. pick first spicy level or free option if appropriate
        const defaultChoice = product.options.find((o) => o.priceSatang === 0 && o.isAvailable);
        if (defaultChoice) {
          defaults.push({
            id: defaultChoice.id,
            name: defaultChoice.name,
            nameTh: defaultChoice.nameTh,
            priceSatang: defaultChoice.priceSatang,
          });
        }
      }
      setSelectedOptions(defaults);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const toggleOption = (opt: { id: string; name: string; nameTh: string; priceSatang: number }) => {
    const exists = selectedOptions.some((o) => o.id === opt.id);
    if (exists) {
      setSelectedOptions(selectedOptions.filter((o) => o.id !== opt.id));
    } else {
      setSelectedOptions([...selectedOptions, opt]);
    }
  };

  const optionsTotalSatang = selectedOptions.reduce((sum, o) => sum + o.priceSatang, 0);
  const unitPriceSatang = product.priceSatang + optionsTotalSatang;
  const totalPriceSatang = unitPriceSatang * quantity;

  const handleConfirm = () => {
    onAddToCart(product, quantity, selectedOptions, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.nameTh} maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Product preview */}
        {product.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden h-48 w-full bg-stone-100">
            <img
              src={product.imageUrl}
              alt={product.nameTh}
              className="w-full h-full object-cover"
            />
            {product.isSignature && (
              <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                เมนูแนะนำ
              </span>
            )}
            {product.spicyLevel && product.spicyLevel > 0 && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-rose-500/90 text-white rounded-full text-xs font-bold flex items-center gap-0.5">
                {Array.from({ length: product.spicyLevel }).map((_, idx) => (
                  <Flame key={idx} className="w-3.5 h-3.5 fill-white" />
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold text-stone-900">{product.nameTh}</h3>
          <p className="text-xs text-stone-400 mt-0.5">{product.name}</p>
          {product.description && (
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="mt-3 text-lg font-bold text-amber-600">
            {formatSatang(product.priceSatang)}
          </div>
        </div>

        {/* Options */}
        {product.options && product.options.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="text-sm font-bold text-stone-800 flex items-center justify-between">
              <span>ตัวเลือกเพิ่มเติม / ระดับความเผ็ด</span>
              <span className="text-xs text-stone-400 font-normal">เลือกได้มากกว่า 1 ข้อ</span>
            </h4>
            <div className="space-y-2">
              {product.options.map((opt) => {
                const isSelected = selectedOptions.some((o) => o.id === opt.id);
                return (
                  <label
                    key={opt.id}
                    onClick={() => toggleOption(opt)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-stone-800">{opt.nameTh}</span>
                    </div>
                    <span className="text-xs font-semibold text-stone-600">
                      {opt.priceSatang > 0 ? `+${formatSatang(opt.priceSatang)}` : 'ฟรี'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <label className="text-sm font-bold text-stone-800">
            รายละเอียดเพิ่มเติมถึงร้าน (ถ้ามี)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="เช่น ไม่ใส่ผักชี, น้ำยำเผ็ดน้อยๆ, แยกน้ำแข็ง..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Quantity and Submit */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
          <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 text-stone-600 hover:bg-stone-200 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-stone-800 text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 text-stone-600 hover:bg-stone-200 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-between transition active:scale-[0.98]"
          >
            <span>ใส่ตะกร้า</span>
            <span>{formatSatang(totalPriceSatang)}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
