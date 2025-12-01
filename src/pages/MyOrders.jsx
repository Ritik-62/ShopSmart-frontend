import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams({
                page,
                limit: 10,
                sort: 'createdAt,desc',
            });
            const data = await api.get(`/orders?${queryParams}`);
            // Handle both array and object response
            setOrders(data.orders || data);
            setTotalPages(data.pages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message || 'Failed to fetch orders');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You have no orders yet.</p>
                    <a href="/products" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                        Start Shopping
                    </a>
                </div>
            ) : (
                <>
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Order placed{' '}
                                            <span className="font-medium text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-medium text-gray-900">
                                            Total: ${parseFloat(order.totalAmount).toFixed(2)}
                                        </p>
                                        <span
                                            className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'CANCELLED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {order.items?.map((item) => (
                                        <li key={item.id} className="p-6 flex items-center">
                                            <img
                                                src={item.product?.imageUrl || 'https://via.placeholder.com/100'}
                                                alt={item.product?.name || 'Product'}
                                                className="h-16 w-16 object-cover rounded-md"
                                            />
                                            <div className="ml-6">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.product?.name || 'Unknown Product'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 border rounded-md bg-gray-50">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
