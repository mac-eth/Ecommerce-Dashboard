import { desc, eq } from "drizzle-orm";
import { number, z } from "zod";
import { slugify } from "~/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { organizations } from "~/server/db/schema";

export const createOrganizationSchema = z.object({
  created_by: z.string().min(1).max(191),
  has_image: z.boolean(),
  clerk_id: z.string().min(1).max(191),
  image_url: z.string().min(1).max(191),
  logo_url: z.string().nullable(),
  max_allowed_members: number(),
  name: z.string().min(1).max(191),
  slug: z.string().min(1).max(191).nullable(),
});

export const authRouter = createTRPCRouter({
  createOrganization: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const result = await db.insert(organizations).values({
        created_by: input.created_by,
        has_image: input.has_image,
        clerk_id: input.clerk_id,
        image_url: input.image_url,
        logo_url: input.logo_url,
        max_allowed_members: input.max_allowed_members,
        name: input.name,
        slug: input.slug,
      });
      return result;
    }),
});
