import React, { useState, useEffect } from 'react';
import { formatSatang } from '../../../shared/types';
import { QrCode, CheckCircle2, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

interface PromptPayQRProps {
  amountSatang: number;
  orderNumber: string;
  onPaymentSuccess: () => void;
}

export const PromptPayQR: React.FC<PromptPayQRProps> = ({
  amountSatang,
  orderNumber,
  onPaymentSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl max-w-sm mx-auto text-center">
      {/* PromptPay Top Banner */}
      <div className="bg-[#003b6d] text-white p-5 flex flex-col items-center justify-center space-y-1">
        <div className="inline-flex items-center gap-2">
          <QrCode className="w-6 h-6 text-cyan-300" />
          <span className="font-extrabold tracking-wider text-lg">Thai QR Payment</span>
        </div>
        <span className="text-xs text-blue-200 font-medium">พร้อมเพย์ (PromptPay)</span>
      </div>

      <div className="p-6 space-y-5">
        {/* Merchant & Order info */}
        <div>
          <h4 className="text-sm font-bold text-stone-800">ร้าน ยำปลาดุกฟู & ข้าวแกงรสเด็ด</h4>
          <p className="text-xs text-stone-400 mt-0.5">เลขออเดอร์: {orderNumber}</p>
        </div>

        {/* QR Code Container */}
        <div className="relative mx-auto w-52 h-52 bg-stone-50 border-2 border-dashed border-[#003b6d]/30 rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
          {/* Stylized QR representation */}
          <div className="w-full h-full bg-[#003b6d]/5 rounded-xl border border-[#003b6d]/10 flex flex-col items-center justify-center p-2 relative">
            <div className="grid grid-cols-6 gap-1 w-32 h-32 opacity-80">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    i % 2 === 0 || i % 7 === 0 ? 'bg-[#003b6d]' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-1.5 rounded-lg shadow-md border border-stone-200">
                <QrCode className="w-7 h-7 text-[#003b6d]" />
              </div>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
          <span className="text-xs text-stone-500 font-medium block">ยอดชำระสุทธิ</span>
          <span className="text-2xl font-black text-[#003b6d] block mt-0.5">
            {formatSatang(amountSatang)}
          </span>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 font-medium">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>กรุณาชำระเงินภายใน</span>
          <span className="font-bold text-amber-600">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Simulator Button */}
        <button
          onClick={handleSimulatePayment}
          disabled={isVerifying}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>กำลังตรวจสอบยอดเงิน...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>จำลองการโอนเงินสำเร็จ</span>
            </>
          )}
        </button>

        <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ระบบตรวจสอบยอดอัตโนมัติตลอด 24 ชม.</span>
        </div>
      </div>
    </div>
  );
};
