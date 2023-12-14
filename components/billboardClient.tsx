"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";

function BillboardClient() {
    const router = useRouter();
    const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Billboards (0)"
          description="Maneja los Billboards de tu tienda"
        />
        <Button onClick={() => router.push(`/${params.storeID}/billboards/new`)}>
            <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
    </>
  );
}

export default BillboardClient;
