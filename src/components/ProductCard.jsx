import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                </h3>
                <p className="text-gray-600 mt-1 truncate">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                        ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <Link
                        to={`/products/${product.id}`}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
