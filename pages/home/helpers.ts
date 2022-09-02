
export function getItem(label: string, icon?: React.ReactNode) {
  return {
    key: label,
    icon,
    label: shortenAddress(label),
  };
}

export function shortenAddress(address: string) {
  const numberCount = 7;
  return (
    address.slice(0, numberCount) +
    "..." +
    address.slice(address.length - numberCount)
  );
}
