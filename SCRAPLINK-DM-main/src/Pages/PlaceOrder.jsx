import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import CartTotal from '../Components/CartTotal';
import Title from '../Components/Title';
import { ShopContext } from '../Context/ShopContext';

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtotal = 0, platformFee = 0, total = 0 } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handlePlaceOrder = () => {
    navigate('/final');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* --------------- Left Side ----------------------- */}

      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 ">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex flex-col sm:flex-row  gap-3">
          <input
            type="text"
            placeholder="First Name"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          type="text"
          placeholder="Street"
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex flex-col sm:flex-row  gap-3">
          <input
            type="text"
            placeholder="City"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            placeholder="State"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row  gap-3">
          <input
            type="text"
            placeholder="Zipcode"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            placeholder="Country"
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          type="number"
          placeholder="Phone "
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* --------------- Right Side ----------------------- */}

      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">Place Order</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Subtotal</p>
              <p className="font-medium">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Platform Fee (10%)</p>
              <p className="font-medium">${platformFee.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold">Total</p>
              <p className="font-bold">${total.toFixed(2)}</p>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={handlePlaceOrder}
                className="px-8 py-3 bg-black text-white text-sm rounded-md hover:bg-gray-800"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* -------------- Payment method selection -------------- */}

          <div className="flex flex-col lg:flex-row gap-4">
            <div
              onClick={() => {
                setPaymentMethod('Stripe');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === 'Stripe' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setPaymentMethod('razorpay');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setPaymentMethod('cod');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                {' '}
                CASH ON DELIVERY
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;