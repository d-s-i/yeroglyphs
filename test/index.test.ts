import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import assert from "assert";
import hre, { ethers } from "hardhat";
import { Contract } from "ethers";

import { mineBlock } from "./helpers.test";

let deployer: SignerWithAddress;
let minter: SignerWithAddress;
let attacker: SignerWithAddress;

let autoglyphs: Contract;

let tokenURI1: string;
let tokenURI2: string;
let tokenURI3: string;
let tokenURI4: string;
let tokenURI5: string;
let tokenURI6: string;
let tokenURI7: string;

describe("Autoglyph", function () {
  it("Should deploy the contract", async function () {

    [deployer, minter, attacker] = await ethers.getSigners();

    const Autoglypgs = await ethers.getContractFactory("Autoglyphs");
    autoglyphs = await Autoglypgs.deploy();
    await autoglyphs.deployed();

    console.log(`Autoglyphs address is: ${autoglyphs.address}`);
    assert.ok(autoglyphs.address);
  });

  it("Should Mint", async function() {
    autoglyphs = autoglyphs.connect(minter);
    await autoglyphs.createGlyph(0);
    const owner = await autoglyphs.ownerOf(1);

    assert.equal(owner, minter.address);
  });

  it("Has tokenURI", async function() {
    tokenURI1 = await autoglyphs.tokenURI(1);

    await mineBlock(3);
  });

  it("View tokenURI correctly", async function() {
    tokenURI2 = await autoglyphs.viewSpecificTokenURI(1, 0);

    assert.equal(tokenURI1, tokenURI2);
  });

  it("Has new tokenURIs", async function() {
    tokenURI3 = await autoglyphs.viewCurrentTokenURI(1);

    await mineBlock(3);

    assert.ok(tokenURI2 !== tokenURI3);
  });

  it("Save tokenURI", async function() {
    await autoglyphs.saveTokenURI(1);
    tokenURI4 = await autoglyphs.viewCurrentTokenURI(1);
    tokenURI5 = await autoglyphs.viewSpecificTokenURI(1, 1);

    assert.equal(tokenURI4, tokenURI5);
  });

  it("Set correctly tokenURI default", async function() {
    await autoglyphs.setTokenIdDefaultIndex(1, 1);
    await mineBlock(1);

    tokenURI6 = await autoglyphs.tokenURI(1);
    tokenURI7 = await autoglyphs.viewSpecificTokenURI(1, 1);

    assert.equal(tokenURI6, tokenURI7);
  });

  it("Forbid someone else to save tokenURIs if he doesn't own the NFT", async function() {
    autoglyphs = autoglyphs.connect(attacker)
    try {
      await autoglyphs.saveTokenURI(1);
      assert.ok(false);
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Forbid someone else to change defaultTokenURI if he doesn't own the NFT", async function() {
    try {
      await autoglyphs.setTokenIdDefaultIndex(1, 0);
      assert.ok(false);
    } catch (error) {
      assert.ok(true);
    }
  });

});
