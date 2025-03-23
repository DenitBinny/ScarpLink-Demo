import React from 'react';

function CartTotal({ subtotal = 0 }) {
  // Calculate the platform fee (10% of subtotal)
  const platformFee = subtotal * 0.10;

  // Calculate the final total amount
  const total = subtotal + platformFee;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Cart Summary</h2>
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
      </div>
    </div>
  );
}

export default CartTotal;
