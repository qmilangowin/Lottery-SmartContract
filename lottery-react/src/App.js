import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: '',
    message: ''
  };
  //above is equivalent to setting constructor and props. ES2016 update

  //componentDidMount = async () => {
  async componentDidMount() {
    // console.log("Yoyoma");
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    // const [manager, players, balance] = await Promise.all([
    //   lottery.methods.manager().call(),
    //   lottery.methods.getPlayers().call(),
    //   web3.eth.getBalance(lottery.options.address)
    // ]);

    // this.setState({ manager, players, balance });
    this.setState({ manager, players, balance });

    console.log(this.state);
  }

  onSubmit= async (event)=>{
    event.preventDefault(); //??
    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Waiting on transaction success ...'})
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,"ether")
    });

    this.setState({message: "You have been entered!!!"})
  }

  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Waiting on transaction success ...'})
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message: "A winner has been picked! Check your MetaMask account"})
  }

  render() {
    return (
      <div>
        <h2> This is our lottery Contract</h2>
        This contract is managed by {this.state.manager}.
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether.
        </p>
        <hr />
        <form onSubmit = {this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>
          Ready to pick a winner?
        </h4>
        <button onClick={this.onClick}>Pick a winner </button>
        <hr />
        <h1> {this.state.message} </h1>
      </div>
    );
  }
}

export default App;
