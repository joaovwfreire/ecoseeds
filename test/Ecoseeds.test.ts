import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ecoseeds", () => {
    let ecoseeds;
    let owner;
    let signers;
    let nctOwner;
    let nct;
    let oracle; 
    let soldTokenOwner;
    let lockInEnd;
    let soldTokenAddress;
    const limit = ethers.utils.parseEther("1000");
    
    before(async () => {
        signers = await ethers.getSigners();
        owner = signers[0];
        oracle = signers[1];
        nctOwner = signers[2];
        soldTokenOwner = signers[3];

     });

    beforeEach(async () => {
        const nctFactory = await ethers.getContractFactory("MintableERC20");
        nct = await nctFactory.connect(nctOwner).deploy("NCTMock", "NCT", 18);
        await nct.deployed();
        
        const Ecoseeds = await ethers.getContractFactory("EcoSeeds");
        ecoseeds = await Ecoseeds.deploy(nct.address, oracle.address);
        await ecoseeds.deployed();

            // NOW TIMESTAMP in seconds
            const now = Math.floor(Date.now() / 1000);
            // lockInEnd in 1 day
            lockInEnd = now + 86400;
            // create a new sale
            const tx = await ecoseeds.connect(soldTokenOwner).createSale( ethers.utils.parseEther("0.0001"), lockInEnd, limit, false, "EcoSeeds Token 1", "EST1");
            const receipt = await tx.wait();
            const event = receipt.events;
            expect(event[1].event).to.equal("SaleCreated");
            
            soldTokenAddress = event[1].args[5];

    });

    describe("Deployment", () => {

        it("Should set the right owner", async () => {
            expect(await ecoseeds.owner()).to.equal(owner.address);
        });

        it("Should set the right NCT address", async () => {
            expect(await ecoseeds.nct()).to.equal(nct.address);
        });

        it("Should set the right NCT oracle address", async () => {
            expect(await ecoseeds.nctOracle()).to.equal(oracle.address);
        });

    });
    describe("Create new sales", () => {
        
        it("Should set the correct sales parameters", async () => {
            const sale = await ecoseeds.Sales(soldTokenAddress);
            expect(sale.owner).to.equal(soldTokenOwner.address);
            expect(sale.acceptsNct).to.equal(false);
            expect(sale.pricePerUnitInNativeToken).to.equal(ethers.utils.parseEther("0.0001"));
            expect(sale.lockInEnd).to.equal(lockInEnd);
            expect(sale.maxAmount).to.equal(limit);
            expect(sale.sold).to.equal(0);
        });

        it("Should create a token", async () => {
            
            const newToken = await ethers.getContractAt("MintableERC20", soldTokenAddress);
            expect(await newToken.name()).to.equal("EcoSeeds Token 1");
            expect(await newToken.symbol()).to.equal("EST1");
            expect(await newToken.decimals()).to.equal(18);
            expect(await newToken.totalSupply()).to.equal(limit);
        });

        it("Should not allow to create a new sale with the same token", async () => {
            // This test always passes, because the contract always deploys a new token
            // Gonna leave it anyway so I don't forget to test it when I implement the option of using an existing token
        });


    });
    describe("Finishing sales", () => {
        it("Should finish the sales at anytime", async () => {

            const tx = await ecoseeds.connect(soldTokenOwner).finishSale(soldTokenAddress);
            const receipt = await tx.wait();
            const event = receipt.events;
            expect(event[0].event).to.equal("SaleFinished");
            const sale = await ecoseeds.Sales(soldTokenAddress);
            expect(sale.sold).to.equal(limit.add(1));
        });
    });
    describe("Withdrawing tokens", () => {
        
        it("Should not withdraw tokens before lock period is over", async () => {});

        it("Should withdraw tokens after lock period is over", async () => {});
    });
    describe("Burning tokens", () => {});
    describe("Claiming tokens", () => {});
    describe("Admin", () => {
        describe("Admin withdraw", () => {});
        describe("Oracle setup", () => {});
        describe("NctSetup", () => {});
    });

});