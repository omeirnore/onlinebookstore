import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-brand-700">404</h1>
      <p className="text-gray-600">This page could not be found.</p>
      <Link to="/" className="rounded-md bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
        Back to Home
      </Link>
    </div>
  );
}
