import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeID: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeID,
    },
  });

  return (
    <div>
      Tienda: {store?.name}
    </div>
  );

};

export default DashboardPage;
