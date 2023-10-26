import {
  boolean,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";

export const notes = mysqlTable("notes", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull(),
  title: text("title").notNull(),
  text: text("text").default(""),
  created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
});

export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey(),
  admin_delete_enabled: boolean("admin_delete_enabled")
    .notNull()
    .default(false),
  created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  created_by: varchar("created_by", { length: 191 }).notNull(),
  has_image: boolean("has_image"),
  clerk_id: varchar("clerk_id", { length: 191 }).notNull(),
  image_url: varchar("image_url", { length: 191 }).notNull().default(""),
  logo_url: varchar("logo_url", { length: 191 }),
  max_allowed_members: smallint("max_allowed_members"),
  name: varchar("name", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  shopify_enabled: boolean("shopify_enabled").notNull().default(false),
  shopify_shop_id: varchar("shopify_shop_id", { length: 191 }),
  shopify_shop_domain: varchar("shopify_shop_domain", { length: 191 }),
  shopify_access_token: varchar("shopify_access_token", { length: 191 }),
  shopify_refresh_token: varchar("shopify_refresh_token", { length: 191 }),
  shopify_scope: varchar("shopify_scope", { length: 191 }),
  shopify_shop_name: varchar("shopify_shop_name", { length: 191 }),
});
