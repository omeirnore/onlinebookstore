import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";
import BookCover from "../components/BookCover.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function BookDetail() {
  const { id } = useParams();
  const { items, addItem } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get(`/books/${id}`)
      .then((res) => {
        if (!cancelled) setBook(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Book not found.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-gray-500">Loading...</div>;
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-red-600">{error}</p>
        <Link to="/catalogue" className="mt-4 inline-block text-brand-700 hover:underline">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/catalogue" className="mb-6 inline-block text-sm text-brand-700 hover:underline">
        &larr; Back to Catalogue
      </Link>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr]">
        <BookCover
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-full rounded-lg object-cover shadow"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="mt-1 text-lg text-gray-500">by {book.author}</p>
          {book.categoryName && (
            <span className="mt-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
              {book.categoryName}
            </span>
          )}

          <p className="mt-4 text-amber-500">
            {"★".repeat(Math.round(book.rating))}
            {"☆".repeat(5 - Math.round(book.rating))}
            <span className="ml-2 text-sm text-gray-500">{Number(book.rating).toFixed(1)} / 5</span>
          </p>

          <p className="mt-6 text-3xl font-bold text-brand-700">${Number(book.price).toFixed(2)}</p>
          <p className={`mt-1 text-sm font-medium ${book.inStock ? "text-green-600" : "text-red-500"}`}>
            {book.inStock ? `In Stock (${book.stockQty} available)` : "Out of Stock"}
          </p>

          <p className="mt-6 leading-relaxed text-gray-700">{book.description}</p>

          {book.inStock && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Qty
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {Array.from({ length: Math.min(book.stockQty, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  addItem(book, quantity);
                  setJustAdded(true);
                  setTimeout(() => setJustAdded(false), 2000);
                }}
                className="rounded-md bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
              >
                Add to Cart
              </button>

              {justAdded && (
                <span className="text-sm font-medium text-green-600">Added to cart!</span>
              )}
            </div>
          )}

          {!book.inStock && (
            <button
              disabled
              className="mt-8 cursor-not-allowed rounded-md bg-brand-600 px-6 py-3 font-semibold text-white opacity-50"
            >
              Add to Cart
            </button>
          )}

          {items.some((i) => i.bookId === book.bookId) && (
            <p className="mt-3 text-sm text-gray-500">
              {items.find((i) => i.bookId === book.bookId).quantity} already in your{" "}
              <Link to="/cart" className="font-semibold text-brand-700 hover:underline">
                cart
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
