import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../cart';
import { api } from '../../../shared/api/client';
import { PromptPayQR } from '../../payment';
import { FulfillmentType, PaymentMethod, formatSatang } from '../../../shared/types';
import {
  ShoppingBag,
  Store,
  Bike,
  CreditCard,
  Banknote,
  MapPin,
  User,
  Phone,
  FileText,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotalSatang, clearCart } = useCartStore();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPromptPayModal, setShowPromptPayModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotalSatang = getSubtotalSatang();
  // Delivery fee: 30 THB (3,000 Satang) if delivery, 0 if pickup
  const deliveryFeeSatang = fulfillmentType === 'delivery' ? 3000 : 0;
  const totalSatang = subtotalSatang + deliveryFeeSatang;

  if (items.length === 0 && !pendingOrderId) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-800">ไม่มีรายการอาหารในตะกร้า</h2>
        <p className="text-sm text-stone-500">กรุณาเลือกเมนูที่คุณต้องการสั่งก่อนดำเนินการชำระเงิน</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition"
        >
          กลับไปเลือกเมนูอาหาร
        </button>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = 'กรุณากรอกชื่อผู้สั่งอาหาร';
    if (!customerPhone.trim() || customerPhone.length < 9) {
      errs.phone = 'กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้';
    }
    if (fulfillmentType === 'delivery' && !customerAddress.trim()) {
      errs.address = 'กรุณากรอกที่อยู่สำหรับจัดส่ง (ไม่เกิน 7 กม. จากร้าน)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const orderItems = items.map((item, idx) => ({
        id: `ord-item-${Date.now()}-${idx}`,
        orderId: '',
        productId: item.productId,
        productName: item.product.name,
        productNameTh: item.product.nameTh,
        unitPriceSatang: item.unitPriceSatang,
        quantity: item.quantity,
        optionsSnapshot: item.selectedOptions,
        subtotalSatang: item.totalSatang,
      }));

      const newOrder = await api.createOrder({
        status: paymentMethod === 'promptpay' ? 'pending_payment' : 'placed',
        fulfillmentType,
        subtotalSatang,
        deliveryFeeSatang,
        totalSatang,
        customerName,
        customerPhone,
        customerAddress: fulfillmentType === 'delivery' ? customerAddress : undefined,
        notes,
        paymentMethod,
        paymentStatus: paymentMethod === 'promptpay' ? 'pending' : 'succeeded',
        items: orderItems,
      });

      setPendingOrderId(newOrder.id);

      if (paymentMethod === 'promptpay') {
        setShowPromptPayModal(true);
      } else {
        clearCart();
        navigate(`/order/${newOrder.id}`);
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการบันทึกออเดอร์ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromptPayConfirmed = async () => {
    if (!pendingOrderId) return;
    await api.updateOrderStatus(pendingOrderId, 'placed');
    clearCart();
    navigate(`/order/${pendingOrderId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">ยืนยันการสั่งซื้อและชำระเงิน</h1>
          <p className="text-xs text-stone-500 mt-0.5">กรุณาตรวจสอบข้อมูลการจัดส่งและวิธีการชำระเงิน</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Fulfillment Type */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-800">1. รูปแบบการรับอาหาร</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition ${
                  fulfillmentType === 'pickup'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-sm'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Store className="w-6 h-6 text-amber-600" />
                <span className="text-sm">รับที่ร้าน (หน้าร้าน)</span>
                <span className="text-[11px] text-stone-400 font-normal">ไม่มีค่าบริการจัดส่ง</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition ${
                  fulfillmentType === 'delivery'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-sm'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Bike className="w-6 h-6 text-amber-600" />
                <span className="text-sm">จัดส่งด่วน (Delivery)</span>
                <span className="text-[11px] text-stone-400 font-normal">
                  ค่าส่ง +{formatSatang(3000)} (รัศมี 7 กม.)
                </span>
              </button>
            </div>
          </div>

          {/* 2. Customer Information */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-800">2. ข้อมูลผู้สั่งซื้อ</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="เช่น คุณสมชาย ใจดี"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="เช่น 081-234-5678"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              {fulfillmentType === 'delivery' && (
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    ที่อยู่สำหรับจัดส่ง <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <textarea
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="บ้านเลขที่, ซอย, ถนน, จุดสังเกตชัดเจน (จำกัดรัศมี 7 กม.)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-xs text-rose-500 mt-1">{errors.address}</p>
                  )}
                  <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    ร้านตรวจสอบระยะทางด้วยระบบพิกัด GPS อัตโนมัติ
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  หมายเหตุเพิ่มเติมถึงร้านค้า
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="เช่น วางไว้ที่หน้าประตู, โทรหาก่อนส่ง"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-800">3. ช่องทางการชำระเงิน</h3>
            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('promptpay')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'promptpay'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#003b6d] text-white rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      สแกนจ่ายผ่าน Thai QR (พร้อมเพย์)
                    </h4>
                    <p className="text-xs text-stone-500">ฟรีค่าธรรมเนียม ทุกแอปธนาคาร</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'promptpay'}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {fulfillmentType === 'pickup' && (
                <label
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'cash'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">ชำระเงินสดที่หน้าร้าน</h4>
                      <p className="text-xs text-stone-500">ชำระตอนมารับอาหาร</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash'}
                    onChange={() => {}}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-5 sticky top-20">
          <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            สรุปรายการสั่งซื้อ ({items.length} เมนู)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
            {items.map((item) => (
              <div key={item.id} className="pt-2.5 first:pt-0 flex justify-between text-sm">
                <div>
                  <span className="font-semibold text-stone-800">
                    {item.quantity}x {item.product.nameTh}
                  </span>
                  {item.selectedOptions.length > 0 && (
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {item.selectedOptions.map((o) => o.nameTh).join(', ')}
                    </div>
                  )}
                </div>
                <span className="font-bold text-stone-800 shrink-0">
                  {formatSatang(item.totalSatang)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>ค่าอาหาร</span>
              <span>{formatSatang(subtotalSatang)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>ค่าจัดส่ง ({fulfillmentType === 'delivery' ? '7 กม.' : 'รับเอง'})</span>
              <span>{deliveryFeeSatang > 0 ? formatSatang(deliveryFeeSatang) : 'ฟรี'}</span>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-between text-lg font-black text-amber-600">
              <span>ยอดชำระทั้งหมด</span>
              <span>{formatSatang(totalSatang)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white rounded-2xl font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            {isSubmitting ? 'กำลังบันทึกออเดอร์...' : 'ยืนยันและสั่งอาหาร'}
          </button>
        </div>
      </div>

      {/* PromptPay QR Modal */}
      {showPromptPayModal && pendingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <PromptPayQR
              amountSatang={totalSatang}
              orderNumber={pendingOrderId}
              onPaymentSuccess={handlePromptPayConfirmed}
            />
          </div>
        </div>
      )}
    </div>
  );
};
