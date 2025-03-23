import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { scrapauth } from './firebase';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import {
  LayoutGrid,
  BarChart3,
  Filter,
  Mail,
  Package,
  ClipboardList,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import axios from 'axios';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: 'Scrap Metal',
    subcategory: 'Reusable',
    size: 'F',
    date: ''
  });
  const [activeTab, setActiveTab] = useState('dashboard'); // State to manage active tab

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products', { headers: { authorization: localStorage.getItem('userId') } });
        const updatedProducts = response.data.map(product => ({
          ...product,
          image: [product.image] // Wrap the image in an array
        }));
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(scrapauth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProducts();
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(scrapauth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting product:", productData);

    try {
      if (!productData.image) {
        alert("Please select a valid image before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("file", productData.image);
      formData.append("upload_preset", "scraplink_preset");

      console.log("Uploading image to Cloudinary...");

      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dydcjhylt/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        }
      );

      const imageUrl = uploadResponse.data.secure_url;
      if (!imageUrl) {
        throw new Error("Image upload failed. No URL returned.");
      }
      console.log("Image uploaded successfully:", imageUrl);

      const productPayload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        subcategory: productData.subcategory,
        size: productData.size,
        date: productData.date,
        image: imageUrl,
      };

      const productResponse = await axios.post("http://localhost:5000/products", productPayload, { headers: { authorization: localStorage.getItem('userId') } });
      console.log("Product added successfully:", productResponse.data);

      setProductData({
        name: "",
        description: "",
        price: "",
        image: null,
        category: "Scrap Metal",
        subcategory: "Reusable",
        size: "F",
        date: "",
      });
      setShowProductForm(false);
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    console.log(`Attempting to delete product with ID: ${productId}`);
    try {
      const response = await axios.delete(`http://localhost:5000/products/${productId}`);
      console.log('Delete response:', response);
      if (response.status === 200) {
        setProducts(products.filter(product => product._id !== productId));
        console.log('Product deleted successfully');
      } else {
        console.error('Failed to delete product:', response);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <img
                src="https://via.placeholder.com/50"
                alt="Cymil"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">Geo george</h3>
                <p className="text-gray-600">Hi, i liked the product.....</p>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-sm"><span className="font-medium">Price:</span> ${product.price}</p>
                <p className="text-sm"><span className="font-medium">Status:</span> {Math.random() > 0.5 ? 'Delivered' : 'Pending'}</p>
              </div>
            ))}
          </div>
        );
      case 'dealers':
        return (
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Dealers</h2>
            <ul className="space-y-4">
              {['Denit D Binny', 'Blessy Mariam', 'Geo George', 'Cymil Sara'].map((dealer, index) => (
                <li key={index} className="flex items-center gap-4">
                  <img
                    src={`https://via.placeholder.com/50?text=${dealer.split(' ')[0]}`}
                    alt={dealer}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="text-lg font-medium">{dealer}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.displayName || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm"><span className="font-medium">Category:</span> {product.category}</p>
                  <p className="text-sm"><span className="font-medium">Subcategory:</span> {product.subcategory}</p>
                  <p className="text-sm"><span className="font-medium">Size:</span> {product.size}</p>
                  <p className="text-sm"><span className="font-medium">Date Added:</span> {new Date(product.date).toLocaleDateString()}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setProductData(product);
                        setShowProductForm(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C1C1C] text-white flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <div className="mb-8">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">@</span>ScrapLink
              </h1>
            </div>
            <nav className="space-y-2">
              <div className="mb-4">
                <div
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutGrid size={20} />
                  <span>Dashboard</span>
                </div>
                <div className="ml-4 space-y-1">
                  <div
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                    onClick={() => setActiveTab('summary')}
                  >
                    <BarChart3 size={20} />
                    <span>Summary</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                    onClick={() => setActiveTab('custom')}
                  >
                    <Filter size={20} />
                    <span>Custom dashboard</span>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => setActiveTab('messages')}
              >
                <Mail size={20} />
                <span>Messages</span>
                <span className="ml-auto bg-gray-700 px-2 rounded-full text-sm">2</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => setShowProductForm(true)}
              >
                <Package size={20} />
                <span>Products</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => setActiveTab('orders')}
              >
                <ClipboardList size={20} />
                <span>Orders</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => setActiveTab('dealers')}
              >
                <Users size={20} />
                <span>Dealers</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} />
                <span>Settings</span>
              </div>
            </nav>
          </div>
          <div className="mt-auto p-4 space-y-2">
            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer">
              <HelpCircle size={20} />
              <span>Help</span>
            </div>
            <div
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Log out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6">
        {renderContent()}
      </main>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg relative overflow-y-auto max-h-[80vh]">
            <button
              onClick={() => setShowProductForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Product Details</h2>
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductData(prev => ({ ...prev, image: e.target.files[0] }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={['Scrap Metal', 'Wooden Scraps', 'Electronics', 'Other'].indexOf(productData.category)}
                  onChange={(e) => setProductData(prev => ({
                    ...prev,
                    category: ['Scrap Metal', 'Wooden Scraps', 'Electronics', 'Other'][e.target.value]
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>Scrap Metal</span>
                  <span>Wooden Scraps</span>
                  <span>Electronics</span>
                  <span>Other</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={['Reusable', 'Non-Reusable', 'Eco-Friendly'].indexOf(productData.subcategory)}
                  onChange={(e) => setProductData(prev => ({
                    ...prev,
                    subcategory: ['Reusable', 'Non-Reusable', 'Eco-Friendly'][e.target.value]
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>Reusable</span>
                  <span>Non-Reusable</span>
                  <span>Eco-Friendly</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={['F', 'H', 'R'].indexOf(productData.size)}
                  onChange={(e) => setProductData(prev => ({
                    ...prev,
                    size: ['F', 'H', 'R'][e.target.value]
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>F</span>
                  <span>H</span>
                  <span>R</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={productData.date}
                  onChange={(e) => setProductData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;