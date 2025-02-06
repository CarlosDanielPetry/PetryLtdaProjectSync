import React from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, total, clearCart, removeItem, updateQuantity } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  async function handleCheckout() {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total: total,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Complete Order
          </button>
        </div>
      </div>
    </div>
  );
}
