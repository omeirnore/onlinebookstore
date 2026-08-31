import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import BookCover from "../components/BookCover.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get("/orders")
      .then((res) => {
        if (!cancelled) setOrders(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load your order history right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-gray-500">Loading your orders...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">No orders yet</h1>
        <p className="mb-6 text-gray-600">Your past orders will show up here once you check out.</p>
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.orderId} className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
              <div>
                <p className="font-semibold text-gray-900">Order #{order.orderId}</p>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {order.status}
                </span>
                <span className="text-lg font-bold text-brand-700">
                  ${Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.bookId} className="flex items-center gap-3 px-4 py-3">
                  <BookCover
                    src={item.coverUrl}
                    alt={`Cover of ${item.title}`}
                    className="h-16 w-11 flex-shrink-0 rounded object-cover"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/books/${item.bookId}`}
                      className="text-sm font-medium text-gray-900 hover:text-brand-700"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${Number(item.lineTotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
              Shipped to: {order.shippingAddress}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
