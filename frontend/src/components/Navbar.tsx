import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-gray-800">🍎 AppleStore</Link>
      <div className="space-x-6">
        <Link to="/products" className="text-gray-600 hover:text-black">Products</Link>
        {user?.role === 'ADMIN' && <Link to="/admin" className="text-gray-600 hover:text-black">Admin</Link>}
        {user ? (
          <>
            <span className="text-gray-600">Hello, {user.email}</span>
            <button onClick={logout} className="text-red-500">Logout</button>
          </>
        ) : (
          <Link to="/login" className="text-blue-600">Login</Link>
        )}
      </div>
    </nav>
  );
}