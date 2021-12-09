import { ethers } from "hardhat";

function randomIntFromInterval(min: number, max: number) {  
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function main() {

  const yeroAddress = "0x141344C017B63550aA73088A4F19601f79f37255";

  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();

  console.log(`Minting on chain ${chainId} (should be 4 for rinkeby)`);

  const Yero = await ethers.getContractFactory("Yero");
  const yero = await new ethers.Contract(yeroAddress, Yero.interface, signer);

  const price = await yero.FOURTH_PRICE();

  try {
    for(let i = 0; i < 40; i++) {
        const seed = randomIntFromInterval(0, 1000000);
        await yero.createGlyph(seed, "", { value: price });
        console.log(`${i + 1} mint done.`);
    }
  } catch(error) {
      console.log(error);
      console.log("An error occured during the mint");
  }

  console.log("Mint finished");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
