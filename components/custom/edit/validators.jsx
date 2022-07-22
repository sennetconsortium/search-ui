export function validateProtocolIOURL(value) {
  if (value === undefined || value === "") return true;
  const patt = /^(http(s)?:\/\/(www\.)?)?protocols\.io\/.*/;
  return patt.test(value);
}
