import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { items, totalPrice, clear } = useCart();

  const [shippingAddress, setShippingAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!shippingAddress.trim()) {
      setError("Shipping address is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/orders", {
        shippingAddress: shippingAddress.trim(),
        items: items.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
      });
      setPlacedOrder(res.data);
      clear();
    } catch (err) {
      const message = err.response?.data?.message || "Could not place your order. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Order placed!</h1>
        <p className="mb-6 text-gray-600">
          Order #{placedOrder.orderId} — total ${Number(placedOrder.totalAmount).toFixed(2)}. A
          confirmation has been recorded to your account.
        </p>

        <div className="mb-8 space-y-2 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
          {placedOrder.items.map((item) => (
            <div key={item.bookId} className="flex justify-between text-sm">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium">${Number(item.lineTotal).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <Link
            to="/catalogue"
            className="rounded-md bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="rounded-md border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Order History
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <Link
          to="/catalogue"
          className="inline-block rounded-md bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mb-6 space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {items.map((item) => (
          <div key={item.bookId} className="flex justify-between text-sm text-gray-700">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <div>
          <label htmlFor="shippingAddress" className="mb-1 block text-sm font-medium text-gray-700">
            Shipping Address
          </label>
          <textarea
            id="shippingAddress"
            required
            rows={3}
            maxLength={200}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Placing order..." : `Place Order — $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
