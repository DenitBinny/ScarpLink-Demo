import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  User, 
  CreditCard, 
  ShoppingBag, 
  ShoppingCart, 
  LogOut,
  Edit2,
  Save,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';

function Sellerdash() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Cymil Sara Easow', 
    email: 'cymilsara@gmail.com', 
    phone: '8956742354',
    address: 'Puthupally , kottayam',
    accountNumber: '**** **** **** 3798',
    upiId: 'cymils@ybl'
  });

  const [payment, setPayment] = useState({
    accountNumber: '',
    upiId: ''
  });

  const [purchases] = useState([
    { id: '1', item: 'Recycled Paper Bundle', date: '2024-03-10', amount: 29.99 },
    { id: '2', item: 'Eco-friendly Packaging', date: '2024-03-08', amount: 45.50 },
  ]);

  const { cartItems, updateQuantity, addOrder } = useContext(ShopContext);
  const [cartDetails, setCartDetails] = useState([]);
  const navigate = useNavigate();

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:5000/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const updateCartDetails = async () => {
    const updatedCartDetails = await Promise.all(
      cartItems.map(async (item) => {
        const productDetails = await fetchProductDetails(item.id);
        return { ...productDetails, quantity: item.quantity, size: item.size };
      })
    );
    setCartDetails(updatedCartDetails);
  };

  useEffect(() => {
    updateCartDetails();
  }, [cartItems]);

  const handleDelete = (productId, size) => {
    updateQuantity(productId, size, 0);
  };

  const handleBuyNow = () => {
    addOrder();
    navigate('/placeorder', { state: { cartDetails, subtotal, platformFee, total } });
  };

  // Calculate the subtotal
  const subtotal = cartDetails.reduce((acc, item) => acc + (item.price ? item.price * item.quantity : 0), 0);

  // Calculate the platform fee (10% of subtotal)
  const platformFee = subtotal * 0.10;

  // Calculate the final total amount
  const total = subtotal + platformFee;

  const sustainabilityNews = [
    {
      title: 'Revolutionary Recycling Process Transforms Metal Waste',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800',
      snippet: 'New technology enables 98% recovery rate in metal recycling...'
    },
    {
      title: 'Global Sustainability Initiative Launches',
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800',
      snippet: 'International cooperation leads to breakthrough in waste management...'
    }
  ];

  const handleProfileEdit = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentEdit = (field, value) => {
    setPayment(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/profile', profile);
      console.log('Profile saved:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const fetchProfile = async () => {
    console.log('Fetching profile...'); // Log when fetching profile

    try {
      const email = profile.email || ''; // Ensure email is defined

      console.log('Fetching profile for email:', email); // Debugging log
      const response = await axios.get(`http://localhost:5000/api/profile/${email}`);

      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchProfile, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleLogout = () => {
    // Clear any necessary user data (e.g., authentication tokens)
    // For example, you might clear localStorage or context state here
    // localStorage.removeItem('authToken');

    // Navigate to the home page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Buyer Dashboard</h2>
        </div>
        <nav className="space-y-2">
          {[
            { icon: <User size={20} />, label: 'Profile', id: 'profile' },
            { icon: <CreditCard size={20} />, label: 'Payment Details', id: 'payment' },
            { icon: <ShoppingBag size={20} />, label: 'Purchases', id: 'purchases' },
            { icon: <ShoppingCart size={20} />, label: 'Cart', id: 'cart' },
            { icon: <LogOut size={20} />, label: 'Logout', id: 'logout', onClick: handleLogout }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  setActiveSection(item.id);
                }
              }}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                activeSection === item.id ? 'bg-white text-black' : 'hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-8">
            {/* Left Section */}
            <div className="flex-1">
              {activeSection === 'profile' && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <button
                      onClick={() => {
                        if (isEditing) saveProfile();
                        setIsEditing(!isEditing);
                      }}
                      className="text-black hover:text-gray-700"
                    >
                      {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
                    </button>
                  </div>
                  {Object.entries(profile).map(([key, value]) => (
                    key !== 'id' && key !== '_v' && (
                      <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {key}
                        </label>
                        {isEditing ? (
                          <input
                            type={key === 'email' ? 'email' : 'text'}
                            value={value}
                            onChange={(e) => handleProfileEdit(key, e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{value}</p>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}

              {activeSection === 'payment' && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={payment.accountNumber}
                        onChange={(e) => handlePaymentEdit('accountNumber', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={payment.upiId}
                        onChange={(e) => handlePaymentEdit('upiId', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'purchases' && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Purchase History</h2>
                  <div className="space-y-4">
                    {purchases.map(purchase => (
                      <div key={purchase.id} className="border-b pb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{purchase.item}</h3>
                            <p className="text-sm text-gray-500">{purchase.date}</p>
                          </div>
                          <p className="font-medium">${purchase.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'cart' && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
                  <div className="space-y-4">
                    {cartDetails.length > 0 ? (
                      cartDetails.map(item => (
                        <div key={`${item.id}-${item.size}`} className="flex justify-between items-center border-b pb-4">
                          <div className="flex items-start gap-6">
                            <img src={item.image} alt={item.name} className="w-16 sm:w-20" />
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <div className="flex items-center gap-5 mt-2">
                                <p>{item.price ? `$${item.price}` : 'N/A'}</p>
                                <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-medium">Quantity: {item.quantity}</p>
                            <button
                              onClick={() => handleDelete(item.id, item.size)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No items in the cart.</p>
                    )}
                    <div className="pt-4 flex justify-between items-center">
                      <p className="font-bold">Subtotal</p>
                      <p className="font-bold">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="pt-4 flex justify-between items-center">
                      <p className="font-bold">Platform Fee (10%)</p>
                      <p className="font-bold">
                        ${platformFee.toFixed(2)}
                      </p>
                    </div>
                    <div className="pt-4 flex justify-between items-center">
                      <p className="font-bold">Total</p>
                      <p className="font-bold">
                        ${total.toFixed(2)}
                      </p>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleBuyNow}
                        className="px-8 py-3 bg-black text-white text-sm rounded-md hover:bg-gray-800"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Sustainability News */}
            <div className="w-80">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-6">Sustainability News</h2>
                <div className="space-y-6">
                  {sustainabilityNews.map((news, index) => (
                    <div key={index} className="space-y-3">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <h3 className="font-medium">{news.title}</h3>
                      <p className="text-sm text-gray-600">{news.snippet}</p>
                      <a
                        href="#"
                        className="text-sm text-black flex items-center hover:underline"
                      >
                        Read more <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sellerdash;
