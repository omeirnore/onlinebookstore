import { Link } from "react-router-dom";

function Stars({ rating = 0 }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5 text-amber-500" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
      <span className="ml-1 text-xs text-gray-500">{Number(rating).toFixed(1)}</span>
    </div>
  );
}

export default function BookCard({ book, view = "grid" }) {
  const isList = view === "list";

  return (
    <div
      className={`flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md ${
        isList ? "flex-row items-stretch" : "flex-col"
      }`}
    >
      <img
        src={book.coverUrl || "https://placehold.co/200x300?text=No+Cover"}
        alt={`Cover of ${book.title}`}
        className={isList ? "h-40 w-28 flex-shrink-0 object-cover" : "h-56 w-full object-cover"}
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-semibold text-gray-900">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <Stars rating={book.rating} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-brand-700">${Number(book.price).toFixed(2)}</span>
          <span
            className={`text-xs font-medium ${book.inStock ? "text-green-600" : "text-red-500"}`}
          >
            {book.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <Link
          to={`/books/${book.bookId}`}
          className="mt-2 inline-block rounded-md bg-brand-600 px-3 py-1.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
