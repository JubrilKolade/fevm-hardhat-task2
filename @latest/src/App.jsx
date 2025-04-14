import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoListABI from "./contract/TodoListABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const init = async () => {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = _provider.getSigner();
      const _contract = new ethers.Contract(contractAddress, TodoListABI, _signer);
      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
      loadTasks(_contract);
    };
    init();
  }, []);

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
    </div>
  );
}

export default App;
