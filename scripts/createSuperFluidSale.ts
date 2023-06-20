import hre from "hardhat";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";


async function main() {
    // get the EcoSeedsSuperFluid contract at the deployed address
    const EcoSeedsSuperFluid = await ethers.getContractFactory("EcoSeedsSuperfluid");
    const ecoseedsSuperFluid = await EcoSeedsSuperFluid.attach("0xdd415e9dA1052176a6b9e4fd1C769e6a5E3988eb");

    // create a new sale
    // NOW TIMESTAMP in seconds
    const now = Math.floor(Date.now() / 1000);
    // lockInEnd in 1 day
    let lockInEnd = now + 86400;

    const limit = ethers.utils.parseEther("100000");

    const newSale = await ecoseedsSuperFluid.createSale( ethers.utils.parseEther("0.1"), lockInEnd, limit, false, "EcoSeeds Token", "EST");
    const receipt = await newSale.wait();
    const underlyingToken = receipt.events[5].args.underlyingToken;
    const superToken = receipt.events[5].args.superToken;
    console.log("Underlying token deployed at: ", underlyingToken)
    console.log("Super token deployed at: ", superToken)

    // verify the underlying token not working atm
    await hre.run("verify:verify", {
        address: underlyingToken,
        constructorArguments: [
            "EcoSeeds Token",
            "EST",
            18],
    });
    console.log("New sale created!");
}

main()