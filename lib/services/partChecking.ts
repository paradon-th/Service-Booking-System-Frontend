export const getPartCheckingData = async () => {
  const response = await fetch("/api/partchecking/mock-partchecking");
  if (!response.ok) {
    throw new Error("Failed to fetch part checking data");
  }
  return response.json();
};

export const getPartCheckingDetailData = async () => {
  const response = await fetch("/api/partchecking/mock-partcheckingdetail");
  if (!response.ok) {
    throw new Error("Failed to fetch part checking Detail data");
  }
  return response.json();
}