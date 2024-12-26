import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes de cours HEPIA",
  description: "Notes de cours HEPIA",
};

async function getCategories() {
  const publicPath = path.join(process.cwd(), "public");
  const categories = fs
    .readdirSync(publicPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((category) => category.name);
  return categories;
}

async function getItems(category: string) {
  const publicPath = path.join(process.cwd(), "public", category);
  const items = fs
    .readdirSync(publicPath)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.replace(".svg", ""));
  return items;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const categoryItems = await Promise.all(
    categories.map(async (category) => ({
      category,
      items: await getItems(category),
    }))
  );

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Sidebar - hidden on mobile using 'hidden md:block' */}
          <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <Link
                  href={`/`}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
                >
                  Notes de cours
                </Link>
              </h2>
              <ul className="space-y-4">
                {categoryItems.map(({ category, items }) => (
                  <li key={category}>
                    <details className="group">
                      <summary className="cursor-pointer px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors">
                        {category.replace(/_/g, " ")}
                      </summary>
                      <ul className="pl-4 mt-2 space-y-2">
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
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          {/* Main Content - full width on mobile */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}