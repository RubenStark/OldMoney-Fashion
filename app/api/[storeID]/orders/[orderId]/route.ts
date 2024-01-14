import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const order = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        isShipped: true,
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("[ORDERS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
