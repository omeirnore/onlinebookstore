import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import BookCover from "../components/BookCover.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mb-6 text-gray-600">Browse the catalogue and add a few books you like.</p>
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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.bookId}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <BookCover
              src={item.coverUrl}
              alt={`Cover of ${item.title}`}
              className="h-24 w-16 flex-shrink-0 rounded object-cover"
            />

            <div className="flex-1">
              <Link
                to={`/books/${item.bookId}`}
                className="font-semibold text-gray-900 hover:text-brand-700"
              >
                {item.title}
              </Link>
              <p className="text-sm text-gray-500">{item.author}</p>
              <p className="mt-1 font-semibold text-brand-700">${Number(item.price).toFixed(2)}</p>
            </div>

            <select
              aria-label={`Quantity for ${item.title}`}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.bookId, Number(e.target.value))}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              {Array.from({ length: Math.min(item.stockQty ?? 10, 10) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <span className="w-20 text-right font-semibold text-gray-900">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </span>

            <button
              onClick={() => removeItem(item.bookId)}
              aria-label={`Remove ${item.title} from cart`}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-3 border-t border-gray-200 pt-6">
        <p className="text-lg font-bold text-gray-900">Total: ${totalPrice.toFixed(2)}</p>
        <div className="flex gap-3">
          <Link
            to="/catalogue"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => navigate("/checkout")}
            className="rounded-md bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
