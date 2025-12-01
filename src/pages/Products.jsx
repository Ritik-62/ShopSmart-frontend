import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [search, category, sort, page]);

    const fetchProducts = async () => {
        try {
            const queryParams = new URLSearchParams({
                page,
                limit: 8,
                ...(search && { search }),
                ...(category && { category }),
                ...(sort && { sort }),
            });

            const data = await api.get(`/products?${queryParams}`);
            setProducts(data.products);
            setTotalPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex space-x-4">
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home">Home</option>
                    </select>
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sort By</option>
                        <option value="price,asc">Price: Low to High</option>
                        <option value="price,desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {products.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No products found.
                        </div>
                    )}
                    <div className="mt-8 flex justify-center space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 border rounded-md bg-gray-50">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
