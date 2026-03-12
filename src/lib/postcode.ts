export async function lookupPostcode(postcode: string) {
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 200) return null;
    return data.result;
  } catch (error) {
    console.error("Postcode lookup failed:", error);
    return null;
  }
}

export function isSupportedPostcode(postcode: string) {
  const formatted = postcode.trim().toUpperCase().replace(/\s/g, '');
  const outward = formatted.match(/^[A-Z]{1,2}[0-9][A-Z0-9]?/)?.[0];
  const SUPPORTED = ['PO18', 'PO19', 'PO20', 'PO21', 'PO22'];
  return outward ? SUPPORTED.includes(outward) : false;
}
