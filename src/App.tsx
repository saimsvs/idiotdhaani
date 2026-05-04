import { useState, useEffect } from 'react';
import { Storefront } from './components/Storefront';
import { AdminPanel } from './components/AdminPanel';
import { DEFAULT_PRODUCTS } from './data';
import { Product, Analytics } from './types';
import { Settings } from 'lucide-react';

const PRODUCTS_KEY = 'dhaani_products';
const ANALYTICS_KEY = 'dhaani_analytics';
const ADMIN_PASSWORD = 'dhaani2025';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ visitors: 0, cartClicks: {} });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    // Load products
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
    }

    // Load analytics & increment visitors
    const storedAnalytics = localStorage.getItem(ANALYTICS_KEY);
    let currentAnalytics: Analytics = { visitors: 0, cartClicks: {} };
    if (storedAnalytics) {
      try {
        currentAnalytics = JSON.parse(storedAnalytics);
      } catch (e) {
        // use default
      }
    }
    
    // Only increment visitor count once per session
    const hasVisited = sessionStorage.getItem('dhaani_visited');
    if (!hasVisited) {
      currentAnalytics.visitors += 1;
      sessionStorage.setItem('dhaani_visited', 'true');
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(currentAnalytics));
    }
    
    setAnalytics(currentAnalytics);
    setIsInitialized(true);
  }, []);

  const handleAddToCart = (productId: string) => {
    setAnalytics(prev => {
      const newClicks = { ...prev.cartClicks, [productId]: (prev.cartClicks[productId] || 0) + 1 };
      const newAnalytics = { ...prev, cartClicks: newClicks };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(newAnalytics));
      return newAnalytics;
    });
  };

  const handleSaveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  };

  const handleResetAnalytics = () => {
    const fresh: Analytics = { visitors: 1, cartClicks: {} };
    setAnalytics(fresh);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(fresh));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setShowPasswordPrompt(false);
      setIsAdminOpen(true);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="relative font-sans antialiased text-gray-900 selection:bg-dhaani-green selection:text-white">
      <Storefront products={products} onAddToCart={handleAddToCart} />
      
      {/* Admin Toggle Button */}
      <button 
        onClick={() => setShowPasswordPrompt(true)}
        className="fixed bottom-6 right-6 p-3 bg-white/80 backdrop-blur border border-gray-200 text-gray-400 hover:text-dhaani-brown rounded-full shadow-md hover:shadow-lg transition-all z-40 group"
        aria-label="Open Admin Panel"
      >
        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="font-serif text-2xl font-bold text-dhaani-brown mb-2">Admin Access</h3>
              <p className="text-sm text-gray-500 mb-6 font-sans">Please enter the password to access the dashboard.</p>
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder="Password"
                    autoFocus
                    className={`w-full px-4 py-3 rounded-lg border ${passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-dhaani-green'} focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white transition-colors`}
                  />
                  {passwordError && <p className="text-red-500 text-xs mt-2">Incorrect password.</p>}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPasswordInput('');
                      setPasswordError(false);
                    }}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-dhaani-green hover:bg-opacity-90 text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                  >
                    Enter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel 
          products={products} 
          analytics={analytics} 
          onClose={() => setIsAdminOpen(false)} 
          onSaveProducts={handleSaveProducts}
          onResetAnalytics={handleResetAnalytics}
        />
      )}
    </div>
  );
}
