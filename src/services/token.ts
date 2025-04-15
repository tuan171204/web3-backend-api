import { ethers } from "ethers";
import { RPC_URL } from "../configs/common";
import { TOKEN_FACTORY_ADDRESS } from "../configs/contract";

const provider = new ethers.JsonRpcProvider(RPC_URL);

const FACTORY_ABI = [
  "event TokenDeployed(address indexed owner, address newToken, string name, string symbol, uint256 maxSupply, uint256 amountPerMint, uint256 mintFee)",
];

const iface = new ethers.Interface(FACTORY_ABI);

export const getTokenDeployedFromTxHash = async (txHash: string) => {
  const tx = await provider.getTransaction(txHash);
  if (
    ethers.getAddress((tx as any).to) !==
    ethers.getAddress(TOKEN_FACTORY_ADDRESS)
  )
    throw new Error("Invalid txHash.");

  const receipt = await provider.getTransactionReceipt(txHash);

  if (!receipt || !receipt.logs || receipt.logs.length === 0) {
    throw new Error("No logs found. Tx may be pending or failed.");
  }

  for (const log of receipt.logs) {
    try {
      const parsedLog = iface.parseLog(log);
      if (parsedLog?.name === "TokenDeployed") {
        const {
          owner,
          name,
          symbol,
          maxSupply,
          newToken: tokenAddress,
          mintFee,
          amountPerMint,
        } = parsedLog.args;

        return {
          owner,
          name,
          symbol,
          maxSupply,
          tokenAddress,
          mintFee,
          amountPerMint,
        };
      }
    } catch (err) {
      continue;
    }
  }

  throw new Error("TokenDeployed event not found in logs.");
};
