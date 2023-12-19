import { CategoryForm } from "@/components/category-form";
import prismadb from "@/lib/prismadb";

const CategoryPage = async ({
  params,
}: {
  params: { categoryID: string, storeID: string };
}) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryID,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeID: params.storeID,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards}/>
      </div>
    </div>
  );
};
export default CategoryPage;
