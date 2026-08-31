import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <img
          src={book.coverUrl || "https://placehold.co/280x400?text=No+Cover"}
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

          <button
            disabled={!book.inStock}
            className="mt-8 rounded-md bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
