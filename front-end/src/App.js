import Web3 from "web3";
import { useState } from 'react';
const Hello = require("./abi/Hello.json")

function App() {

  const [inputMsg, setInputMsg] = useState();
  const [outputMsg, setOutPutMsg] = useState();

  const ethereum = window.ethereum;

  const contractAddress = Hello.networks["5777"].address;
  const contractAbi = Hello.abi;

  const web3 = new Web3(ethereum);
  const myContract = new web3.eth.Contract(contractAbi, contractAddress);

  async function enableMetaMask() {
    let accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(`Connected to ${accounts[0]}!`);
  };

  function msgHandler(event) {
    setInputMsg(event.target.value);
    console.log("Input Msg:", event.target.value)
  }

  async function setValue() {
    let accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);
    const txValue = await myContract.methods
      .setMessage(inputMsg).encodeABI();

    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: contractAddress,
          gas: '0x76c0', // 30400
          gasPrice: '0x9184e72a000', // 10000000000000
          value: '0x00', // 2441406250
          data: txValue,
        },
      ],
    })

  };

  async function getValue() {
    const data = await myContract.methods.getMessage().call();
    setOutPutMsg(data);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <p className="font-bold text-2xl py-4" id="greetingTxt">Sample Dapp</p>
      <button onClick={enableMetaMask} className="border border-gray-600 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
        Connect to MetaMask
      </button>
      <p className="font-bold text-xl py-4" id="greetingTxt">Set Message</p>
      <input type="text" onChange={msgHandler} placeholder="Enter Message Value" className="border border-gray-400 py-2 px-6 rounded" /> <br />
      <button onClick={setValue} className="border border-gray-600 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
        Set
      </button>
      <p className="font-bold text-xl py-4" id="greetingTxt">Get Message</p>
      <button onClick={getValue} className="border border-gray-600 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
        Get
      </button>
      <p className="font-bold text-m py-4" id="greetingTxt">{outputMsg}</p>
    </div>
  );
}

export default App;
