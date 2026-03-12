'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function D3ServiceMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll('*').remove();

    const width = 1200;
    const height = 675; // 16:9 aspect ratio

    const svg = d3.select(containerRef.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .style("background-color", "var(--bg-tertiary)")
        .style("border-radius", "12px")
        .style("box-shadow", "0 10px 25px rgba(0,0,0,0.1)");

    // Center coordinates for Bognor Regis / Felpham
    const centerCoords: [number, number] = [-0.65958, 50.78074]; 

    // Projection handles mapping Lat/Lon to X/Y pixels
    const projection = d3.geoMercator()
        .center(centerCoords)
        .scale(150000) 
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // 15 mile radius calculation
    const radiusInMeters = 15 * 1609.34;
    const circle = d3.geoCircle()
        .center(centerCoords)
        .radius(radiusInMeters / 111320)(); 

    // HARDCODED MAP DATA: High-res coastline from user snippet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const localCoastlineData: any = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": { "name": "Mainland" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-2.00, 52.00],   
                        [-1.20, 50.81],   
                        [-1.12, 50.78],   
                        [-1.11, 50.795], // Portsmouth Harbour in
                        [-1.09, 50.78],  
                        [-1.05, 50.775], 
                        [-1.03, 50.79],  // Langstone Harbour in
                        [-1.00, 50.83],  // Langstone Deep
                        [-0.98, 50.78],  // Hayling South
                        [-0.94, 50.78],  
                        [-0.93, 50.80],  // Chichester Harbour in
                        [-0.90, 50.82],  // Thorney Island wrap
                        [-0.88, 50.79],  
                        [-0.89, 50.77],  // West Wittering
                        [-0.86, 50.76],  
                        [-0.83, 50.75],  
                        [-0.80, 50.73],  
                        [-0.79, 50.722], // Selsey Bill True South
                        [-0.78, 50.735], 
                        [-0.76, 50.75],  
                        [-0.75, 50.765], // Pagham Harbour in
                        [-0.74, 50.76],  
                        [-0.69, 50.775], 
                        [-0.66, 50.78],  // Bognor Regis
                        [-0.64, 50.785], 
                        [-0.61, 50.79],  
                        [-0.55, 50.80],  
                        [-0.54, 50.805], // River Arun mouth
                        [-0.50, 50.805], 
                        [-0.45, 50.81],  
                        [-0.41, 50.81],  
                        [-0.37, 50.812], // Worthing
                        [-0.32, 50.818], 
                        [-0.28, 50.825], // River Adur mouth
                        [-0.26, 50.828], 
                        [-0.14, 50.82],  // Brighton
                        [0.00, 50.79],   
                        [1.00, 51.00],   
                        [1.00, 52.00],   
                        [-2.00, 52.00]   
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": { "name": "Isle of Wight" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-1.58, 50.66], [-1.50, 50.71], [-1.40, 50.74], [-1.30, 50.76], 
                        [-1.25, 50.75], [-1.16, 50.73], [-1.08, 50.68], [-1.15, 50.63], 
                        [-1.20, 50.59], [-1.30, 50.57], [-1.40, 50.60], [-1.58, 50.66]
                    ]]
                }
            }
        ]
    };

    // HARDCODED MAP DATA: Rivers from user snippet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const riversData: any = {
        "type": "FeatureCollection",
        "features": [
            { // River Arun
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-0.540, 50.805], [-0.545, 50.820], [-0.553, 50.840], 
                        [-0.5539, 50.8542], [-0.540, 50.880], [-0.530, 50.920], [-0.550, 50.980]
                    ]
                }
            },
            { // River Adur
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-0.280, 50.825], [-0.285, 50.840], [-0.290, 50.860], 
                        [-0.310, 50.880], [-0.300, 50.920], [-0.320, 50.960]
                    ]
                }
            },
            { // River Lavant / Chichester Harbour Channels
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-0.880, 50.790], [-0.850, 50.810], [-0.800, 50.830],
                        [-0.7792, 50.8365], [-0.760, 50.860], [-0.750, 50.890]
                    ]
                }
            }
        ]
    };

    // Render the landmass
    svg.append("g")
        .selectAll(".land")
        .data(localCoastlineData.features)
        .enter()
        .append("path")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("d", path as any)
        .style("fill", "var(--primary)")
        .style("stroke", "var(--primary)")
        .style("stroke-width", "1px")
        .style("stroke-linejoin", "round")
        .style("opacity", "0.15");

    // Render the rivers
    svg.append("g")
        .selectAll(".river")
        .data(riversData.features)
        .enter()
        .append("path")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("d", path as any)
        .style("fill", "none")
        .style("stroke", "var(--bg-tertiary)")
        .style("stroke-width", "2.5px")
        .style("stroke-linecap", "round")
        .style("stroke-linejoin", "round");

    // Render the 15-mile service radius
    svg.append("path")
        .datum(circle)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("d", path as any)
        .style("fill", "rgba(13, 148, 136, 0.1)")
        .style("stroke", "var(--secondary)")
        .style("stroke-width", "2px")
        .style("stroke-dasharray", "6, 6");

    // Data array of local areas and approximate populations
    const cities = [
        { name: "Felpham", coords: [-0.6567, 50.7935], pop: 10000, main: true },
        { name: "Bognor Regis", coords: [-0.65958, 50.78074], pop: 63000 },
        { name: "Chichester", coords: [-0.7792, 50.8365], pop: 31000 },
        { name: "Littlehampton", coords: [-0.5401, 50.8095], pop: 28000 },
        { name: "Arundel", coords: [-0.5539, 50.8542], pop: 3500 },
        { name: "Selsey", coords: [-0.7909, 50.7335], pop: 10000 },
        { name: "Worthing", coords: [-0.3714, 50.8146], pop: 110000 },
        { name: "Middleton-on-Sea", coords: [-0.618, 50.792], pop: 5000 },
        { name: "Aldwick", coords: [-0.695, 50.778], pop: 10000 },
        { name: "Pagham", coords: [-0.745, 50.765], pop: 6000 },
        { name: "Rustington", coords: [-0.505, 50.810], pop: 14000 },
        { name: "Barnham", coords: [-0.638, 50.828], pop: 4000 },
        { name: "Yapton", coords: [-0.605, 50.820], pop: 3500 },
        { name: "Rose Green", coords: [-0.710, 50.780], pop: 5000 },
        { name: "Angmering", coords: [-0.485, 50.825], pop: 8000 },
        { name: "East Wittering", coords: [-0.870, 50.770], pop: 5000 },
        { name: "Portsmouth", coords: [-1.0880, 50.8198], pop: 238000 }
    ];

    // Scale population data dynamically to dot area
    const radiusScale = d3.scaleSqrt()
        .domain([0, 238000]) // Range from 0 to largest population
        .range([3, 15]);     // Reduced range slightly to accommodate more dots

    // Add the population dots
    svg.selectAll(".city-dot")
        .data(cities)
        .enter()
        .append("circle")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("cx", (d: any) => projection(d.coords as [number, number])![0])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("cy", (d: any) => projection(d.coords as [number, number])![1])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("r", (d: any) => radiusScale(d.pop))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .style("fill", (d: any) => d.main ? "var(--accent)" : "var(--secondary)")
        .style("stroke", "#ffffff")
        .style("stroke-width", "1.5px");

    // Add the text labels
    svg.selectAll(".city-label")
        .data(cities)
        .enter()
        .append("text")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("x", (d: any) => projection(d.coords as [number, number])![0] + radiusScale(d.pop) + 6)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("y", (d: any) => projection(d.coords as [number, number])![1] + 5)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .text((d: any) => d.name)
        .style("font-size", "14px")
        .style("fill", "var(--primary)")
        .style("font-weight", "700")
        .style("pointer-events", "none")
        .style("paint-order", "stroke")
        .style("stroke", "#ffffff")
        .style("stroke-width", "4px")
        .style("stroke-linejoin", "round");

  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        aspectRatio: '16/9',
        margin: '0 auto'
      }} 
    />
  );
}
