import { NextResponse } from "next/server";
import { createHmac, BinaryLike } from "crypto";
import prismadb from "@/lib/prismadb"; // Import your database client here

import { paystackPubSecretKey } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const secret = req.headers.get("X-Paystack-Signature");

    if (!secret) {
      return new NextResponse("Webhook Error: No signature provided", {
        status: 400,
      });
    }

    const isValid = validatePaystackWebhook(body, secret);
    if (!isValid) {
      return new NextResponse("Webhook Error: Invalid signature", {
        status: 400,
      });
    }

    const eventData = JSON.parse(body);
    const event = eventData.event;
    const session = eventData.data?.object;

    if (event === "checkout.session.completed") {
      const address = session?.customer_details?.address;
      const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
      ];
      const addressString = addressComponents.filter((c) => c !== null).join(", ");

      const order = await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || '',
        },
        include: {
          orderItems: true,
        }
      });

      const productIds = order.orderItems.map((orderItem) => orderItem.productId);

      await prismadb.product.updateMany({
        where: {
          id: {
            in: [...productIds],
          },
        },
        data: {
          isArchived: true
        }
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
  }
}

function validatePaystackWebhook(body: BinaryLike | undefined, secret: string) {
  const hash = createHmac("sha512", paystackPubSecretKey)
    .update(body || "" as BinaryLike)
    .digest("hex");
  return hash === secret;
}
