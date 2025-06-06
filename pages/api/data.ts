import { NextApiRequest, NextApiResponse } from "next";
import db from "./db"; // Import database connection

interface SensorData {
  salinity: number;
  pH: number;
  turbidity: number;
  temperature: number;
  timestamp: string;
}

let cache: SensorData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_EXPIRATION_TIME = 60000; // Cache expiration time in milliseconds (1 minute)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { salinity, pH, turbidity, temperature } = req.body;

      if (
        salinity === undefined ||
        pH === undefined ||
        turbidity === undefined ||
        temperature === undefined
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Update cache with the new data
      cache = [
        ...(cache || []),
        {
          salinity,
          pH,
          turbidity,
          temperature,
          timestamp: new Date().toISOString(),
        },
      ].slice(0, cache?.length ? cache?.length - 1 : 0);

      // Insert data into the database (asynchronously)
      db.run(
        "INSERT INTO sensor_data (salinity, pH, turbidity, temperature) VALUES (?, ?, ?, ?)",
        [Number(salinity), Number(pH), Number(turbidity), Number(temperature)],
        function (err) {
          if (err) {
            console.error("Database insert error:", err.message);
            return res.status(500).json({ message: "Database insert error" });
          }

          console.log("Data inserted into the database:", {
            id: this.lastID,
            salinity,
            pH,
            turbidity,
            temperature,
          });

          return res.status(200).json({
            message: "Data received successfully",
            id: this.lastID,
          });
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      console.log("Limit for retrieval:", limit);

      // Dùng Promise để xử lý db.get bất đồng bộ
      // Check if cache is valid
      if (cache && Date.now() - cacheTimestamp < CACHE_EXPIRATION_TIME) {
        console.log("Returning cached data");
        return res.status(200).json(cache);
      }

      // Query the database if cache is expired or not available
      // Update cache

      const getRecentData = () =>
        new Promise<SensorData[]>((resolve, reject) => {
          db.all(
            "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT ?",
            [limit],
            (err, rows: SensorData[]) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            }
          );
        });

      const recentData = await getRecentData();
      // Update cache
      cache = recentData;
      cacheTimestamp = Date.now();

      console.log("Sending new data");
      res.status(200).json(recentData);
    } catch (error) {
      console.error("Database retrieval error:", error);
      res.status(500).json({ message: "Database retrieval error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
