import fs from "fs";
import path from "path";
import Link from "next/link";
import { BookOpen } from "lucide-react";

// Function to read categories from the public folder
async function getCategories() {
  const publicPath = path.join(process.cwd(), "public");

  const categories = fs
    .readdirSync(publicPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((category) => category.name);

  return categories;
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Notes de cours HEPIA
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Mes notes au format SVG
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {category.replace(/_/g, " ")}
              </h2>
              <Link
                href={`/${category}`}
                className="block px-3 py-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Voir les notes →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
