// ENS utility — resolves address → name and name → address on Ethereum mainnet
// Used with wagmi's useEnsName / useEnsAvatar hooks (chainId: 1)

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function displayIdentity(ensName: string | null | undefined, address: string): string {
  return ensName ?? shortAddress(address);
}
