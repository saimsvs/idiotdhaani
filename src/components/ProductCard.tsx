import { Product } from '../types';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.02] duration-200 p-4 flex flex-col h-full font-sans">
      <div className="w-full h-32 bg-dhaani-green rounded-xl mb-4 relative flex items-center justify-center overflow-hidden">
        {product.imageBase64 ? (
          <img 
            src={product.imageBase64} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white opacity-40 font-sans">
            {product.name.split(' ')[0]}
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-lg text-gray-800">
        {product.name}
      </h3>
      
      <p className="text-xs opacity-70 font-sans mb-4 flex-grow text-gray-600">
        {product.description}
      </p>
      
      <div className="mt-auto flex justify-between items-center pt-2">
        <span className="font-bold text-dhaani-green">
          Rs. {product.price}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`px-4 py-1.5 rounded-full text-xs font-sans transition-opacity flex items-center gap-1.5 ${
            isAdded ? 'bg-dhaani-brown text-white' : 'bg-dhaani-green text-white hover:opacity-90'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
}
