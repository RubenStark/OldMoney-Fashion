import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const billboard = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
        isMain: true,
      },
    });

    console.log("[MAIN-BILLBOARD_GET]", billboard);

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[MAIN-BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}