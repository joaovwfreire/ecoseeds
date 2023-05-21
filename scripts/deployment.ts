import hre from "hardhat";

async function main() {

    const EcoSeeds = await hre.ethers.getContractFactory("EcoSeeds");
    const ecoseeds = await EcoSeeds.deploy("0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1");

    await ecoseeds.deployed();

    console.log("EcoSeeds deployed to:", ecoseeds.address);
}

main()