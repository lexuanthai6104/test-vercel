"use client";

import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { format } from "date-fns";
import Image from "next/image";

const formatTimestamp = (timestamp: string) => {
  return format(new Date(timestamp), "MM/dd HH:mm");
};

interface SensorData {
  salinity: number;
  pH: number;
  turbidity: number;
  temperature: number;
  timestamp: string;
}

const DataDisplay = () => {
  const [data, setData] = useState<SensorData[] | null>(null);
  const [timer, setTime] = useState(0);

  useEffect(() => {
    // const sendTestData = async () => {
    //   const response = await fetch("/api/data", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       salinity: Math.floor(Math.random() * 10),
    //       pH: Math.floor(Math.random() * 10),
    //       turbidity: Math.floor(Math.random() * 10),
    //       temperature: Math.floor(Math.random() * 10),
    //     }),
    //   });
    //   const result = await response.json();
    //   console.log(result);
    // };

    const fetchData = async () => {
      // const response = await fetch("https://theaquasense.com/api/data");
      const response = await fetch("/api/proxy-data");
      const result: SensorData[] = await response.json();
      console.log("Fetched data:", result); // Log the fetched data
      setData(result.reverse());
      console.log("Data state after set:", result); // Log the data state
    };
    // sendTestData().then(() => {
    fetchData();
    // });
  }, [timer]);
  setTimeout(() => {
    setTime(timer + 1);
  }, 5000);
  const getChartData = function (whatdata: keyof SensorData, label: string) {
    return {
      labels: data ? data.map((d) => formatTimestamp(d.timestamp)) : [],
      datasets: [
        {
          label: label,
          data: data ? data.map((d) => d[whatdata]) : [],
          backgroundColor: "rgba(75, 192, 192, 0.56)",
          borderColor: "rgb(31, 126, 126)",
          borderWidth: 1,
        },
      ],
    };
  };

  const salinityChartData = getChartData("salinity", "Salinity");
  const pHChartData = getChartData("pH", "pH");
  const turbidityChartData = getChartData("turbidity", "Turbidity");
  const temperatureChartData = getChartData("temperature", "Temperature");

  return (
    <div className="bg-cyan-100 p-4 w-3/4 m-auto rounded-lg text-center text-black shadow-md">
      {data ? (
        <div>
          <h2 className=" mb-4 text-2xl">Data Center</h2>
          <div className="grid grid-flow-col grid-cols-2 grid-rows-2 gap-4 ">
            <div className="bg-amber-300 rounded-lg shadow-lg p-2">
              <LineChart data={salinityChartData} />
              <p className="p-1">Salinity Chart</p>
            </div>
            <div className="bg-amber-300 rounded-lg shadow-lg p-2">
              <LineChart data={pHChartData} />
              <p className="p-1">pH Chart</p>
            </div>
            <div className="bg-amber-300 rounded-lg shadow-lg p-2">
              <LineChart data={turbidityChartData} />
              <p className="p-1">Turbidity Chart</p>
            </div>
            <div className="bg-amber-300 rounded-lg shadow-lg p-2">
              <LineChart data={temperatureChartData} />
              <p className="p-1">Temperature Chart</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Loading...</p>
          <Image
            src={"/loading-gif.gif"}
            alt="loading"
            width={100}
            height={100}
            unoptimized></Image>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
