import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Pagination and sorting for orders
    const [orderPage, setOrderPage] = useState(1);
    const [orderTotalPages, setOrderTotalPages] = useState(1);
    const [orderSort, setOrderSort] = useState('createdAt,desc');

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: '',
    });

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState(null);
    const [editProduct, setEditProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: '',
    });

    // Check if user is admin or superadmin
    useEffect(() => {
        if (user && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchData();
    }, [activeTab, orderPage, orderSort]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            if (activeTab === 'orders') {
                const queryParams = new URLSearchParams({
                    page: orderPage,
                    limit: 10,
                    sort: orderSort,
                });
                const data = await api.get(`/orders/admin?${queryParams}`);
                // Handle both array and object response
                setOrders(data.orders || data);
                setOrderTotalPages(data.pages || 1);
            } else {
                const data = await api.get('/products?limit=100');
                setProducts(data.products || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message || 'Failed to fetch data');
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
            });
            alert('Product created successfully!');
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                imageUrl: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            alert('Product deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product: ' + (error.message || 'Unknown error'));
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product.id);
        setEditProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            imageUrl: product.imageUrl || '',
        });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editingProduct}`, {
                ...editProduct,
                price: parseFloat(editProduct.price),
                stock: parseInt(editProduct.stock),
            });
            alert('Product updated successfully!');
            setEditingProduct(null);
            setEditProduct({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                imageUrl: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product: ' + (error.message || 'Unknown error'));
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            alert('Order status updated successfully!');
            fetchData();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status: ' + (error.message || 'Unknown error'));
        }
    };

    if (loading && orders.length === 0 && products.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex space-x-4 mb-8">
                <button
                    className={`px-4 py-2 rounded-md ${activeTab === 'orders'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${activeTab === 'products'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
            </div>

            {activeTab === 'orders' ? (
                <div>
                    {/* Sorting Controls */}
                    <div className="mb-4 flex justify-end">
                        <select
                            value={orderSort}
                            onChange={(e) => {
                                setOrderSort(e.target.value);
                                setOrderPage(1); // Reset to first page when sorting changes
                            }}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="createdAt,desc">Newest First</option>
                            <option value="createdAt,asc">Oldest First</option>
                            <option value="totalAmount,desc">Highest Amount</option>
                            <option value="totalAmount,asc">Lowest Amount</option>
                        </select>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No orders found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.user?.email || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${parseFloat(order.totalAmount).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'COMPLETED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'CANCELLED'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            handleUpdateOrderStatus(order.id, e.target.value)
                                                        }
                                                        className="border rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value="PENDING">PENDING</option>
                                                        <option value="COMPLETED">COMPLETED</option>
                                                        <option value="CANCELLED">CANCELLED</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {orders.length > 0 && (
                        <div className="mt-4 flex justify-center space-x-2">
                            <button
                                disabled={orderPage === 1}
                                onClick={() => setOrderPage(orderPage - 1)}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 border rounded-md bg-gray-50">
                                Page {orderPage} of {orderTotalPages}
                            </span>
                            <button
                                disabled={orderPage === orderTotalPages}
                                onClick={() => setOrderPage(orderPage + 1)}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    className="px-4 py-2 border rounded-md w-full"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, name: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    className="px-4 py-2 border rounded-md w-full"
                                    value={newProduct.category}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, category: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    className="px-4 py-2 border rounded-md w-full"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, price: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    className="px-4 py-2 border rounded-md w-full"
                                    value={newProduct.stock}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, stock: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    className="px-4 py-2 border rounded-md w-full md:col-span-2"
                                    value={newProduct.imageUrl}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, imageUrl: e.target.value })
                                    }
                                />
                                <textarea
                                    placeholder="Description"
                                    className="px-4 py-2 border rounded-md w-full md:col-span-2"
                                    rows="3"
                                    value={newProduct.description}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Add Product
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {products.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No products found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.stock}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Edit Product Modal */}
                    {editingProduct && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
                                <form onSubmit={handleUpdateProduct} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            value={editProduct.name}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, name: e.target.value })
                                            }
                                            className="border rounded px-3 py-2"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Category"
                                            value={editProduct.category}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, category: e.target.value })
                                            }
                                            className="border rounded px-3 py-2"
                                            required
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price"
                                            value={editProduct.price}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, price: e.target.value })
                                            }
                                            className="border rounded px-3 py-2"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={editProduct.stock}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, stock: e.target.value })
                                            }
                                            className="border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="Image URL"
                                        value={editProduct.imageUrl}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, imageUrl: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={editProduct.description}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, description: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2"
                                        rows="3"
                                        required
                                    />
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Update Product
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingProduct(null)}
                                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
