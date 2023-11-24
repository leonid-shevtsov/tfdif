const trailRegexp = new RegExp(" (.+)$");

export default function cleanID(id: string): string {
  return id.replace("[root] ", "").replace(trailRegexp, "");
}

export function prettyID(cleanID: string): string {
  return cleanID.replaceAll("module.", "📦 ").replaceAll(".", " / ");
}
