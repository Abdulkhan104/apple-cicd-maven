import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, imageUrl: '', modelUrl: '' });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      axios.get('/api/products').then(res => setProducts(res.data));
    }
  }, [user]);

  const addProduct = async () => {
    await axios.post('/api/admin/products', newProduct);
    setNewProduct({ name: '', description: '', price: 0, imageUrl: '', modelUrl: '' });
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  if (user?.role !== 'ADMIN') return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="border p-2 rounded" />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: +e.target.value})} className="border p-2 rounded" />
          <input placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} className="border p-2 rounded" />
          <input placeholder="3D Model URL (.gltf/.glb)" value={newProduct.modelUrl} onChange={e => setNewProduct({...newProduct, modelUrl: e.target.value})} className="border p-2 rounded" />
        </div>
        <button onClick={addProduct} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">Add Product</button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4">
            <h3 className="font-bold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="text-blue-600">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}