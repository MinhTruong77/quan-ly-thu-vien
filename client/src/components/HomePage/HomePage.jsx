import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookOutlined } from '@ant-design/icons';
import CardBody from '../CardBody/CardBody';
import { useStore } from '../../hooks/useStore';
import { requestGetCategoryById, requestGetProducts } from '../../config/request';
import logoShop from '../../assets/images/logoshop.svg';

function HomePage() {
    const { category } = useStore();
    const [styledCategories, setStyledCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        if (category.length > 0) {
            setStyledCategories(category);
        }
    }, [category]);

    const fetchProducts = async () => {
        const res = await requestGetProducts();
        setProducts(res.metadata);
        setFilteredProducts(res.metadata);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchCategoryById = async (id) => {
        const res = await requestGetCategoryById(id);
        setProducts(res.metadata.products);
        setFilteredProducts(res.metadata.products);
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryById(selectedCategory);
        } else {
            fetchProducts();
        }
    }, [selectedCategory]);

    useEffect(() => {
        let result = [...products];

        result = result.filter(
            (product) =>
                product.price >= priceFilter.min &&
                product.price <= priceFilter.max
        );

        if (sortOrder === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(result);
    }, [products, priceFilter, sortOrder]);

    const handlePriceFilterChange = (type, value) => {
        setPriceFilter((prev) => ({
            ...prev,
            [type]: value === '' ? (type === 'min' ? 0 : Infinity) : Number(value),
        }));
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    return (
        <div className="w-[95%] mx-auto grid grid-cols-12 gap-6 py-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3">
                <div className="sticky top-6 space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div
                            className="cursor-pointer"
                            onClick={() => setSelectedCategory(null)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={logoShop}
                                    alt="logo shop"
                                    className="h-12 w-auto"
                                />
                                <div>
                                    <h3 className="text-lg font-bold">
                                        Danh mục sách
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {styledCategories.map((cat) => (
                                <div
                                    key={cat._id}
                                    className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                                    onClick={() =>
                                        setSelectedCategory(cat._id)
                                    }
                                >
                                    {cat.nameCategory}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="col-span-12 lg:col-span-9">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            {selectedCategory
                                ? 'Sản phẩm theo danh mục'
                                : 'Tất cả sản phẩm'}
                        </h2>

                        <select
                            onChange={handleSortChange}
                            value={sortOrder}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">Sắp xếp theo</option>
                            <option value="price-asc">Giá thấp đến cao</option>
                            <option value="price-desc">Giá cao đến thấp</option>
                        </select>
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                >
                                    {/* 🔥 FIX Ở ĐÂY */}
                                    <CardBody product={product} />
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                Không tìm thấy sản phẩm
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;