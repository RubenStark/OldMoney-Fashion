import BillboardClient from "@/components/billboard-client";
import { BillboardColumn } from "@/components/billboard/columns";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

async function BillboardsPage({ params }: { params: { storeID: string } }) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeID: params.storeID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'dd/MM/yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards}/>
      </div>
    </div>
  );
}

export default BillboardsPage;
