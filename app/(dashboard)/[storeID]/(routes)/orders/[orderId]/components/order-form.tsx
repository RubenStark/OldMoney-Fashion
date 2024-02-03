"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Order, OrderItem } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import Image from "next/image";

const formSchema = z.object({
  code: z.string().min(1),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  initialData: Order | null;
  products: OrderItem[];
}

export const OrderForm: React.FC<OrderFormProps> = ({
  initialData,
  products,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Order" : "Create Order";
  const description = initialData ? "Edit a Order." : "Add a new Order";
  const toastMessage = initialData ? "Order updated." : "Order created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        code: initialData.shippedCode,
      }
    : {
        code: "",
      };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);

      await axios.patch(
        `/api/${params.storeId}/orders/${params.orderId}`,
        data
      );

      router.refresh();
      router.push(`/${params.storeId}/orders`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/Orders/${params.OrderId}`);
      router.refresh();
      router.push(`/${params.storeId}/Orders`);
      toast.success("Order deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  console.log(initialData);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Codigo de seguimiento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <ul>
        {products.map((orderItem) => (
          <OrderCard key={orderItem.id} data={orderItem} />
        ))}
      </ul>
    </>
  );
};

function OrderCard({ data }: { data: OrderItem }) {
  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.product.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">
              {data.product.name}
            </p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.product.color.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
              {data.size}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
