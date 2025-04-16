import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import TodoListABI from "../contracts/utils/abi.json";
import React from "react";

// const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // or process.env if CRA

function App() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!walletClient) return;

    const signer = new ethers.providers.Web3Provider(walletClient.transport).getSigner();
    const _contract = new ethers.Contract(contractAddress, TodoListABI, signer);
    setContract(_contract);
    loadTasks(_contract);
  }, [walletClient]);

  const loadTasks = async (_contract) => {
    const count = await _contract.taskCount();
    const items = [];
    for (let i = 1; i <= count; i++) {
      const task = await _contract.getTask(i);
      items.push({ id: task[0], content: task[1], completed: task[2] });
    }
    setTasks(items);
  };

  const createTask = async () => {
    const tx = await contract.createTask(input);
    await tx.wait();
    setInput("");
    loadTasks(contract);
  };

  const toggleTask = async (id) => {
    const tx = await contract.toggleCompleted(id);
    await tx.wait();
    loadTasks(contract);
  };

  return (
    <div className="App">
      <h1>📝 Ethereum To-Do List</h1>
      <ConnectButton />
      {isConnected && (
        <>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={createTask}>Add Task</button>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <span
                  style={{ textDecoration: task.completed ? "line-through" : "none", cursor: "pointer" }}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.content}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

