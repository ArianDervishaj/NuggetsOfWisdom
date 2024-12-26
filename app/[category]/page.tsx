import fs from "fs";
import path from "path";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Generate static paths for all categories
export async function generateStaticParams() {
  const publicPath = path.join(process.cwd(), "public");
  const categories = fs
    .readdirSync(publicPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((category) => ({ category: category.name }));

  return categories;
}

// Component to render category page
export default async function CategoryPage({ params: rawParams }: { params: { category: string } }) {
  // Await the resolution of params
  const params = await rawParams;
  const { category } = params;

  // Path to the category folder
  const publicPath = path.join(process.cwd(), "public", category);

  // Fetch all SVG files in the category
  const items = fs
    .readdirSync(publicPath)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.replace(".svg", ""));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link
            href="./.."
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Tous les cours
          </Link>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Notes pour {category.replace(/_/g, " ")}
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize mb-4">
                {item.replace(/_/g, " ")}
              </h2>
              <Link
                href={`/${category}/${item}`}
                className="block px-3 py-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Ouvrir →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
