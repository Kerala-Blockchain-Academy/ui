import './App.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Web3 from "web3";
import { useState } from 'react';
const MyContractJSON = require("./abi/MyContract.json")

function App() {

  const [inputMsg, setInputMsg] = useState();
  const [outputMsg, setOutPutMsg] = useState();

  const ethereum = window.ethereum;

  const contractAddress = MyContractJSON.networks["5"].address;
  const contractAbi = MyContractJSON.abi;

  const web3 = new Web3(ethereum);

  const myContract = new web3.eth.Contract(contractAbi, contractAddress);

  function msgHandler(event) {
    setInputMsg(event.target.value);
    console.log("Input Msg:", event.target.value)
  }

  async function enableMetaMask() {
    await ethereum.request({ method: "eth_requestAccounts" });
    console.log(ethereum.selectedAddress);
  };

  async function setValue() {
    const txValue = await myContract.methods
      .setMessage(inputMsg)
      .send({ from: ethereum.selectedAddress });
    console.log(txValue);
  };

  async function getValue() {
    const data = await myContract.methods.getMessage().call();
    setOutPutMsg(data);
  }

  return (
    <div className="App">
      <h2>Sample Dapp</h2>
      <Button variant="contained" onClick={enableMetaMask}>Connect to MetaMask</Button>
      <h3>Set Message</h3>
      <TextField
        id="outlined-basic"
        label="Enter Message Value"
        variant="outlined"
        onChange={msgHandler}
      />
      <br />
      <br />
      <Button variant="contained" onClick={setValue}>Set</Button>
      <br />
      <br />
      <h3>Get Message</h3>
      <Button variant="contained" onClick={getValue}>Get</Button>
      <br />
      <br />
      <Typography variant="subtitle1">{outputMsg}</Typography>
    </div>
  )
}

export default App
