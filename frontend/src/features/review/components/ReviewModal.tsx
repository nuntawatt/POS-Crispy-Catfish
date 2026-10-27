import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { Modal } from '../../../shared/components/Modal';
import { Star, Send, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, orderId }) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const reviewMutation = useMutation({
    mutationFn: () =>
      api.submitReview({
        orderId,
        userName: 'คุณลูกค้า',
        rating,
        comment,
      }),
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    reviewMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="รีวิวความอร่อยของอาหาร">
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h4 className="text-lg font-bold text-stone-900">ขอบพระคุณสำหรับความคิดเห็น!</h4>
          <p className="text-xs text-stone-500">เราจะนำคำติชมไปพัฒนาความอร่อยให้ดียิ่งขึ้น</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-stone-500">ความพึงพอใจโดยรวม</span>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform active:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-600">
              {rating === 5 && 'ยอดเยี่ยมมาก อร่อยประทับใจ!'}
              {rating === 4 && 'อร่อยมาก คุ้มค่า'}
              {rating === 3 && 'รสชาติดี ปานกลาง'}
              {rating === 2 && 'พอใช้ได้ อยากให้ปรับปรุง'}
              {rating === 1 && 'ไม่ประทับใจ'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              แสดงความคิดเห็นของคุณ
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="บอกเราหน่อยว่าคุณชอบอะไร หรืออยากให้ปรับปรุงอะไร (เช่น ยำปลาดุกฟูกรอบสะใจมาก, ข้าวแกงเผ็ดร้อนกำลังดี...)"
              className="w-full p-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={reviewMutation.isPending || !comment.trim()}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <Send className="w-4 h-4" />
            <span>{reviewMutation.isPending ? 'กำลังส่ง...' : 'ส่งรีวิว'}</span>
          </button>
        </form>
      )}
    </Modal>
  );
};
