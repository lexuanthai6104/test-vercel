import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://theaquasense.com/api/data");
  const data = await res.json();
  return NextResponse.json(data);
}
