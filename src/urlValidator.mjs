export function isValidUrl(url) {
  const pattern = /^https?:\/\/[\w.-]+(\.[\w.-]+)+.*$/i;
  return pattern.test(url);
}
