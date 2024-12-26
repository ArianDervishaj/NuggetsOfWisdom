import fs from "fs";
import path from "path";
import Link from "next/link";
import { BookOpen } from 'lucide-react';

// Function to read SVG links from the public folder
async function getLinks() {
  const publicPath = path.join(process.cwd(), "public");

  const categories = fs
    .readdirSync(publicPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const links: Record<string, string[]> = {};

  for (const category of categories) {
    const categoryPath = path.join(publicPath, category.name);
    const items = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".svg"));

    links[category.name] = items.map((file) => file.replace(".svg", ""));
  }

  return links;
}

export default async function Home() {
  const links = await getLinks();


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
          {Object.entries(links).map(([category, items]) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {category.replace("_", " ")}
              </h2>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                    <Link
                      href={`/${category}/${item}`}
                      className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.replace("_", " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
