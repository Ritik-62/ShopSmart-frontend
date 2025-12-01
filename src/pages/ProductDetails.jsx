import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.get(`/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/cart', { productId: product.id, quantity });
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart');
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!product) return <div className="text-center py-12">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-1/2">
                        <img
                            className="h-full w-full object-cover md:h-96"
                            src={product.imageUrl || 'https://via.placeholder.com/600'}
                            alt={product.name}
                        />
                    </div>
                    <div className="p-8 md:w-1/2">
                        <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">
                            {product.category}
                        </div>
                        <h1 className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 sm:text-4xl">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-xl text-gray-500">{product.description}</p>
                        <div className="mt-8">
                            <span className="text-3xl font-bold text-gray-900">
                                ${parseFloat(product.price).toFixed(2)}
                            </span>
                        </div>
                        <div className="mt-8 flex items-center space-x-4">
                            <div className="flex items-center border rounded-md">
                                <button
                                    className="px-3 py-1 border-r hover:bg-gray-50"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1">{quantity}</span>
                                <button
                                    className="px-3 py-1 border-l hover:bg-gray-50"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={addToCart}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
