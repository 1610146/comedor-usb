import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user.model";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email } = await request.json();
  await connectMongoDB();
  await User.create({ name, email });
  return NextResponse.json({ message: "User Registered" }, { status: 201 });
}
