"use client";

import React, { useEffect, useRef, useState } from "react";
import panzoom from "panzoom";
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface SvgViewerProps {
  svgPath: string;
}

export default function SvgViewer({ svgPath }: SvgViewerProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgContainerRef.current) {
      const panZoomInstance = panzoom(svgContainerRef.current, {
        maxZoom: 10, // Maximum zoom level
        minZoom: 0.5, // Minimum zoom level
        zoomSpeed: 0.1, // Zoom sensitivity
        bounds: true, // Enable bounds to constrain movement
        boundsPadding: 0.2, // Add padding to bounds
      });

      // Cleanup Panzoom instance on unmount
      return () => {
        panZoomInstance.dispose();
      };
    }
  }, []);

  return (
    <div
      ref={svgContainerRef}
      className="relative w-full h-4/6 bg-gray-100 overflow-hidden" // Adjust height to leave space for the header
      style={{ cursor: "grab" }}
    >
      <object
        type="image/svg+xml"
        data={svgPath}
        className="w-full h-1/2"
        style={{ pointerEvents: "none" }} // Prevent interaction with the SVG itself
      >
        Your browser does not support SVGs.
      </object>
    </div>
  );
}
