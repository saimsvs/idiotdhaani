import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface StorefrontProps {
  products: Product[];
  onAddToCart: (id: string) => void;
}

export function Storefront({ products, onAddToCart }: StorefrontProps) {
  return (
    <div className="min-h-screen bg-dhaani-cream flex flex-col">
      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-8 py-8 w-full flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="text-center w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-dhaani-green font-serif italic mb-2">Dhaani</h1>
            <p className="font-sans text-sm tracking-widest uppercase opacity-70">Nature's Best Snacks</p>
          </div>
        </header>

        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl text-dhaani-brown font-bold mb-2">Our Selection</h2>
          <div className="w-12 h-1 bg-dhaani-green mx-auto rounded-full opacity-50" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm font-sans opacity-40">
        <p>&copy; {new Date().getFullYear()} Dhaani Snack Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
