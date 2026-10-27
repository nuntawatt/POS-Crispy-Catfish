import React from 'react';
import { Product, formatSatang } from '../../../shared/types';
import { Plus, Flame, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div
      onClick={() => product.isAvailable && onSelect(product)}
      className={`group relative bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col cursor-pointer ${
        !product.isAvailable ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      {/* Image container */}
      <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.nameTh}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            ไม่มีรูปภาพ
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isSignature && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              เมนูแนะนำ
            </span>
          )}
        </div>

        {product.spicyLevel && product.spicyLevel > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-rose-500/90 text-white rounded-full text-[11px] font-bold flex items-center gap-0.5 shadow-sm">
            {Array.from({ length: product.spicyLevel }).map((_, idx) => (
              <Flame key={idx} className="w-3 h-3 fill-white" />
            ))}
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">
              หมดชั่วคราว
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-stone-900 group-hover:text-amber-600 transition text-base leading-snug">
            {product.nameTh}
          </h4>
          <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{product.name}</p>
          {product.description && (
            <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block font-normal">ราคา</span>
            <span className="text-base font-extrabold text-amber-600">
              {formatSatang(product.priceSatang)}
            </span>
          </div>

          <button
            disabled={!product.isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (product.isAvailable) onSelect(product);
            }}
            className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition flex items-center justify-center shadow-sm disabled:bg-stone-100 disabled:text-stone-400"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
