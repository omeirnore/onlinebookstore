import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import BookCard from "../components/BookCard.jsx";
import BookCardSkeleton from "../components/BookCardSkeleton.jsx";

const ALL_CATEGORIES = ["Fiction", "Non-Fiction", "Science", "History", "Fantasy", "Biography"];

const SORT_OPTIONS = [
  { value: "price,asc", label: "Price: Low to High" },
  { value: "price,desc", label: "Price: High to Low" },
  { value: "title,asc", label: "Title: A-Z" },
  { value: "createdAt,desc", label: "Newest Arrivals" },
];

const PAGE_SIZE = 12;

function useCatalogueParams(searchParams) {
  return useMemo(() => {
    return {
      search: searchParams.get("search") || "",
      genres: searchParams.getAll("genre"),
      author: searchParams.get("author") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      availability: searchParams.get("availability") || "all",
      sort: searchParams.get("sort") || "createdAt,desc",
      page: parseInt(searchParams.get("page") || "0", 10),
    };
  }, [searchParams]);
}

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useCatalogueParams(searchParams);

  const [searchInput, setSearchInput] = useState(params.search);
  const [authorInput, setAuthorInput] = useState(params.author);
  const [minPriceInput, setMinPriceInput] = useState(params.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(params.maxPrice);
  const [view, setView] = useState("grid");

  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        next.delete(key);
        if (Array.isArray(value)) {
          value.forEach((v) => next.append(key, v));
        } else if (value !== undefined && value !== null && value !== "") {
          next.set(key, value);
        }
      });
      if (!("page" in updates)) {
        next.delete("page");
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    setSearchInput(params.search);
    setAuthorInput(params.author);
    setMinPriceInput(params.minPrice);
    setMaxPriceInput(params.maxPrice);
  }, [params.search, params.author, params.minPrice, params.maxPrice]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const query = {
      page: params.page,
      size: PAGE_SIZE,
      sort: params.sort,
    };
    if (params.search) query.search = params.search;
    if (params.genres.length > 0) query.genre = params.genres;
    if (params.author) query.author = params.author;
    if (params.minPrice) query.minPrice = params.minPrice;
    if (params.maxPrice) query.maxPrice = params.maxPrice;
    if (params.availability === "in") query.inStock = true;
    if (params.availability === "out") query.inStock = false;

    api
      .get("/books", { params: query })
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load books right now. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.page, params.sort, params.search, params.genres, params.author, params.minPrice, params.maxPrice, params.availability]);

  const toggleGenre = (name) => {
    const set = new Set(params.genres);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    updateParams({ genre: Array.from(set) });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const handlePriceApply = () => {
    updateParams({ minPrice: minPriceInput, maxPrice: maxPriceInput });
  };

  const handleAuthorApply = (e) => {
    e.preventDefault();
    updateParams({ author: authorInput });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput("");
    setAuthorInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  const goToPage = (page) => updateParams({ page: String(page) });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Catalogue</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <form onSubmit={handleSearchSubmit}>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Search</label>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Title or author"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </form>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Genre</h3>
            <div className="space-y-1">
              {ALL_CATEGORIES.map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={params.genres.includes(name)}
                    onChange={() => toggleGenre(name)}
                    className="rounded border-gray-300"
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                placeholder="Min"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                min="0"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                placeholder="Max"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <button
              onClick={handlePriceApply}
              className="mt-2 w-full rounded-md border border-brand-300 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              Apply
            </button>
          </div>

          <form onSubmit={handleAuthorApply}>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Author</h3>
            <input
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              placeholder="Exact author name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </form>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Availability</h3>
            <select
              value={params.availability}
              onChange={(e) => updateParams({ availability: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <button onClick={clearFilters} className="text-sm font-medium text-brand-700 hover:underline">
            Clear all filters
          </button>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${data.totalElements} book(s) found`}
            </p>

            <div className="flex items-center gap-3">
              <select
                value={params.sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex overflow-hidden rounded-md border border-gray-300 text-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1.5 ${view === "grid" ? "bg-brand-600 text-white" : "bg-white text-gray-600"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1.5 ${view === "list" ? "bg-brand-600 text-white" : "bg-white text-gray-600"}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {error && <p className="mb-4 text-red-600">{error}</p>}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : data.content.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-gray-500">
              No books found. Try adjusting your filters.
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-4"
              }
            >
              {data.content.map((book) => (
                <BookCard key={book.bookId} book={book} view={view} />
              ))}
            </div>
          )}

          {data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={params.page === 0}
                onClick={() => goToPage(params.page - 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {params.page + 1} of {data.totalPages}
              </span>
              <button
                disabled={params.page + 1 >= data.totalPages}
                onClick={() => goToPage(params.page + 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
