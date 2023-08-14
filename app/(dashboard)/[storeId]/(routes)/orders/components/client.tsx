"use client";

import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    return(
<>
       
            <Heading
            title={`Orders (${data.length})`}
            description="Manage order for you store"
            />
        <Separator />
        <DataTable  searchKey="products" columns={columns} data={data}/>
    </>
   )
}