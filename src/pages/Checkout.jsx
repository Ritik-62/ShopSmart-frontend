import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await api.get('/cart');
            if (data.length === 0) {
                navigate('/cart');
                return;
            }
            setCartItems(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            await api.post('/orders', {});
            alert('Order placed successfully!');
            navigate('/orders'); // Or some success page
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        }
    };

    const total = cartItems.reduce(
        (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
        0
    );

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <ul className="divide-y divide-gray-200 mb-6">
                    {cartItems.map((item) => (
                        <li key={item.id} className="py-4 flex justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">
                                ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                        <p>Total</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}
