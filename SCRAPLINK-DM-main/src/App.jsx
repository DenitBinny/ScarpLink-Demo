import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Llogin from "./pages/Llogin";
import PlaceOrder from "./pages/PlaceOrder";
import Final from "./pages/Final";
import Orders from "./pages/Orders";
import Admin  from "./pages/Admin";
import Navbar from "./Components/Navbar";
import Sellerdash from './Pages/Sellerdash';
import ProductDetail from './Pages/ProductDetail'; // Correct import path and casing
import Blogin from './Pages/Blogin';
import Footer from "./Components/Footer";
import SearchBar from "./Components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

console.log(toast);

function App() {
  return (
    <div className=" ">
      <ToastContainer />

      <Navbar />
      <SearchBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} /> {/* Redirect /home to / */}
        <Route path="/collection" element={<Collection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/llogin" element={<Llogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sellerdash" element={<Sellerdash />} />
        <Route path="/Blogin" element={<Blogin />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Final" element={<Final />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/productdetail/:id" element={<ProductDetail />} /> {/* Correct route */}
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
