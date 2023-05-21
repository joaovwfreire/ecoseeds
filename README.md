# Ecoseeds
This repository contains the smart contracts for the Ecoseeds project.

![Overview](./classDiagram.svg)

## What is Ecoseeds?
Ecoseeds is a Regenerative Finance platform that allows users to create their own ecological projects and fund them with the help of the community. The contract is a token factory launchpad that allows users to create their own tokens and sell them to the community.
Through locking periods, the community has to wait till the project is mature enough to be able to withdraw their funds. This is done to prevent the community from dumping the tokens and to allow the project to grow. Another reason for the locking period is to allow the project to be able to pay back the community. Owners of the project can only withdraw funds once the locking period is over.

The platform is built on top of the Celo blockchain and uses Celo as the main currency. 

The platform is also using Superfluid to allow users to earn interest on their funds and to allow projects to receive funds on a regular basis.


It is a product of the [Celo Camp Accelerator Batch 7](https://www.celocamp.com/) week 4 and during the upcoming week is going to be shipped.

It is also a part of [EcoLand](https://www.ecoland.world) and I do suggest you to check it out.

## Token flow 
1. Deploy token contract
2. Approve unlimited minting to the sales contract
3. Create sale
    a. Mint tokens to the sales contract
    b. Sale configuration
4. Buy tokens
    a. Increase user balance at the sales contract
    b. Setup superfluid token earnings stream
5. Withdraw tokens
    a. Check if lock period is over
    b. Decrease user balance at the sales contract according to the earnings stream
    c. Send tokens to user

## How to generate the class diagram
```bash
yarn add sol2uml
yarn sol2uml class contracts
```

## Tasks 
- [x] Create a repo	
- [x] Create a README.md
- [x] Create a .gitignore
- [x] Create a LICENSE
- [x]  Fix the overview diagram

## License
[Blue Oak Model License 1.0.0](https://blueoakcouncil.org/license/1.0.0)

## Authors
- [JoVi](https://github.com/joaovwfreire)
- [Kevo](https://github.com/fac3m4n)