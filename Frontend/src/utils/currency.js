export function convertUSDToINR(usd, rate = 82.5) {
  const inr = Math.round(Number(usd) * rate);
  // Format using en-IN locale for grouping
  return `₹${inr.toLocaleString('en-IN')}`;
}
