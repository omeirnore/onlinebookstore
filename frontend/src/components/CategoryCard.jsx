import { Link } from "react-router-dom";

const ICONS = {
  Fiction: "📖",
  "Non-Fiction": "🧭",
  Science: "🔬",
  History: "🏛️",
  Fantasy: "🐉",
  Biography: "🖋️",
};

export default function CategoryCard({ name }) {
  return (
    <Link
      to={`/catalogue?genre=${encodeURIComponent(name)}`}
      className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="text-3xl">{ICONS[name] || "📚"}</span>
      <span className="font-semibold text-gray-800">{name}</span>
    </Link>
  );
}
