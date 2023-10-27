import DashboardNav from "~/components/dashboard-nav";
import { Toaster } from "~/components/ui/toaster";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <DashboardNav />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
