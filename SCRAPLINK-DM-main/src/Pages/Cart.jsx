import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ShopContext } from "../Context/ShopContext";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../Components/CartTotal";

function Cart({ cartItems: propCartItems = [] }) {
  const navigate = useNavigate();
  const { currency, cartItems, updateQuantity, addOrder } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  useEffect(() => {
    const updateCartData = async () => {
      let tempData = [];
      const tempProductDetails = {};

      for (const item of cartItems) {
        const { id, size, quantity } = item;
        if (quantity > 0) {
          tempData.push({
            _id: id,
            size: size,
            quantity: quantity,
          });

          if (!tempProductDetails[id]) {
            const productInfo = await fetchProductDetails(id);
            if (productInfo) {
              tempProductDetails[id] = productInfo;
            }
          }
        }
      }

      setCartData(tempData);
      setProductDetails(tempProductDetails);
    };

    updateCartData();
  }, [cartItems]);

  return (
    <div className="pt-14 border-t">
      <div className="mb-3 text-2xl">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {(cartData || []).map((item, index) => {
          const productsData = productDetails[item._id];
          if (!productsData) {
            console.warn();
            return (
              <div key={index} className="py-3 border-b border-t text-gray-700">
                
              </div>
            );
          }

          return (
            <div
              key={index}
              className="py-3 border-b border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img src={productsData.image} alt={productsData.name} className="w-16 sm:w-20" />
                <div>
                  <p className="text-sm sm:text-lg font-medium">{productsData.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>{currency}{productsData.price}</p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    updateQuantity(item._id, item.size, value);
                  }
                }}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                alt="Delete"
                className="w-4 mr-4 sm:w-5 cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => {
                addOrder();
                navigate("/Blogin");
              }}
              className="my-8 px-8 py-3 bg-black text-white text-sm"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Cart Items</h2>
        <div className="space-y-4">
          {(propCartItems || []).map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">${item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cart;
