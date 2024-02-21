
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { ownerId: string } }
) {
  const orders = await prismadb.order.findMany({
    where: {
      ownerId: params.ownerId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
              color: true,
              sizes:true
            },
          },
        },
      },
    },
  });

  return NextResponse.json(orders, {
    headers: corsHeaders,
  });
}
