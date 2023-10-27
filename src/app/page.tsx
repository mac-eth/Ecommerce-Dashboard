import { api } from "~/lib/api/server";

export default function Page() {
  return (
    <div>
      <div>test</div>
    </div>
  );
}

export const runtime = "edge";
export const revalidate = 0;
