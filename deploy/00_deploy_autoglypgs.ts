import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "@nomiclabs/hardhat-etherscan";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy } = hre.deployments;
    const chainId = await hre.getChainId();
    const { deployer } = await hre.getNamedAccounts();

    const [signer] = await hre.ethers.getSigners();

    console.log(`Deploying autoglyphs on chain ${chainId}`);

    const deployResult = await deploy("Yeroglyphs", { from: deployer, args: [], log: true });
    const deployResultBis = await deploy("YeroglyphsBis", { from: deployer, args: [], log: true });

    const Yeroglyphs = await hre.ethers.getContractFactory("Yeroglyphs");
    const yeroglyphs = await new hre.ethers.Contract(deployResult.address, Yeroglyphs.interface, signer);

    const YeroglyphsBis = await hre.ethers.getContractFactory("YeroglyphsBis");
    const yeroglyphsBis = await new hre.ethers.Contract(deployResult.address, YeroglyphsBis.interface, signer);

    console.log(`Congrats! Your Yeroglyphs just deployed. You can interact with it at ${deployResult.address}`);
    console.log(`Congrats! Your YeroglyphsBis just deployed. You can interact with it at ${deployResultBis.address}`);

    const mint_tx = await yeroglyphs.createGlyph(0);
    const mint_tx_bis = await yeroglyphsBis.createGlyph(0);

    // await mint_tx.wait(3);
    // await mint_tx_bis.wait(3);

    // if(+chainId === 4) {
    //   try {
    //     await hre.run("verify:verify", {
    //       address: yeroglyphsBis.address,
    //       constructorArguments: []
    //     });
    //   } catch (error) {
    //     console.log(`If the contract didn't verift, run hh verify --network rinkeby ${deployResult.address}`);
    //   }
    // }

    // console.log(`GG you also minted an NFT, here are the token URI: ${await yeroglyphs.tokenURI(1)}`);
    
};
export default func;