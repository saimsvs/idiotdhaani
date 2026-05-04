import { useState, useRef } from 'react';
import { Product, Analytics } from '../types';
import { X, Upload, Save, RefreshCw, BarChart3, Edit3 } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  analytics: Analytics;
  onClose: () => void;
  onSaveProducts: (products: Product[]) => void;
  onResetAnalytics: () => void;
}

export function AdminPanel({ products, analytics, onClose, onSaveProducts, onResetAnalytics }: AdminPanelProps) {
  const [editingProducts, setEditingProducts] = useState<Product[]>(JSON.parse(JSON.stringify(products)));
  const [showAnalytics, setShowAnalytics] = useState(true);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleProductChange = (id: string, field: keyof Product, value: string | number) => {
    setEditingProducts(prev => 
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleProductChange(id, 'imageBase64', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveProducts(editingProducts);
    alert('Changes saved successfully!');
  };

  const maxClicks = Math.max(...Object.values(analytics.cartClicks), 1);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full sm:max-w-[340px] h-full shadow-2xl flex flex-col font-sans overflow-hidden animate-in slide-in-from-right duration-300 border-l border-[#E5E1D8]">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-serif italic text-2xl text-dhaani-green">Dhaani Hub</h2>
            <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin Mode</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          
          {/* Analytics Section */}
          <div className="mb-8">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Analytics Dashboard</h4>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
              <div className="text-xs opacity-60">Total Visitors</div>
              <div className="text-2xl font-bold text-dhaani-green">{analytics.visitors}</div>
            </div>

            <div className="space-y-2 mb-4">
              {products.map(p => {
                const clicks = analytics.cartClicks[p.id] || 0;
                return (
                  <div key={`stat-${p.id}`} className="flex justify-between items-center text-[11px]">
                    <span className="truncate mr-2 text-gray-600">{p.name}</span>
                    <span className="font-bold text-gray-800">{clicks} clicks</span>
                  </div>
                )
              })}
            </div>
            
            <button 
              onClick={() => {
                if(confirm('Are you sure you want to reset all analytics?')) onResetAnalytics();
              }}
              className="w-full border border-gray-200 text-gray-500 text-[10px] py-1.5 rounded uppercase font-bold tracking-tighter hover:bg-gray-50 transition-colors"
            >
              Reset Stats
            </button>
          </div>

          {/* Products Section */}
          <div className="flex-grow flex flex-col">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Edit</h4>
            <div className="space-y-6">
              {editingProducts.map(product => (
                <div key={product.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-gray-600 block mb-1">Product Image</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative group">
                        {product.imageBase64 ? (
                          <img src={product.imageBase64} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-dhaani-green/20" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload size={12} className="text-white" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          ref={el => fileInputRefs.current[product.id] = el}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleImageUpload(product.id, e)}
                        />
                      </div>
                      <button 
                        onClick={() => fileInputRefs.current[product.id]?.click()}
                        className="text-[10px] text-gray-500 hover:text-dhaani-green"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600">Product Name</label>
                      <input 
                        type="text" 
                        value={product.name}
                        onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                        className="w-full border border-[#D1CDC4] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-dhaani-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600">Price</label>
                      <input 
                        type="number" 
                        value={product.price}
                        onChange={(e) => handleProductChange(product.id, 'price', Number(e.target.value))}
                        className="w-full border border-[#D1CDC4] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-dhaani-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600">Short Description</label>
                      <textarea 
                        value={product.description}
                        onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full border border-[#D1CDC4] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-dhaani-green resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleSave}
              className="w-full mt-6 bg-dhaani-brown text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-opacity"
            >
              Save Live Changes
            </button>
            <div className="mt-4 pt-4 border-t border-gray-100 text-[9px] text-center opacity-40">
              Dhaani Snack Shop v1.2 &copy; 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
