import { ethers } from "hardhat";
import { expect } from "chai";

describe("Ecoseeds", () => {
    let ecoseeds;
    let owner;
    let signers;
    
    beforeEach(async () => {

        signers = await ethers.getSigners();
        owner = signers[0];
        const Ecoseeds = await ethers.getContractFactory("Ecoseeds");
        ecoseeds = await Ecoseeds.deploy();
    });

    describe("Deployment", () => {});
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