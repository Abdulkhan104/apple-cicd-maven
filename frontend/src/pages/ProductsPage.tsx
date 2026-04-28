import { useEffect, useState } from 'react';
import axios from 'axios';
import Product3DViewer from '../components/Product3DViewer';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);

  const handlePurchase = async (productId: number) => {
    if (!token) {
      alert('Please login to purchase');
      return;
    }
    await axios.post(`/api/products/${productId}/purchase`);
    alert('Purchased!');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105">
              <Product3DViewer modelUrl={product.modelUrl} />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  <button
                    onClick={() => handlePurchase(product.id)}
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}