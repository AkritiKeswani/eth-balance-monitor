import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

export async function getEthBalance(address: string): Promise<string> {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error(`Error fetching balance for ${address}:`, error);
    throw error;
  }
}
