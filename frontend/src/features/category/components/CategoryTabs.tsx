import React from 'react';
import { Category } from '../../../shared/types';
import { Utensils, Flame, Soup, Cookie, Coffee } from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'cat-1':
        return <Flame className="w-4 h-4" />;
      case 'cat-2':
        return <Utensils className="w-4 h-4" />;
      case 'cat-3':
        return <Soup className="w-4 h-4" />;
      case 'cat-4':
        return <Cookie className="w-4 h-4" />;
      case 'cat-5':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition whitespace-nowrap flex items-center gap-2 shadow-sm ${
          selectedCategoryId === 'all'
            ? 'bg-amber-500 text-white shadow-amber-500/20'
            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
        }`}
      >
        <span>ทั้งหมด</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition whitespace-nowrap flex items-center gap-2 shadow-sm ${
              isSelected
                ? 'bg-amber-500 text-white shadow-amber-500/20'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {getIcon(cat.id)}
            <span>{cat.nameTh}</span>
          </button>
        );
      })}
    </div>
  );
};
