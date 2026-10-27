import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { Product, SelectedOption } from '../../../shared/types';
import { ProductCard } from './ProductCard';
import { ProductOptionModal } from './ProductOptionModal';
import { CategoryTabs } from '../../category';
import { useCartStore } from '../../cart';
import { Search, Sparkles } from 'lucide-react';

export const MenuList: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const { addItem } = useCartStore();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
    const matchesSearch =
      p.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (
    product: Product,
    quantity: number,
    options: SelectedOption[],
    notes?: string
  ) => {
    addItem(product, quantity, options, notes);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white p-6 md:p-10 shadow-lg">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ต้นตำรับปลาดุกฟูแท้ สูตรโบราณ</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            ยำปลาดุกฟู & ข้าวแกงรสเด็ด
          </h1>
          <p className="text-amber-100 text-sm md:text-base leading-relaxed">
            กรอบฟู ไม่อมน้ำมัน มะม่วงเปรี้ยวสด พริกขี้หนูสวน น้ำยำสูตรพิเศษแซ่บถึงใจ พร้อมอาหารจานเดียวร้อนๆ ทุกวัน
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-20 bg-stone-50/95 backdrop-blur-sm py-2">
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเมนูอร่อย..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
          />
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-stone-400 space-y-2">
          <p className="text-base font-semibold">ไม่พบเมนูที่คุณค้นหา</p>
          <p className="text-xs">ลองเลือกหมวดหมู่อื่น หรือพิมพ์คำค้นหาใหม่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setActiveProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Options Modal */}
      <ProductOptionModal
        product={activeProduct}
        isOpen={Boolean(activeProduct)}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
