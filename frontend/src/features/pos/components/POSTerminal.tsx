import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { Product, SelectedOption, Order, formatSatang } from '../../../shared/types';
import { CategoryTabs } from '../../category';
import { ReceiptModal } from './ReceiptModal';
import {
  Plus,
  Minus,
  Trash2,
  Banknote,
  Store,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface POSTicketItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: SelectedOption[];
  unitPriceSatang: number;
  totalSatang: number;
}

export const POSTerminal: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [ticketItems, setTicketItems] = useState<POSTicketItem[]>([]);
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNumber, setTableNumber] = useState('1');
  const [cashReceivedBaht, setCashReceivedBaht] = useState<number | ''>('');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const filteredProducts = products.filter((p) => {
    return selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
  });

  const subtotalSatang = ticketItems.reduce((sum, item) => sum + item.totalSatang, 0);

  const handleAddProduct = (product: Product) => {
    const defaultOption = product.options?.[0];
    const options: SelectedOption[] = defaultOption
      ? [
          {
            id: defaultOption.id,
            name: defaultOption.name,
            nameTh: defaultOption.nameTh,
            priceSatang: defaultOption.priceSatang,
          },
        ]
      : [];

    const optionsPrice = options.reduce((s, o) => s + o.priceSatang, 0);
    const unitPriceSatang = product.priceSatang + optionsPrice;

    setTicketItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                totalSatang: (i.quantity + 1) * i.unitPriceSatang,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          id: `pos-${product.id}-${Date.now()}`,
          product,
          quantity: 1,
          selectedOptions: options,
          unitPriceSatang,
          totalSatang: unitPriceSatang,
        },
      ];
    });
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setTicketItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalSatang: nextQty * item.unitPriceSatang,
            };
          }
          return item;
        })
        .filter((i): i is POSTicketItem => i !== null)
    );
  };

  const handleClearTicket = () => {
    setTicketItems([]);
    setCashReceivedBaht('');
  };

  const cashReceivedSatang = typeof cashReceivedBaht === 'number' ? cashReceivedBaht * 100 : 0;
  const changeSatang = Math.max(0, cashReceivedSatang - subtotalSatang);

  const handleCollectCash = async () => {
    if (ticketItems.length === 0) return;
    if (cashReceivedSatang < subtotalSatang) {
      alert('ยอดเงินที่รับมาน้อยกว่ายอดชำระ กรุณาตรวจสอบจำนวนเงิน');
      return;
    }

    const orderItems = ticketItems.map((item, idx) => ({
      id: `pos-item-${Date.now()}-${idx}`,
      orderId: '',
      productId: item.product.id,
      productName: item.product.name,
      productNameTh: item.product.nameTh,
      unitPriceSatang: item.unitPriceSatang,
      quantity: item.quantity,
      optionsSnapshot: item.selectedOptions,
      subtotalSatang: item.totalSatang,
    }));

    const order = await api.createOrder({
      status: 'placed',
      fulfillmentType: 'pos',
      subtotalSatang,
      deliveryFeeSatang: 0,
      totalSatang: subtotalSatang,
      customerName: orderType === 'dine_in' ? `ลูกค้าโต๊ะ ${tableNumber}` : 'ลูกค้าหน้าร้าน (ห่อกลับ)',
      customerPhone: '-',
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      paymentMethod: 'pos_cash',
      paymentStatus: 'succeeded',
      items: orderItems,
    });

    setLastCompletedOrder(order);
    setIsReceiptOpen(true);
    handleClearTicket();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-12">
      {/* Left: Product Selector Grid */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        {/* Category bar */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-sm">
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              disabled={!product.isAvailable}
              onClick={() => handleAddProduct(product)}
              className={`p-3 bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md hover:border-amber-400 active:scale-[0.98] transition flex flex-col justify-between text-left group ${
                !product.isAvailable ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <div className="w-full">
                {product.imageUrl && (
                  <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2 bg-stone-100">
                    <img
                      src={product.imageUrl}
                      alt={product.nameTh}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {product.isSignature && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        เด่น
                      </span>
                    )}
                  </div>
                )}
                <h4 className="font-bold text-stone-900 text-xs line-clamp-2 leading-tight">
                  {product.nameTh}
                </h4>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between w-full">
                <span className="text-xs font-black text-amber-600">
                  {formatSatang(product.priceSatang)}
                </span>
                <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cashier Order Ticket */}
      <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-stone-200/80 shadow-md p-5 space-y-4 sticky top-20">
        {/* Ticket Header & Type */}
        <div className="space-y-3 border-b border-stone-100 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-500" />
              <span>บิลขายหน้าร้าน (POS)</span>
            </h2>
            {ticketItems.length > 0 && (
              <button
                onClick={handleClearTicket}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                ล้างบิล
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrderType('dine_in')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                orderType === 'dine_in'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>ทานที่ร้าน</span>
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                orderType === 'takeaway'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ใส่ห่อกลับบ้าน</span>
            </button>
          </div>

          {orderType === 'dine_in' && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-stone-700">เลขโต๊ะ:</span>
              <div className="flex gap-1.5 overflow-x-auto">
                {['1', '2', '3', '4', '5', '6'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTableNumber(t)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                      tableNumber === t
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ticket Items List */}
        <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-stone-100 pr-1">
          {ticketItems.length === 0 ? (
            <div className="py-10 text-center text-stone-300 space-y-1">
              <ShoppingBag className="w-8 h-8 mx-auto" />
              <p className="text-xs">กดเลือกเมนูด้านซ้ายเพื่อเพิ่มในบิล</p>
            </div>
          ) : (
            ticketItems.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex-1 min-w-0 pr-2">
                  <span className="font-bold text-stone-800 truncate block">
                    {item.product.nameTh}
                  </span>
                  <span className="text-stone-400 font-normal">
                    @{formatSatang(item.unitPriceSatang)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="p-1 hover:bg-stone-200"
                    >
                      <Minus className="w-3 h-3 text-stone-600" />
                    </button>
                    <span className="w-6 text-center font-bold text-stone-800">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="p-1 hover:bg-stone-200"
                    >
                      <Plus className="w-3 h-3 text-stone-600" />
                    </button>
                  </div>

                  <span className="font-black text-amber-600 w-16 text-right">
                    {formatSatang(item.totalSatang)}
                  </span>

                  <button
                    onClick={() => handleUpdateQty(item.id, -item.quantity)}
                    className="text-stone-300 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total Summary */}
        <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
          <div className="flex justify-between text-sm font-black text-stone-900">
            <span>ยอดสุทธิที่ต้องชำระ</span>
            <span className="text-amber-600 text-lg">{formatSatang(subtotalSatang)}</span>
          </div>
        </div>

        {/* Cash Calculation Section */}
        {ticketItems.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-stone-100 bg-stone-50/70 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700">รับเงินสด (บาท):</label>
              <input
                type="number"
                value={cashReceivedBaht}
                onChange={(e) => setCashReceivedBaht(e.target.value ? Number(e.target.value) : '')}
                placeholder="ระบุจำนวนเงิน"
                className="w-28 px-2.5 py-1.5 text-right font-black text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Quick cash buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setCashReceivedBaht(subtotalSatang / 100)}
                className="py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                พอดี
              </button>
              <button
                onClick={() => setCashReceivedBaht(100)}
                className="py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                ฿100
              </button>
              <button
                onClick={() => setCashReceivedBaht(500)}
                className="py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                ฿500
              </button>
              <button
                onClick={() => setCashReceivedBaht(1000)}
                className="py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                ฿1,000
              </button>
            </div>

            {/* Change Display */}
            {cashReceivedSatang > 0 && (
              <div className="flex justify-between items-center text-xs font-bold pt-1 text-stone-800">
                <span>เงินทอน:</span>
                <span
                  className={`text-sm ${
                    cashReceivedSatang >= subtotalSatang ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {cashReceivedSatang >= subtotalSatang
                    ? formatSatang(changeSatang)
                    : `ขาดอีก ${formatSatang(subtotalSatang - cashReceivedSatang)}`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Submit & Payment Actions */}
        <div className="space-y-2">
          <button
            onClick={handleCollectCash}
            disabled={ticketItems.length === 0}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <Banknote className="w-5 h-5" />
            <span>รับเงินสดและเปิดบิล</span>
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={lastCompletedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        cashReceivedSatang={cashReceivedSatang}
      />
    </div>
  );
};
