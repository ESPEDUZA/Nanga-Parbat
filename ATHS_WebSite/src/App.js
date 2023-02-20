import "./App.css";
import React, { Component } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AutoPlay from "./slider";
import Carousel from "./carousel";
import Web3 from "web3";
import WalletConnectButton from "./WalletConnectButton";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            accounts: null,
        };
    }

    async componentDidMount() {
        if (window.ethereum) {
            try {
                // Request account access if needed
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                this.setState({ web3, accounts });
            } catch (error) {
                console.error(error);
            }
        }
    }
  render() {
      const { accounts } = this.state;
      const buttonLabel = accounts
          ? `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
          : "CONNECT WALLET";
    return (
      <div>
        <AutoPlay />
        <div id="container">
          <div id="leftbox">
            <img src="./logo192.png" alt="logo" width="100" height="100" />
          </div>
          <div id="middlebox">
            <h1 className="title">ART HUNTERS.</h1>
          </div>
            <div id="rightbox">
                <button className="walletButton" onClick={async () => {
                    try {
                        await window.ethereum.request({ method: "eth_requestAccounts" });
                        const web3 = new Web3(window.ethereum);
                        const accounts = await web3.eth.getAccounts();
                        this.setState({ web3, accounts });
                    } catch (error) {
                        console.error(error);
                    }
                }}>{buttonLabel}</button>
            </div>
        </div>
        <div className="menu">
          <button className="menuButton">NFT’S</button>
          <button className="menuButton">AUCTIONS</button>
          <button className="menuButton">PROFILE</button>
        </div>
        <div>
          <h2 className="secondTitle">"TRENDING THIS WEEK"</h2>
        </div>
        <div>
          <Carousel />
        </div>
      </div>
    );
  }
}

export default App;
