export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">© {year} Pagebound Bookstore. All rights reserved.</p>

        <div className="flex gap-4 text-sm">
          <a href="#" aria-label="Facebook" className="hover:text-white">
            Facebook
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-white">
            Twitter
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white">
            Instagram
          </a>
        </div>

        <p className="text-sm">Contact: support@pagebound.example</p>
      </div>
    </footer>
  );
}
