import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OverviewData } from "@/lib/services/overview";

export function OverviewSummary({ factory, metrics }: OverviewData) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Factory</CardTitle>
          <CardDescription>Context decoded from the current session.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <SummaryRow label="Name" value={factory?.factoryName ?? "-"} />
          <SummaryRow label="Code" value={factory?.factoryCode ?? "-"} />
          <SummaryRow label="Type" value={factory?.factoryType ?? "-"} />
          <SummaryRow label="Domain" value={factory?.domainName ?? "-"} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{metric.label}</CardTitle>
              <CardDescription>Usage vs capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {formatCount(metric.used)}
                {metric.total !== undefined ? <span className="text-muted-foreground text-lg"> / {formatCount(metric.total)}</span> : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium">{value ?? "-"}</span>
    </div>
  );
}

function formatCount(count?: number) {
  if (typeof count !== "number") return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(count);
}
