import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import BookCard from "../components/BookCard.jsx";
import BookCardSkeleton from "../components/BookCardSkeleton.jsx";
import CategoryCard from "../components/CategoryCard.jsx";

const CATEGORIES = ["Fiction", "Non-Fiction", "Science", "History", "Fantasy", "Biography"];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/books/featured")
      .then((res) => {
        if (!cancelled) setFeatured(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load featured books right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Find your next favorite book</h1>
          <p className="mt-4 text-lg text-brand-100">
            Thousands of titles across fiction, science, history, and more — curated for
            readers who want more than a bestseller list.
          </p>
          <Link
            to="/catalogue"
            className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-semibold text-brand-800 shadow hover:bg-brand-50"
          >
            Browse Books
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured Books</h2>

        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <BookCardSkeleton key={i} />)
            : featured.length > 0
              ? featured.map((book) => <BookCard key={book.bookId} book={book} />)
              : !error && <p className="text-gray-500">No featured books yet.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((name) => (
            <CategoryCard key={name} name={name} />
          ))}
        </div>
      </section>
    </div>
  );
}
