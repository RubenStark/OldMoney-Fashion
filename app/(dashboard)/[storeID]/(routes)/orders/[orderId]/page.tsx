import prismadb from "@/lib/prismadb";

import { OrderForm } from "./components/order-form";

const OrderPage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const order = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
  });

  const products = await prismadb.orderItem.findMany({
    where: {
      orderId: params.orderId,
    },
    include: {
      product: {
        include: {
          images: true,
          color: true,
        },
      },
    },
  });

  const formattedProducts = products.map((product) => ({
    ...product,
    product: {
      ...product.product,
      price: Number(product.product.price),
    },
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm products={formattedProducts} initialData={order} />
      </div>
    </div>
  );
};

export default OrderPage;
