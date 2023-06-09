import { ethers } from "hardhat";
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";

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
    let purchaser;

    const limit = ethers.utils.parseEther("100000");
    
    before(async () => {
        signers = await ethers.getSigners();
        owner = signers[0];
        oracle = signers[1];
        nctOwner = signers[2];
        soldTokenOwner = signers[3];
        purchaser = signers[4];

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
            const tx = await ecoseeds.connect(soldTokenOwner).createSale( ethers.utils.parseEther("0.1"), lockInEnd, limit, false, "EcoSeeds Token 1", "EST1");
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
            expect(sale.pricePerUnitInNativeToken).to.equal(ethers.utils.parseEther("0.1"));
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
            // Gonna leave it anyway so I don't forget to test it when I implement the existing token option
        });


    });
    describe("Finishing sales", () => {
        it("Should finish the sales at anytime", async () => {

            const tx = await ecoseeds.connect(soldTokenOwner).finishSale(soldTokenAddress);
            const receipt = await tx.wait();
            const event = receipt.events;
            expect(event[0].event).to.equal("SaleFinished");
            const sale = await ecoseeds.Sales(soldTokenAddress);
            expect(sale.open).to.equal(false);
        });
    });

    describe("Buying tokens", () => {

        it ("Should buy tokens with native token", async () => {

            const initialBalance = await ecoseeds.balances(soldTokenAddress, purchaser.address);
            expect (initialBalance).to.equal(0);
            await ecoseeds.connect(purchaser).buyTokens(soldTokenAddress, {value: ethers.utils.parseEther("1")});
        
            const sale = await ecoseeds.Sales(soldTokenAddress);
            const pricePerUnitInNativeToken = sale.pricePerUnitInNativeToken;

            const finalBalance = await ecoseeds.balances(soldTokenAddress, purchaser.address);
            expect (finalBalance).to.equal(await ethers.utils.parseEther("1").div(pricePerUnitInNativeToken));
        });

        it ("Should buy tokens with NCT", async () => {
            
            // Don't forget to test it when I implement the purchase with NCT option
        });
    });
    describe("Withdrawing tokens", () => {
        
        it("Should not withdraw tokens before lock period is over", async () => {

            await expect(ecoseeds.connect(purchaser).withdrawTokens(soldTokenAddress, ethers.utils.parseEther("1"))).to.be.revertedWith("Not enough tokens to withdraw");
       
            await ecoseeds.connect(purchaser).buyTokens(soldTokenAddress, {value: ethers.utils.parseEther("1")});
            
            const sale = await ecoseeds.Sales(soldTokenAddress);
            const pricePerUnitInNativeToken = sale.pricePerUnitInNativeToken;
            await expect(ecoseeds.connect(purchaser).withdrawTokens(soldTokenAddress, await ethers.utils.parseEther("1").div(pricePerUnitInNativeToken))).to.be.revertedWith("Lock period not over yet");
       
        });

        it("Should withdraw tokens after lock period is over", async () => {

            await ecoseeds.connect(purchaser).buyTokens(soldTokenAddress, {value: ethers.utils.parseEther("1")});
            
            const sale = await ecoseeds.Sales(soldTokenAddress);
            const pricePerUnitInNativeToken = sale.pricePerUnitInNativeToken;
            await expect(ecoseeds.connect(purchaser).withdrawTokens(soldTokenAddress, await ethers.utils.parseEther("1").div(pricePerUnitInNativeToken))).to.be.revertedWith("Lock period not over yet");
       
            await time.increase(86401);

            const soldToken = await ethers.getContractAt("MintableERC20", soldTokenAddress);
            const initialBalance = await soldToken.balanceOf(purchaser.address);
            expect(initialBalance).to.equal(0);

            await ecoseeds.connect(purchaser).withdrawTokens(soldTokenAddress, await ethers.utils.parseEther("1").div(pricePerUnitInNativeToken));

            const finalBalance = await soldToken.balanceOf(purchaser.address);
            expect(finalBalance).to.equal(await ethers.utils.parseEther("1").div(pricePerUnitInNativeToken));
        });
    });

    describe("Claiming earnings", () => {

        it ("Should not claim earnings with open sale", async () => {
            await expect(ecoseeds.connect(soldTokenOwner).claimEarnings(soldTokenAddress)).to.be.revertedWith("Sale still ongoing");
        })
        it ("Should claim earnings with closed sale", async () => {
            const initialBalance = await ethers.provider.getBalance(soldTokenOwner.address);

            await ecoseeds.connect(purchaser).buyTokens(soldTokenAddress, {value: ethers.utils.parseEther("1")});
        
            await ecoseeds.connect(soldTokenOwner).finishSale(soldTokenAddress);
            await ecoseeds.connect(soldTokenOwner).claimEarnings(soldTokenAddress);
            const finalBalance = await ethers.provider.getBalance(soldTokenOwner.address);
            expect(finalBalance).to.greaterThan(initialBalance);
        })
    });

    describe("Admin", () => {
        describe("Admin withdraw", () => {
            it("Should not allow non-admin to withdraw", async () => {
                await expect(ecoseeds.connect(purchaser).adminWithdraw()).to.be.revertedWith("Only owner can withdraw");
            });
            it("Should allow admin to withdraw", async () => {
                const initialBalance = await ethers.provider.getBalance(owner.address);
                await ecoseeds.connect(purchaser).buyTokens(soldTokenAddress, {value: ethers.utils.parseEther("1")});
                await ecoseeds.connect(owner).adminWithdraw();
                const finalBalance = await ethers.provider.getBalance(owner.address);
                expect(finalBalance).to.greaterThan(initialBalance);
            });
        });
        describe("Admin fee management", () => {
            it("Should not allow non-admin to change fee", async () => {
                await expect(ecoseeds.connect(purchaser).setFee(8)).to.be.revertedWith("Only owner can set fee");
            });
            it("Should allow admin to change fee", async () => {
                await ecoseeds.connect(owner).setFee(8);
                expect(await ecoseeds.fee()).to.equal(8);
            });
        });
        describe("Oracle setup", () => {
            it("Should not allow non-admin to set oracle", async () => {
                await expect(ecoseeds.connect(purchaser).setOracle(signers[8].address)).to.be.revertedWith("Only owner can set oracle");
            });
            it("Should allow admin to set oracle", async () => {
                await ecoseeds.connect(owner).setOracle(signers[8].address);
                expect(await ecoseeds.nctOracle()).to.equal(signers[8].address);
            });
        });
        describe("NctSetup", () => {
            it("Should not allow non-admin to set NCT", async () => {
                await expect(ecoseeds.connect(purchaser).setNct(signers[7].address)).to.be.revertedWith("Only owner can set NCT");
            });
            it("Should allow admin to set NCT", async () => {
                await ecoseeds.connect(owner).setNct(signers[7].address);
                expect(await ecoseeds.nct()).to.equal(signers[7].address);
            });
        });
    });

});