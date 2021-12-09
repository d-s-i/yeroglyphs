import hre from "hardhat";

async function verify() {

    const chainId = await hre.getChainId();

    const [signer] = await hre.ethers.getSigners();

    const YeroAddress = "0xe0cf3de5D3aA59b7DAd5868460fB0091DCB4FA2B";

    const Yero = await hre.ethers.getContractFactory("Yero");
    const yero = await new hre.ethers.Contract(YeroAddress, Yero.interface, signer);

    if(+chainId === 4) {
        try {
          await hre.run("verify:verify", {
            address: yero.address,
            constructorArguments: []
          });
        } catch (error) {
          console.log(`If the contract didn't verift, run hh verify --network rinkeby YeroAddress`);
        }
    } else {
        throw new Error(`Not the right chainId, you are on chainId: ${chainId}`);
    }
    
}

verify();