import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "./Table";
import { useIonRouter } from "@ionic/react";
import { ProductWithCartOptions, measureCart } from "../hooks/useCart";

interface Props {
  products: ProductWithCartOptions[];
}

const columnHelper = createColumnHelper<ProductWithCartOptions>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (name) => <span className="font-medium">{name.getValue()}</span>,
    footer: () => <span className="block mt-3 text-left">Total</span>,
  }),
  columnHelper.accessor("qty", {
    header: "Quantity",
  }),
];

const OrderCartTable: React.FC<Props> = ({ products = [] }) => {
  const ionRouter = useIonRouter();

  const goToOrder = (row: any) => {
    ionRouter.push(`/products/${row.original.id}/preview`);
  };

  return (
    <Table
      data={products}
      columns={[
        ...columns,
        columnHelper.accessor("price", {
          header: "Total Price",
          cell: (price) => `N ${price.getValue()}`,
          footer: () => (
            <div className="text-right">
              N {measureCart(products).totalCartValue}
            </div>
          ),
        }),
      ]}
      onRowClick={goToOrder}
      hideNavigation
    />
  );
};

export default OrderCartTable;
