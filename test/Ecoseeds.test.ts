import { ethers } from "hardhat";
import { expect } from "chai";
const { Framework } = require("@superfluid-finance/sdk-core");
const { deployTestFramework } = require("@superfluid-finance/ethereum-contracts/dev-scripts/deploy-test-framework");
const TestToken = require("@superfluid-finance/ethereum-contracts/build/contracts/TestToken.json");

let sfDeployer;
let contractsFramework;
let sf;
let moneyRouter;
let superTokenDeployerAddress;

describe("Ecoseeds", () => {
    let ecoseeds;
    let owner;
    let signers;
    let tokenOwner;
    let token;
    let oracle; 
    let superTokenDeployerAddress;
    
    before(async () => {
        signers = await ethers.getSigners();
        owner = signers[0];
        oracle = signers[1];
        tokenOwner = signers[2];

        sfDeployer = await deployTestFramework();
        contractsFramework = await sfDeployer.frameworkDeployer.getFramework();
        sf = await Framework.create({
            chainId: 31337,
            provider: owner.provider,
            resolverAddress: contractsFramework.resolver,
            protocolReleaseVersion: "test"
        });


        superTokenDeployerAddress = await sfDeployer.superTokenDeployer.address;
    });

    beforeEach(async () => {
        const Token = await ethers.getContractFactory("MintableERC20");
        token = await Token.connect(tokenOwner).deploy("NCTMock", "NCT", 18);
        await token.deployed();
        
        const Ecoseeds = await ethers.getContractFactory("EcoSeeds");
        ecoseeds = await Ecoseeds.deploy(token.address, oracle.address, superTokenDeployerAddress);
        await ecoseeds.deployed();

    });

    describe("Deployment", () => {

        it("Should set the right owner", async () => {
            expect(await ecoseeds.owner()).to.equal(owner.address);
        });

        it("Should set the right NCT address", async () => {
            expect(await ecoseeds.nct()).to.equal(token.address);
        });

        it("Should set the right NCT oracle address", async () => {
            expect(await ecoseeds.nctOracle()).to.equal(oracle.address);
        });

        it("Should set the right Super Token Factory address", async () => {
            expect(await ecoseeds.superTokenFactory()).to.equal(superTokenDeployerAddress);
        });


    });
    describe("Create new sales", () => {
        describe("From new token", () => {});
        describe("From existing token", () => {});
    });
    describe("Finishing sales", () => {});
    describe("Withdrawing tokens", () => {});
    describe("Burning tokens", () => {});
    describe("Claiming tokens", () => {});
    describe("Admin", () => {
        describe("Admin withdraw", () => {});
        describe("Oracle setup", () => {});
        describe("NctSetup", () => {});
    });

});