const hre = require("hardhat");

async function main() {
  const TodoList = await hre.ethers.getContractFactory("TodoList");

  // Deploy the contract
  const todoList = await TodoList.deploy();

  // Wait for it to be mined
  await todoList.waitForDeployment();
  const todoListAddress = await todoList.getAddress();

  console.log("✅ TodoList deployed to:", todoListAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
