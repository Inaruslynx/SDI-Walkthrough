import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  // Colors,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import autocolors from "chartjs-plugin-autocolors";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect, useRef } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  autocolors
);

export default function Graph({
  data,
}: {
  data: ChartData<"line">;
}) {
  const chartRef = useRef<ChartJSOrUndefined<"line">>(null);
  const [color, setColor] = useState<string>("dark");
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    scales: {
      x: {
        grid: {
          color: color==="dark" ? "white": "black",
        },
        ticks: {
          color: color==="dark" ? "white": "black",
        },
      },
      y: {
        grid: {
          color: color==="dark" ? "white": "black",
        },
        ticks: {
          color: color==="dark" ? "white": "black",
        },
      },
    },
    plugins: {
      autocolors,
    },
  });

  useEffect(() => {
    const rootComputedStyle = getComputedStyle(document.documentElement)
    const mainHtml = document.getElementById("mainHtml");
    const handleThemeChange = () => {
      const colorScheme= rootComputedStyle.colorScheme || rootComputedStyle.getPropertyValue('--color-scheme');
      setColor(colorScheme)
    };
    const observer = new MutationObserver(handleThemeChange);
    if (mainHtml) {
      observer.observe(mainHtml, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      scales: {
        x: {
          grid: {
            color: color==="dark" ? "white": "black",
          },
          ticks: {
            color: color==="dark" ? "white": "black",
          },
        },
        y: {
          grid: {
            color: color==="dark" ? "white": "black",
          },
          ticks: {
            color: color==="dark" ? "white": "black",
          },
        },
      },
    }));
  }, [color]);

  if (data) {
    return <Line data={data} options={options} ref={chartRef} redraw />;
  }
}
