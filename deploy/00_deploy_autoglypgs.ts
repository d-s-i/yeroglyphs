import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "@nomiclabs/hardhat-etherscan";

function randomIntFromInterval(min: number, max: number) {  
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy } = hre.deployments;
    const chainId = await hre.getChainId();
    const { deployer } = await hre.getNamedAccounts();

    const [signer] = await hre.ethers.getSigners();

    console.log(`Deploying Yero on chain ${chainId}`);

    const deployResult = await deploy("Yero", { from: deployer, args: [], log: true });

    const Yero = await hre.ethers.getContractFactory("Yero");
    const yero = await new hre.ethers.Contract(deployResult.address, Yero.interface, signer);

    console.log(`Congrats! Your Yero just deployed. You can interact with it at ${deployResult.address}`);

    // try {
    //     for(let i = 0; i <= 8; i++) {
    //         const seed = randomIntFromInterval(0, 100000);
    //         await yero.createGlyph(seed, { value: });
    
    //     }
    // } catch(error) {
    //     console.log(error);
    //     console.log("An error occured during the mint");
    // }

    // await mint_tx_bis.wait(3);

    if(+chainId === 4) {
      try {
        await hre.run("verify:verify", {
          address: yero.address,
          constructorArguments: []
        });
      } catch (error) {
        console.log(`If the contract didn't verift, run hh verify --network rinkeby ${deployResult.address}`);
      }
    }

    // console.log(`GG you also minted 8 NFTs, here are the token URI: ${await yero.tokenURI(1)}`);
    
};
export default func;