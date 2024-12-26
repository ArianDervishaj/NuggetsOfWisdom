import SvgViewer from "./SvgViewer"; // Import the Client Component
import { ChevronLeft } from 'lucide-react';
import React from 'react';

interface Props {
  params: {
    category: string;
    item: string;
  };
}

export default async function SvgPage({ params }: Props) {
  // Wait for params to resolve (this ensures we handle them asynchronously)
  const { category, item } = await Promise.resolve(params);

  // Validate params
  if (!category || !item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center rounded-lg bg-white p-8 shadow-lg">
          <h1 className="text-xl font-bold text-red-500 mb-4">Error: Invalid Parameters</h1>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  const svgPath = `/${category}/${item}.svg`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-[90rem] mx-auto p-6 lg:p-8">
        <nav className="mb-6">
          <a 
            href="./.." 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </a>
        </nav>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {`${category.replace("_", " ")} - ${item.replace("_", " ")}`}
            </h1>
          </div>
          
          <div className="p-6">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
              <SvgViewer svgPath={svgPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static parameters for dynamic routes
export async function generateStaticParams() {
  const path = require("path");
  const fs = require("fs");
  const publicPath = path.join(process.cwd(), "public");

  const categories = fs
    .readdirSync(publicPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const params: { category: string; item: string }[] = [];

  for (const category of categories) {
    const categoryPath = path.join(publicPath, category.name);
    const items = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".svg"));

    for (const item of items) {
      params.push({
        category: category.name,
        item: item.replace(".svg", ""),
      });
    }
  }

  return params;
}
