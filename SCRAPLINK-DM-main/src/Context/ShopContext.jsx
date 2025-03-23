import PropTypes from "prop-types";
import React, { createContext, useState } from 'react';
import { products1 } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return storedCartItems;
  });
  const [orders, setOrders] = useState([]); // New state to hold orders
  const navigate = useNavigate(); // to navigate to different pages

  const addToCart = (productId, size) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId && item.size === size);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem = { id: productId, size, quantity: 1 };
        prevItems.push(newItem);
      }

      localStorage.setItem('cartItems', JSON.stringify(prevItems));
      return [...prevItems];
    });
  };

  const addOrder = () => {
    let tempOrders = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrders, ...newOrder]);
    //setCartItems({}); // Clear cart after placing the order
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          totalCount += cartItems[item][size];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = (productId, size, quantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems
        .map(item => {
          if (item.id === productId && item.size === size) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0);

      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const productInfo = products1.find((product) => product._id === item); // Use products1 instead of products
      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0) {
            totalAmount += productInfo.price * cartItems[item][size];
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    }
    return totalAmount;
  };

  const value = {
    products: products1,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    addOrder, // Add this to allow placing orders
    orders,
    navigate,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ShopProvider;
