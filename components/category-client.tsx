"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./category/columns";
import { DataTable } from "./category/data-table";
import ApiList from "./ui/api-list";
import { CategoryColumn } from "./category/columns";

interface CategoryClientProps {
  data: CategoryColumn[];
}

function CategoryClient({ data }: CategoryClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categorias (${data.length})`}
          description="Maneja los categorias de tu tienda"
        />
        <Button
          onClick={() => router.push(`/${params.storeID}/categories/new`)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading
        title="API"
        description="API para obtener los datos de los categories"
      />
      <Separator />
      <ApiList entityIdName="categoryID" entityName="categories" />
    </>
  );
}

export default CategoryClient;
