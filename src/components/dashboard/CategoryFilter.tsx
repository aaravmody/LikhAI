import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange 
}) => {
  const { theme } = useTheme();

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    onCategoryChange([]);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Filter by category</h3>
        {selectedCategories.length > 0 && (
          <button 
            onClick={clearFilters}
            className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            Clear filters
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategories.includes(category)
                ? theme === 'dark' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;