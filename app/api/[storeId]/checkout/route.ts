import { NextResponse } from "next/server";
import axios from "axios";

import { paystackSecretKey } from "@/lib/paystack"; // Replace with your Paystack secret key
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId
            }
          }
        }))
      }
    }
  });

  const lineItems = products.map((product) => ({
    name: product.name,
    quantity: 1,
    amount: product.price.toNumber() * 100,
  }));

  const paystackRequest = {
    email: "customer@example.com", // Replace with the customer's email
    amount: lineItems.reduce((total, item) => total + item.amount, 0),
    callback_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    metadata: {
      orderId: order.id
    },
  };

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackRequest,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    return NextResponse.json({ url: response.data.data.authorization_url }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return new NextResponse("Error initializing payment", { status: 500 });
  }
};
