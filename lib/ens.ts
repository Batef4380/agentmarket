// Solana address display utilities (ENS replaced by truncated base58)
// SNS (Solana Name Service) can be layered in later via @bonfida/spl-name-service

export function shortAddress(address: string): string {
  if (address.length > 12) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
  return address;
}

export function displayIdentity(snsName: string | null | undefined, address: string): string {
  return snsName ?? shortAddress(address);
}
