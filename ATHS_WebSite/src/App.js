import "./App.css";
import React, {Component, useState} from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AutoPlay from "./slider";
import Carousel from "./carousel";

import NFTpage from "./NFTpage";
import Web3 from "web3";
import {BrowserRouter, Switch, Route, Link, Routes, useLocation} from "react-router-dom";
import WalletConnectButton from "./WalletConnectButton";
import NftPage from "./NFTpage";
import auctionsPages from "./auctionsPages";
import CustomNFT from "./CustomNFT";
import Auctions from "./Auctions";
import NotFound from "./NotFound";


function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);

    async function connectWallet() {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            setWeb3(web3);
            setAccounts(accounts);
        } catch (error) {
            console.error(error);
        }
    }

    const location = useLocation();
    const isNftsRoute = location.pathname === "/nfts";
    const isCustomNftRoute = location.pathname === "/customnft";
    const isAuctionsRoute = location.pathname === "/auctions"

    const buttonLabel = accounts
        ? `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
        : "CONNECT WALLET";

    return (
        <div>
            <AutoPlay />
            <div id="container">
                <Link to="/">
                    <div id="leftbox">
                        <img src="./Art_Hunters.png" alt="logo" width="120" height="120" />
                    </div>
                </Link>
                <div id="middlebox">
                    <h1 className="title">ART HUNTERS.</h1>
                </div>
                <div id="rightbox">
                    <button className="walletButton" onClick={connectWallet}>
                        {buttonLabel}
                    </button>
                </div>
            </div>
            <div className="menu">
                <Link to="/nfts">
                    <button className="menuButton">NFT’S</button>
                </Link>
                <Link to="/auctions">
                    <button className="menuButton">AUCTIONS</button>
                </Link>
                <Link to="/customnft">
                    <button className="menuButton">CUSTOM NFT</button>
                </Link>

            </div>
            <div>
                <h2 className="secondTitle">{isNftsRoute ? "Your NFT's" : "TRENDING THIS WEEK"+ isCustomNftRoute ? "MINT YOUR OWN NFT !" : "TRENDING THIS WEEK" } </h2>
            </div>

            <Routes>
                <Route path="/" element={<Carousel />} />
                <Route path="/nfts" element={<NftPage account={accounts} />} />
                <Route path="/customnft" element={<CustomNFT account={accounts} />} />
                <Route path="/auctions" element={<Auctions/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </div>
    );
}

export default App;
