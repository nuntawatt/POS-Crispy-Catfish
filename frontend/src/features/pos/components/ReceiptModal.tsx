import React from 'react';
import { Order, formatSatang } from '../../../shared/types';
import { Modal } from '../../../shared/components/Modal';
import { Printer, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  cashReceivedSatang?: number;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  cashReceivedSatang,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const changeSatang =
    cashReceivedSatang && cashReceivedSatang > order.totalSatang
      ? cashReceivedSatang - order.totalSatang
      : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ใบเสร็จรับเงิน (Receipt)" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Printable slip format */}
        <div
          id="printable-slip"
          className="bg-stone-50 p-6 rounded-2xl border border-dashed border-stone-300 font-mono text-xs space-y-4 text-stone-800"
        >
          {/* Header */}
          <div className="text-center space-y-1 border-b border-dashed border-stone-300 pb-3">
            <h2 className="text-base font-black tracking-wider">ร้าน ยำปลาดุกฟู & ข้าวแกงรสเด็ด</h2>
            <p className="text-[11px] text-stone-500">POS-CRISPY-CATFISH BRANCH 001</p>
            <p className="text-[10px] text-stone-400">โทร. 02-999-8888 | TAX ID: 0105566000000</p>
          </div>

          {/* Meta */}
          <div className="flex justify-between text-[11px] border-b border-dashed border-stone-300 pb-2">
            <div>
              <span>บิลเลขที่: #{order.orderNumber}</span>
              <br />
              <span>
                {order.tableNumber ? `โต๊ะ: ${order.tableNumber}` : `ลูกค้า: ${order.customerName}`}
              </span>
            </div>
            <div className="text-right">
              <span>{new Date(order.createdAt).toLocaleDateString('th-TH')}</span>
              <br />
              <span>{new Date(order.createdAt).toLocaleTimeString('th-TH')}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 border-b border-dashed border-stone-300 pb-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <span className="font-bold">
                    {item.quantity}x {item.productNameTh}
                  </span>
                  {item.optionsSnapshot && item.optionsSnapshot.length > 0 && (
                    <div className="text-[10px] text-stone-500 pl-4">
                      {item.optionsSnapshot.map((o) => o.nameTh).join(', ')}
                    </div>
                  )}
                </div>
                <span className="font-bold shrink-0">{formatSatang(item.subtotalSatang)}</span>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
            <div className="flex justify-between">
              <span>ยอดรวมค่าอาหาร</span>
              <span>{formatSatang(order.subtotalSatang)}</span>
            </div>
            {order.deliveryFeeSatang > 0 && (
              <div className="flex justify-between">
                <span>ค่าบริการจัดส่ง</span>
                <span>{formatSatang(order.deliveryFeeSatang)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black pt-1">
              <span>ยอดสุทธิ (TOTAL)</span>
              <span>{formatSatang(order.totalSatang)}</span>
            </div>
          </div>

          {/* Payment summary */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>การชำระเงิน</span>
              <span className="font-bold uppercase">{order.paymentMethod}</span>
            </div>
            {cashReceivedSatang !== undefined && cashReceivedSatang > 0 && (
              <>
                <div className="flex justify-between">
                  <span>รับเงินสด (Cash)</span>
                  <span>{formatSatang(cashReceivedSatang)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-700">
                  <span>เงินทอน (Change)</span>
                  <span>{formatSatang(changeSatang)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center pt-2 text-[10px] text-stone-400">
            *** ขอบคุณที่อุดหนุน ขอให้อร่อยกับมื้ออาหาร ***
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ใบเสร็จ (Print)</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>เสร็จสิ้น</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
