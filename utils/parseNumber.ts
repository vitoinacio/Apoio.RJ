const parseNumber = (value: string): number => {
  const normalized = value.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};

export default parseNumber;
