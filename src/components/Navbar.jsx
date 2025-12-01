import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            ShopSmart
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/products" className="text-gray-700 hover:text-blue-600">
                            Products
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'ADMIN' ? (
                                    // Admin users only see Admin link
                                    <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    // Regular users see Cart and My Orders
                                    <>
                                        <Link to="/cart" className="text-gray-700 hover:text-blue-600">
                                            Cart
                                        </Link>
                                        <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                                            My Orders
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
