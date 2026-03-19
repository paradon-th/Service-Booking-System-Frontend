import type { FactoryDto } from "@/lib/api/generated";
import { apiClient } from "@/lib/api/client";
import { getCurrentTokenClaims } from "@/lib/auth/token";

export type OverviewMetric = {
  key: string;
  label: string;
  used?: number;
  total?: number;
};

export type OverviewData = {
  factory?: FactoryDto | null;
  metrics: OverviewMetric[];
};

export async function loadOverviewData(): Promise<OverviewData> {
  const claims = await getCurrentTokenClaims();
  const factoryId = typeof claims?.factoryId === "number" ? claims.factoryId : undefined;

  const [factoryRes, limitRes] = await Promise.all([
    factoryId ? apiClient.management.getFactoryById({ factoryId }) : Promise.resolve({ data: null }),
    apiClient.management.getLimitInformation()
  ]);

  const factory = factoryRes?.data ?? null;
  const limits = limitRes?.data ?? {};

  const metrics: OverviewMetric[] = [
    { key: "tag", label: "Tags", used: limits.usedTag, total: limits.totalTag },
    { key: "tagRelation", label: "Tag Relations", used: limits.usedTagRelation, total: limits.totalTagRelation },
    { key: "interface", label: "Interfaces", used: limits.usedInterface, total: limits.totalInterface },
    { key: "integration", label: "Integrations", used: limits.usedIntegration, total: limits.totalIntegration },
    { key: "user", label: "Users", used: limits.usedUser, total: limits.totalUser },
    { key: "form", label: "Forms", used: limits.usedForm, total: limits.totalForm },
    { key: "monitoring", label: "Monitoring", used: limits.usedMonitoring, total: limits.totalMonitoring },
    { key: "intelligence", label: "Intelligence", used: limits.usedIntelligence, total: limits.totalIntelligence }
  ];

  return { factory, metrics };
}
