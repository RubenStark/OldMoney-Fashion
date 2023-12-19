import BillboardClient from "@/components/billboard-client";
import CategoryClient from "@/components/category-client";
import { CategoryColumn } from "@/components/category/columns";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

async function CategoriesPage({ params }: { params: { storeID: string } }) {
  const categories = await prismadb.category.findMany({
    where: {
      storeID: params.storeID,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      billboardlabel: category.billboard.label,
      createdAt: format(category.createdAt, 'dd/MM/yyyy'),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}

export default CategoriesPage;
