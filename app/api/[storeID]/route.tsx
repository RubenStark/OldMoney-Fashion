import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    });

    if (!store) {
        return new NextResponse("No store", { status: 404});
    }

    return NextResponse.json(store?.name);
}
