import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "@nomiclabs/hardhat-etherscan";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy } = hre.deployments;
    const chainId = await hre.getChainId();
    const { deployer } = await hre.getNamedAccounts();

    const [signer] = await hre.ethers.getSigners();

    console.log(`Deploying autoglyphs on chain ${chainId}`);

    const deployResult = await deploy("Yero", { from: deployer, args: [], log: true });

    const Yero = await hre.ethers.getContractFactory("Yero");
    
    const yero = await new hre.ethers.Contract(deployResult.address, Yero.interface, signer);

    console.log(`Congrats! Your Yero just deployed. You can interact with it at ${deployResult.address}`);

    const mint_tx = await yero.createGlyph(0);

    await mint_tx.wait(3);

    try {
      await hre.run("verify:verify", {
        address: yero.address,
        constructorArguments: []
      });
    } catch (error) {
      console.log(`If the contract didn't verift, run hh verify --network rinkeby ${deployResult.address}`);
    }

    console.log(`GG you also minted an NFT, here are the token URI: ${await yero.tokenURI(1)}`);
    
};
export default func;