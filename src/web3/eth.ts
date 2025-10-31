import { ethers } from 'ethers';
import { web3Config } from './config';

export interface WalletState {
	provider?: ethers.BrowserProvider;
	signer?: ethers.Signer;
	address?: string;
	network?: ethers.Network;
}

export async function connectWallet(): Promise<WalletState> {
	if (!(window as any).ethereum) throw new Error('MetaMask not found');
	const provider = new ethers.BrowserProvider((window as any).ethereum, 'any');
	await provider.send('eth_requestAccounts', []);
	const signer = await provider.getSigner();
	const address = await signer.getAddress();
	const network = await provider.getNetwork();
	return { provider, signer, address, network };
}

export async function getContract(name: keyof typeof web3Config, signerOrProvider: ethers.Signer | ethers.Provider) {
	const cfg = (web3Config as any)[name];
	if (!cfg?.address) throw new Error(`${name} address not configured`);
	if (!cfg?.abi?.length) throw new Error(`${name} ABI not configured`);
	return new ethers.Contract(cfg.address, cfg.abi, signerOrProvider);
}





