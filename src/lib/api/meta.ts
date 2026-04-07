export async function fetchMetaAdsCampaigns(accountId: string) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Missing META_ACCESS_TOKEN");
  }

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${accountId}/insights?fields=campaign_name,spend,impressions,clicks,purchase_roas`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Meta Ads API request failed.");
  }

  return (await response.json()) as Record<string, unknown>;
}
