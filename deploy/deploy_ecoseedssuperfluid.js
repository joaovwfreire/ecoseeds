// deploy/deploy_ecoseeds.js
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { account0 } = await getNamedAccounts();

    const arguments = ["0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1","0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", "0xb798553db6eb3d3c56912378409370145e97324b"];
    const contract = await deploy("EcoSeedsSuperfluid", {
      from: account0,
      args: ["0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1","0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", "0xb798553db6eb3d3c56912378409370145e97324b"],
      log: true,
    });

    console.log("Contract deployed to:", contract.address)
    
    await verify(contract.address, arguments)

    async function verify(contractAddress, args) {
      console.log("Verifying.......")
    
      try {
        await run("verify:verify", {
          address: contract.address,
          constructorArguments: args,
        })
      } catch (e) {
       
          console.log(e)
      }
    }
  };
  module.exports.tags = ["EcoSeeds"];