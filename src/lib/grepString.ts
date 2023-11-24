export default function grepString(resource: string): string {
  const parts = resource.split(".");
  if (parts.length < 2) {
    return resource;
  }
  const name = parts[parts.length - 1];
  const resourceType = parts[parts.length - 2];

  return `resource "${resourceType}" "${name}"`;
}
