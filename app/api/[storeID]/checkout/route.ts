import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {

  const url = new URL(req.url);
 
  const { productIds, ownerId, sizes } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "MXN",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      ownerId: ownerId,
      orderItems: {
        create: productIds.map((productId: string) => ({
          size: sizes[productId.indexOf(productId)],
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  // console.log(order.ownerId);
  // TODO - obtener la url de la tienda

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    // success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    success_url: `${url}/cart?success=1`,
    cancel_url: `${url}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { ownerId } = await req.json();

  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
      ownerId: ownerId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(orders, {
    headers: corsHeaders,
  });
}
