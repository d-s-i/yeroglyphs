import hre from "hardhat";

export async function mineBlock(blockToMine: number) {
    for(let i = 0; i <= blockToMine; i++) {
        await hre.network.provider.request({
            method: "evm_mine",
            params: [],
        });
    }
}