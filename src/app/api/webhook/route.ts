import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook } from "svix";
import { db } from "~/server/db";
import { organizations } from "~/server/db/schema";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook

  console.log("Webhook received");
  const WEBHOOK_SECRET = process.env.CLERK_ORG_CREATE_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = (await req.json()) as Record<string, unknown>;
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  if (!evt.data.id || !evt.type) {
    return new Response("Error occured -- no id or type", {
      status: 400,
    });
  }

  switch (evt.type) {
    case "organization.created": {
      const orgData = {
        created_by: evt.data.created_by,
        has_image: evt.data.has_image,
        clerk_id: evt.data.id,
        image_url: evt.data.image_url,
        logo_url: evt.data.logo_url,
        max_allowed_members: evt.data.max_allowed_memberships,
        name: evt.data.name,
        slug: evt.data.slug,
      };
      try {
        await db.insert(organizations).values(orgData);
        return new Response("Organization Created", { status: 201 });
      } catch (dbError) {
        console.error("Error inserting organization into database:", dbError);
        return new Response("Database Error", { status: 500 });
      }
    }
  }

  return new Response("Organization Created", { status: 201 });
}
