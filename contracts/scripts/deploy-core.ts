import 'dotenv/config';
import { ethers } from 'hardhat';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);

  const Registry = await ethers.getContractFactory('VPOProofRegistry');
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddr = await registry.getAddress();
  console.log('VPOProofRegistry:', registryAddr);

  const Verifier = await ethers.getContractFactory('VPOVerifier');
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddr = await verifier.getAddress();
  console.log('VPOVerifier:', verifierAddr);

  const Core = await ethers.getContractFactory('VPOCore');
  const core = await Core.deploy(registryAddr);
  await core.waitForDeployment();
  const coreAddr = await core.getAddress();
  console.log('VPOCore:', coreAddr);

  const outDir = join(__dirname, '../../deployments');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `${Date.now()}.json`);
  const net = await deployer.provider!.getNetwork();
  const data = { network: net.name, chainId: Number(net.chainId), addresses: { VPOCore: coreAddr, ProofRegistry: registryAddr, Verifier: verifierAddr } };
  writeFileSync(file, JSON.stringify(data, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


