import { generateMeta } from "@/lib/utils";

export const metadata = generateMeta({
  title: "Dashboard",
  description: "Welcome to Service Booking System Dashboard",
  canonical: "/overview"
});

export default function OverviewPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[#454545]">Welcome to SBS Dashboard</h1>
        <p className="text-muted-foreground text-lg">Manage your services, bookings, and users here.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Stats Placeholder */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Today's Bookings</h3>
          <p className="mt-2 text-3xl font-bold text-[#454545]">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Active Services</h3>
          <p className="mt-2 text-3xl font-bold text-[#454545]">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Customers</h3>
          <p className="mt-2 text-3xl font-bold text-[#454545]">0</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[#454545]">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="rounded-lg bg-[#8C2424] px-4 py-2 text-white hover:bg-[#8C2424]/90 transition-colors">
            View New Bookings
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors">
            Manage Services
          </button>
        </div>
      </div>
    </div>
  );
}
