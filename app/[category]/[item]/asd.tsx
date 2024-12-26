import fs from "fs";
import path from "path";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";


interface LayoutProps {
  children: React.ReactNode;
  params: { category: string };
}

// Function to fetch items for a specific category
async function getItems(category: string) {
  const publicPath = path.join(process.cwd(), "public", category);

  const items = fs
    .readdirSync(publicPath)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.replace(".svg", ""));

  return items;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { category } = params;
  const items = await getItems(category);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0">
        <div className="p-6">
          <nav className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour aux catégories
            </Link>
          </nav>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {category.replace(/_/g, " ")}
          </h2>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item}>
                <Link
                  href={`/${category}/${item}`}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
                >
                  {item.replace(/_/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
