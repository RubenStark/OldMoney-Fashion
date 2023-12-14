import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params }: { params: { storeID: string } },
) {
    try {

        const { userId } = auth();
        const body = await req.json();
        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Missing name", { status: 400 })
        }
        
        if (!params.storeID) {
            return new NextResponse("Missing storeID", { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeID,
                userId,
            },
            data: {
                name,
            },
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log("🚀 ~ file: STORE_PATCH ~ error:", error)
        return new NextResponse("Internal error", { status: 500 })
    }

}


export async function DELETE (
    req: Request,
    { params }: { params: { storeID: string } },
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.storeID) {
            return new NextResponse("Missing storeID", { status: 400 })
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeID,
                userId,
            },
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log("🚀 ~ file: STORE_DELETE ~ error:", error)
        return new NextResponse("Internal error", { status: 500 })
    }

}