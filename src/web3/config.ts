// Lightweight web3 config for the frontend. Update addresses/ABIs after deployment.

export interface ContractConfig {
	address: `0x${string}` | '';
	abi: any[];
}

export interface Web3Config {
	networkId?: number;
	VPOCore: ContractConfig;
	ProofRegistry: ContractConfig;
	Verifier: ContractConfig;
}

// CRA/React env vars must be prefixed with REACT_APP_
const VPO_CORE_ADDRESS = (process.env.REACT_APP_VPO_CORE_ADDRESS || '') as `0x${string}` | '';
const PROOF_REGISTRY_ADDRESS = (process.env.REACT_APP_PROOF_REGISTRY_ADDRESS || '') as `0x${string}` | '';
const VERIFIER_ADDRESS = (process.env.REACT_APP_VERIFIER_ADDRESS || '') as `0x${string}` | '';

// Load ABIs (local copies generated from Hardhat artifacts)
// Kept in src so CRA/Vite bundlers can import them.
// If these paths change, update imports accordingly.
const VPO_CORE_ABI: any[] = require('./abis/VPOCore.json').abi;
const PROOF_REGISTRY_ABI: any[] = require('./abis/VPOProofRegistry.json').abi;
const VERIFIER_ABI: any[] = require('./abis/VPOVerifier.json').abi;

// Optional local addresses override (for Hardhat in-process dev)
let localAddresses: { VPOCore?: string; ProofRegistry?: string; Verifier?: string } = {};
try {
  localAddresses = require('./addresses.local.json');
} catch (_) {
  // ignore if file missing
}

export const web3Config: Web3Config = {
	VPOCore: { address: (VPO_CORE_ADDRESS || (localAddresses.VPOCore as any) || '') as `0x${string}` | '', abi: VPO_CORE_ABI },
	ProofRegistry: { address: (PROOF_REGISTRY_ADDRESS || (localAddresses.ProofRegistry as any) || '') as `0x${string}` | '', abi: PROOF_REGISTRY_ABI },
	Verifier: { address: (VERIFIER_ADDRESS || (localAddresses.Verifier as any) || '') as `0x${string}` | '', abi: VERIFIER_ABI },
};

export function isContractsConfigured(): boolean {
	return Boolean(web3Config.VPOCore.address && web3Config.ProofRegistry.address && web3Config.Verifier.address);
}




