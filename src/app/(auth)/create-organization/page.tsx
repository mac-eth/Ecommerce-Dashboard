"use client";

import { CreateOrganization } from "@clerk/nextjs";
import { api } from "~/lib/api/client";

export default function CreateOrganizationPage() {
  return <CreateOrganization />;
}
