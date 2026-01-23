import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { products as staticProducts } from '../data/products';
import { FaStar, FaSpinner } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}`); // Assuming generic product fetch
        // Note: In reality, this endpoint should be /api/products/:id, not /api/orders
        // I will assume you have a GET /api/products/:id route.
        const productRes = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (productRes.ok) {
          const data = await productRes.json();
          setProduct(data);
          // Auto-select first option
          if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]); 
        } else {
          throw new Error("DB Fetch failed");
        }
      } catch (error) {
        // Fallback to static data
        const staticItem = staticProducts.find((p) => p.id === parseInt(id) || p.id === id);
        if (staticItem) {
          setProduct(staticItem);
          if (staticItem.colors?.length > 0) setSelectedColor(staticItem.colors[0]);
          if (staticItem.sizes?.length > 0) setSelectedSize(staticItem.sizes[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validation
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size!");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color!");
      return;
    }

    dispatch(addToCart({ 
      ...product, 
      size: selectedSize,
      color: selectedColor 
    })); 
    alert("Item added to cart!");
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl text-gray-400" /></div>;
  if (!product) return <div className="text-center py-20 text-2xl text-gray-500">Product not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Image */}
        <div className="md:w-1/2 flex justify-center bg-gray-50 rounded-xl p-6">
          <img src={product.image} alt={product.name} className="max-h-[600px] w-full object-contain drop-shadow-xl rounded-lg" />
        </div>

        {/* Details */}
        <div className="md:w-1/2">
          <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">{product.category || 'Collection'}</span>
          <h2 className="text-4xl font-black mb-4 text-gray-900 mt-2">{product.name}</h2>
          <p className="text-3xl font-bold text-blue-600 mb-6">₹{product.price}</p>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">{product.description}</p>
          
          {/* --- COLORS SECTION --- */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
                <span className="font-bold text-gray-800 block mb-3">Select Color:</span>
                <div className="flex gap-4">
                    {product.colors.map((c, index) => (
                        <button 
                            key={index}
                            onClick={() => setSelectedColor(c)}
                            // This CSS creates the "Frame" effect
                            className={`w-10 h-10 rounded-full transition-all duration-300 relative flex items-center justify-center 
                                ${selectedColor === c 
                                    ? 'ring-2 ring-offset-4 ring-black scale-110' // Selected: Black ring with white gap (offset)
                                    : 'hover:scale-110 ring-1 ring-transparent' // Not selected
                                }`}
                            style={{ backgroundColor: c }}
                            title={c}
                        >
                          {/* Optional: Checkmark inside if selected for extra clarity */}
                          {selectedColor === c && (
                             <span className="block w-2 h-2 bg-white rounded-full shadow-sm" /> 
                          )}
                        </button>
                    ))}
                </div>
            </div>
          )}

          {/* --- SIZES SECTION --- */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <span className="font-bold text-gray-800 block mb-2">Select Size:</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)}
                    className={`px-6 py-3 border rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === s 
                        ? 'bg-black text-white border-black shadow-lg transform -translate-y-1' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-xl active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;