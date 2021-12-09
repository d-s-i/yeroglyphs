import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import assert from "assert";
import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";

import { mineBlock } from "./helpers.test";
import { passwords } from "./constant.test";

let deployer: SignerWithAddress;
let minter: SignerWithAddress;
let attacker: SignerWithAddress;
let cyberDAO: SignerWithAddress;

let autoglyphs: Contract;
let passwordsContract: Contract;

let tokenURI1: string;
let tokenURI2: string;
let tokenURI3: string;
let tokenURI4: string;
let tokenURI5: string;
let tokenURI6: string;
let tokenURI7: string;

let tokenLimit: BigNumber;
let cyberDAOLimit: BigNumber;

describe("Autoglyph", function () {
  it("Should deploy the contract", async function () {

    [deployer, minter, attacker, cyberDAO] = await ethers.getSigners();

    console.log(`cyberDAO address is ${cyberDAO.address}`);

    const Autoglypgs = await ethers.getContractFactory("Yero");
    autoglyphs = await Autoglypgs.deploy();
    await autoglyphs.deployed();

    console.log(`Autoglyphs address is: ${autoglyphs.address}`);
    assert.ok(autoglyphs.address);
  });

  it("Let cyberDAO mint 15 tokens", async function() {
    await autoglyphs.setIsMintingAllowed(true);
    autoglyphs = autoglyphs.connect(cyberDAO);

    for(let i = 10000 ; i < 10015; i++) {
      await autoglyphs.createGlyph(i, "");
    }

    const cyberDAOBalance = await autoglyphs.balanceOf(cyberDAO.address);

    assert.equal(+cyberDAOBalance, 15);
  });

  // it("Require payement after cyberDAO has minted", async function() {
  //   autoglyphs = autoglyphs.connect(minter);

  //   for(let i = 16; i < 30; i++) {
  //     await autoglyphs.createGlyph(i, "", { value: ethers.utils.parseEther("0.07") })
  //   }
  // });

  // it("Should Mint", async function() {
  //   autoglyphs = autoglyphs.connect(minter);
  //   await autoglyphs.createGlyph(0, "", { value: ethers.utils.parseEther("0.08") });
  //   const owner = await autoglyphs.ownerOf(1);

  //   assert.equal(owner, minter.address);
  // });

  // it("Has tokenURI", async function() {
  //   tokenURI1 = await autoglyphs.tokenURI(1);


  //   await mineBlock(3);
  // });

  // it("Set passwords correctly", async function() {
  //   autoglyphs = autoglyphs.connect(deployer);

  //   await autoglyphs.setPasswords(["test"]);

  //   const password = await autoglyphs.getPasswords("test");

  //   assert.equal(password, true);
  // });

  // it("Mint a Genesis", async function() {
  //   await autoglyphs.createGlyph(1, "test", { value: ethers.utils.parseEther("0.08") });

  //   tokenURI2 = await autoglyphs.tokenURI(2);


  // });

  // it("Show image uri", async function() {
  //   // const rawTokenURI = Buffer.from(tokenURI2.substring(29), "base64").toString();
  //   // // console.log(rawTokenURI);  
  //   // const startImageUriIndex = rawTokenURI.indexOf("8") + 2;
  //   // const endImageUriIndex = rawTokenURI.length - 2;

  //   // const imageURI = rawTokenURI.slice(startImageUriIndex, endImageUriIndex);

  //   // console.log(imageURI);

  //   const defaultIndex = await autoglyphs.tokenIdDefaultIndex(2);
  //   const imageURI = await autoglyphs.viewSpecificTokenURI(2, defaultIndex);

  // });

  it("Mint all NFTs at 0.060606", async function() {
    autoglyphs = autoglyphs.connect(minter);
    for(let i = 0; i < 30; i++) {
      await autoglyphs.createGlyph(i, "", { value: ethers.utils.parseEther("0.0606060") });
    }
    const minterBalance = await autoglyphs.balanceOf(minter.address);
    const totalSupply = await autoglyphs.totalSupply();
    
    assert.equal(+minterBalance, 30);
    assert.equal(+totalSupply, 30);

    try {
      await autoglyphs.createGlyph(31, "", { value: ethers.utils.parseEther("0.0606060") });
      assert.ok(false);
    } catch(error) {
      assert.ok(true);
    }
  });

  it("Mint all NFTs at 0.090909", async function() {
    for(let i = 0; i < 50; i++) {
      const seed = i + 31;
      await autoglyphs.createGlyph(seed, "", { value: ethers.utils.parseEther("0.0909090") });
    } 

    const minterBalance = await autoglyphs.balanceOf(minter.address);
    const totalSupply = await autoglyphs.totalSupply();
    
    assert.equal(+minterBalance, 80);
    assert.equal(+totalSupply, 80);

    try {
      await autoglyphs.createGlyph(81, "", { value: ethers.utils.parseEther("0.0909090") });
      assert.ok(false);
    } catch(error) {
      assert.ok(true);
    }
  });

  it("Mint all NFTs at 0.1010101", async function() {
    
    for(let i = 0; i < 352; i++) {
      const seed = i + 81;
      await autoglyphs.createGlyph(seed, "", { value: ethers.utils.parseEther("0.1010101") });
    }

    const minterBalance = await autoglyphs.balanceOf(minter.address);
    const totalSupply = await autoglyphs.totalSupply();

    assert.equal(+minterBalance, 432);
    assert.equal(+totalSupply, 432);

    try {
      await autoglyphs.createGlyph(433, "", { value: ethers.utils.parseEther("0.1010101") });
      assert.ok(false);
    } catch(error) {
      assert.ok(true);
    }
  });

  it("Mint all NFTs at 0.121212", async function() {
    
    for(let i = 0; i < 50; i++) {
      const seed = i + 433;
      await autoglyphs.createGlyph(seed, "", { value: ethers.utils.parseEther("0.1212121") });
    }

    const minterBalance = await autoglyphs.balanceOf(minter.address);
    const totalSupply = await autoglyphs.totalSupply();
    
    assert.equal(+minterBalance, 482);
    assert.equal(+totalSupply, 482);

    try {
      await autoglyphs.createGlyph(483, "", { value: ethers.utils.parseEther("0.1212121") });
      assert.ok(false);
    } catch(error) {
      assert.ok(true);
    }
  });

  it("Mint all NFTs at 0.131313", async function() {
    for(let i = 0; i < 15; i++) {
      const seed = i + 483;
      await autoglyphs.createGlyph(seed, "", { value: ethers.utils.parseEther("0.13131313") });
    }

    const minterBalance = await autoglyphs.balanceOf(minter.address);
    const totalSupply = await autoglyphs.totalSupply();
    
    assert.equal(+minterBalance, 497);
    assert.equal(+totalSupply, 497);

    try {
      await autoglyphs.createGlyph(498, "", { value: ethers.utils.parseEther("0.13131313") });
      assert.ok(false);
    } catch(error) {
      assert.ok(true);
    }

  });

  // it("cyberDAO mint the rest for free", async function() {
  //   autoglyphs = autoglyphs.connect(cyberDAO);
  //   for(let i = 0; i < 15; i++) {
  //     const seed = i + 498;
  //     await autoglyphs.createGlyphForCyber(seed, "");
  //   }
    
  //   const minterBalance = await autoglyphs.balanceOf(cyberDAO.address);
  //   const totalSupply = await autoglyphs.totalSupply();
    
  //   assert.equal(+minterBalance, 15);
  //   assert.equal(+totalSupply, 512);
  // });

  // it("Doesn't mint any more NFTs", async function() {
  //   try {
  //     await autoglyphs.createGlyphForCyber(68435954135, "", { value: ethers.utils.parseEther("0.3") });
  //     console.log("cyberDAO allowed to mint NFTs and exceeding total supply using createGlyphForCyber");
  //     assert.ok(false);
  //   } catch(error) {
  //     assert.ok(true);
  //   }
  //   try {
  //     await autoglyphs.createGlyph(613535, "", { value: ethers.utils.parseEther("0.3") });
  //     console.log("cyberDAO allowed to mint NFTs and exceeding total supply using createGlyph");
  //     assert.ok(false);
  //   } catch(error) {
  //     assert.ok(true);
  //   }

  //   autoglyphs = autoglyphs.connect(minter);

  //   try {
  //     await autoglyphs.createGlyphForCyber(514354135, "", { value: ethers.utils.parseEther("0.3") });
  //     console.log("Minter allowed to mint NFTs and exceeding total supply using createGlyphForCyber");
  //     assert.ok(false);
  //   } catch(error) {
  //     assert.ok(true);
  //   }
  //   try {
  //     await autoglyphs.createGlyph(354684135, "", { value: ethers.utils.parseEther("0.3") });
  //     console.log("Minter allowed to mint NFTs and exceeding total supply using createGlyph");
  //     assert.ok(false);
  //   } catch(error) {
  //     assert.ok(true);
  //   }
  // });

  // it("Set all Password", async function() {
  //   autoglyphs = autoglyphs.connect(deployer);

  //   await autoglyphs.setPasswords(passwords);
  // });

  // it("Mint all Genesis Yero", async function() {
  //   autoglyphs = autoglyphs.connect(minter);
    
  //   let numTokenMinted = BigNumber.from(0);

  //   for(let i = 0; i < passwords.length; i++) {
  //     let price: BigNumber;
  //     if(numTokenMinted.lt(30)) {
  //       price = await autoglyphs.FIRST_PRICE();
  //     } 
  //     if(numTokenMinted.lt(80)) {
  //       price = await autoglyphs.SECOND_PRICE();
  //     }
  //     if(numTokenMinted.lt(432)) {
  //       price = await autoglyphs.THIRD_PRICE();
  //     }
  //     if(numTokenMinted.lt(482)) {
  //       price = await autoglyphs.FOURTH_PRICE();
  //     }
  //     price = await autoglyphs.FIFTH_PRICE();
      
  //     await autoglyphs.createGlyph(i, passwords[i], { value: price });
  //     numTokenMinted = await autoglyphs.totalSupply();

  //     const rawTokenURI = await autoglyphs.tokenURI(i + 1);

  //     let tokenURI = new Buffer(rawTokenURI.slice(29), 'base64');
  //     // console.log(tokenURI.toString());
  //   }
  // });
  
  // it("Mint All Yero Genesis");
  
  // it("Mint all NFTs for users", async function() {
  //   autoglyphs = autoglyphs.connect(minter);
  //   cyberDAOLimit = await autoglyphs.CYBERDAO_LIMIT();
  //   for(let i = 0; BigNumber.from(i).lt(tokenLimit.sub(cyberDAOLimit)); i++) {
  //     await autoglyphs.createGlyph(i, "", { value: ethers.utils.parseEther("0.08") });
  //   }

  //   const tokenBalance = await autoglyphs.balanceOf(minter.address);
  //   console.log(`token balance of all minters are ${tokenBalance.toString()}`);
    
  //   assert.ok(parseFloat(tokenBalance) === tokenLimit.sub(cyberDAOLimit).toNumber());
  // });

  // it("Mint NFTs for cyberDAO", async function() {
  //   autoglyphs = autoglyphs.connect(cyberDAO);
  //   for(let i = 0; BigNumber.from(i).lt(cyberDAOLimit); i++) {
  //     const seed = 498 + i;
  //     await autoglyphs.createGlyphForCyber(seed, "", { value: ethers.utils.parseEther("0.08") });
  //   }

  //   const tokenBalance = await autoglyphs.balanceOf(cyberDAO.address);
  //   console.log(`token balance of cyberDAO is ${tokenBalance.toString()}`);
    
  //   assert.ok(parseFloat(tokenBalance) === cyberDAOLimit.toNumber());
    
  // });

  // it("Shouldn't mint anymore", async function() {
  //   try {
  //     autoglyphs = autoglyphs.connect(minter);
  //     await autoglyphs.createGlyph(543515135, "", { value: ethers.utils.parseEther("0.08") });
  //     assert.ok(false);
  //   } catch(error) {
  //     console.log(error);
  //     assert.ok(true);
  //   }
  //   try {
  //     autoglyphs = autoglyphs.connect(cyberDAO);
  //     await autoglyphs.createGlyphForCyber(5435415135, "", { value: ethers.utils.parseEther("0.08") });
  //     assert.ok(false);
  //   } catch(error) {
  //     console.log(error);
  //     assert.ok(true);
  //   }
  // });

  // it("View tokenURI correctly", async function() {
  //   tokenURI2 = await autoglyphs.viewSpecificTokenURI(1, 0);

  //   assert.equal(tokenURI1, tokenURI2);
  // });

  // it("Has new tokenURIs", async function() {
  //   tokenURI3 = await autoglyphs.viewCurrentTokenURI(1);

  //   await mineBlock(3);

  //   assert.ok(tokenURI2 !== tokenURI3);
  // });

  // it("Save tokenURI", async function() {
  //   await autoglyphs.saveTokenURI(1);
  //   tokenURI4 = await autoglyphs.viewCurrentTokenURI(1);
  //   tokenURI5 = await autoglyphs.viewSpecificTokenURI(1, 1);

  //   assert.equal(tokenURI4, tokenURI5);
  // });

  // it("Set correctly tokenURI default", async function() {
  //   await autoglyphs.setTokenIdDefaultIndex(1, 1);
  //   await mineBlock(1);

  //   tokenURI6 = await autoglyphs.tokenURI(1);
  //   tokenURI7 = await autoglyphs.viewSpecificTokenURI(1, 1);

  //   assert.equal(tokenURI6, tokenURI7);
  // });

  // it("Forbid someone else to save tokenURIs if he doesn't own the NFT", async function() {
  //   autoglyphs = autoglyphs.connect(attacker);
  //   try {
  //     await autoglyphs.saveTokenURI(1);
  //     assert.ok(false);
  //   } catch (error) {
  //     assert.ok(true);
  //   }
  // });

  // it("Forbid someone else to change defaultTokenURI if he doesn't own the NFT", async function() {
  //   try {
  //     await autoglyphs.setTokenIdDefaultIndex(1, 0);
  //     assert.ok(false);
  //   } catch (error) {
  //     assert.ok(true);
  //   }
  // });

  // it("Mint All NFTs", async function() {
  //   const maxSupply = await autoglyphs.TOKEN_LIMIT();

  //   for(let i = 2; i <= +maxSupply; i++) {
  //     try {
  //       await autoglyphs.createGlyph(i, { value: ethers.utils.parseEther("0.08") });
  //     } catch(error) {
  //       console.log(error);
  //       console.log(`Tx ${i - 1} failed.`);
  //     }
  //   }

  //   const totalSupply = await autoglyphs.totalSupply();

  //   assert.equal(+totalSupply, +maxSupply);

  // });

  // it("Returns the total number of block saved", async function() {
  //   const nbOfBlockSaved = await autoglyphs.totalBlockNumberSaved(1);
  //   console.log(nbOfBlockSaved);
  //   assert.ok(nbOfBlockSaved >= 1);
  // });

});

// describe("Passwords", async function() {
//   it("Deploy the contracts", async function() {
//     const Passwords = await ethers.getContractFactory("Passwords");
//     passwordsContract = await Passwords.deploy();

//     assert.ok(passwordsContract.address !== undefined);

//   });

//   it("Set passwords correctly", async function() {
//     const passwords = ["Test", "Wow"];

//     await passwordsContract.setPasswords(passwords);

//     const isPassword = await passwordsContract.verifyPassword("Test");

//     console.log(isPassword);

//     assert.equal(isPassword, true);
//   });
// });
