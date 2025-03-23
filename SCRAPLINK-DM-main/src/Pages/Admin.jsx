import React, { useState, useEffect } from 'react';
import { 
  Recycle, 
  Lock, 
  User, 
  BarChart3, 
  Package, 
  Users, 
  Truck, 
  Settings,
  LogOut,
  Search,
  Bell,
  TrendingUp,
  Scale,
  DollarSign,
  Calendar,
  Plus,
  Minus,
  Save,
  AlertCircle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMkJwvNisr2OTLfg619o245QPQYZ4jqtA",
  authDomain: "scrapauth.firebaseapp.com",
  projectId: "scrapauth",
  storageBucket: "scrapauth.appspot.com",
  messagingSenderId: "195227893076",
  appId: "1:195227893076:web:3b9b4e268eaaf34c0a9cc1"
};

const app = initializeApp(firebaseConfig);
const scrapauth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pickupCount, setPickupCount] = useState(0);
  const [adminCredentials, setAdminCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [newCredentials, setNewCredentials] = useState({
    username: '',
    password: ''
  });
  const [credentialUpdateSuccess, setCredentialUpdateSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(scrapauth, email, password);
      const user = userCredential.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
      });
      setUsers([...users, { id: user.uid, email: user.email }]);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await deleteDoc(userDoc);
      const user = scrapauth.currentUser;
      await deleteUser(user);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setActiveTab('dashboard');
  };

  const handleCredentialUpdate = (e) => {
    e.preventDefault();
    if (newCredentials.username && newCredentials.password) {
      setAdminCredentials({
        username: newCredentials.username,
        password: newCredentials.password
      });
      setCredentialUpdateSuccess(true);
      setTimeout(() => setCredentialUpdateSuccess(false), 3000);
      setNewCredentials({ username: '', password: '' });
    }
  };

  const newsItems = [
    {
      title: "India's Largest E-Waste Recycling Facility Opens in Bangalore",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
      description: "A state-of-the-art facility capable of processing 100,000 tonnes of e-waste annually has been inaugurated, marking a significant step towards sustainable waste management."
    },
    {
      title: "Mumbai Achieves 90% Metal Scrap Recycling Rate",
      date: "March 12, 2024",
      image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800",
      description: "The city's innovative scrap collection program has resulted in record-breaking recycling rates, setting a new benchmark for urban waste management."
    },
    {
      title: "Green Initiative: Delhi Converts Industrial Scrap into Public Art",
      date: "March 10, 2024",
      image: "https://images.unsplash.com/photo-1518792528501-352f829886dc?w=800",
      description: "Local artists collaborate with scrap dealers to transform industrial waste into stunning public installations, promoting sustainability through art."
    }
  ];

  const scrapInventory = [
    {
      category: "Metal Scrap",
      items: [
        { name: "Copper Wire", quantity: "1,200 kg", value: "₹600,000" },
        { name: "Aluminum Sheets", quantity: "800 kg", value: "₹160,000" },
        { name: "Steel Components", quantity: "2,500 kg", value: "₹375,000" }
      ]
    },
    {
      category: "E-Waste",
      items: [
        { name: "Circuit Boards", quantity: "300 kg", value: "₹450,000" },
        { name: "Computer Parts", quantity: "500 kg", value: "₹250,000" },
        { name: "Mobile Devices", quantity: "150 kg", value: "₹300,000" }
      ]
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-emerald-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">ScrapLink</h2>
            <p className="text-emerald-100 mt-2">Admin Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-100 transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <div className="space-y-8">
            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scrapInventory.map((category) => (
                <div key={category.category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{category.category}</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {category.items.map((item) => (
                      <div key={item.name} className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <span className="text-emerald-600 font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* News Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Latest Sustainability News</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {newsItems.map((news) => (
                  <div key={news.title} className="group">
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-emerald-600 font-medium">{news.date}</span>
                      <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600">{news.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pickups':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Pickup Counter</h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center space-y-6">
              <div className="text-6xl font-bold text-emerald-600">{pickupCount}</div>
              <div className="flex gap-4">
                <button
                  onClick={() => setPickupCount(prev => prev + 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Increment
                </button>
                <button
                  onClick={() => setPickupCount(prev => Math.max(0, prev - 1))}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                  Decrement
                </button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Admin Credentials</h2>
              </div>
              <form onSubmit={handleCredentialUpdate} className="p-6 space-y-6">
                {credentialUpdateSuccess && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Credentials updated successfully!
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
                      New Username
                    </label>
                    <input
                      id="newUsername"
                      type="text"
                      value={newCredentials.username}
                      onChange={(e) => setNewCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newCredentials.password}
                      onChange={(e) => setNewCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Update Credentials
                </button>
              </form>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        );

      case 'customers':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Admin - User Management</h2>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded mr-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded mr-2"
              />
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add User
              </button>
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">Email</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { icon: Scale, label: 'Total Scrap', value: '2,547 kg', trend: '+12.5%' },
                { icon: DollarSign, label: 'Revenue', value: '₹12,847', trend: '+8.2%' },
                { icon: Users, label: 'Active Customers', value: '847', trend: '+4.3%' },
                { icon: Calendar, label: 'Pending Pickups', value: '24', trend: '-2.1%' },
              ].map(({ icon: Icon, label, value, trend }) => (
                <div key={label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600">{trend}</span>
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm">{label}</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { title: 'New pickup scheduled', time: '2 minutes ago', status: 'Pending' },
                  { title: 'Payment received from John Doe', time: '1 hour ago', status: 'Completed' },
                  { title: 'New customer registration', time: '3 hours ago', status: 'Completed' },
                  { title: 'Inventory update', time: '5 hours ago', status: 'Completed' },
                ].map(({ title, time, status }) => (
                  <div key={title} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Recycle className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="font-bold text-gray-800">ScrapLink</h2>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: BarChart3, label: 'Dashboard', value: 'dashboard' },
            { icon: Package, label: 'Inventory', value: 'inventory' },
            { icon: Users, label: 'Users', value: 'customers' },
            { icon: Truck, label: 'Pickups', value: 'pickups' },
            { icon: Settings, label: 'Settings', value: 'settings' },
          ].map(({ icon: Icon, label, value }) => (
            <button
              key={label}
              onClick={() => setActiveTab(value)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition-colors ${
                activeTab === value
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;