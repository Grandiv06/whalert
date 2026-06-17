export function getMarketLabel(market?: number | null) {
  switch (market) {
    case 0:
      return "CRYPTO";
    case 1:
      return "FOREX";
    case 2:
      return "STOCK";
    default:
      return "-";
  }
}
