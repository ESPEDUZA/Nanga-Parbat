
import './App.css';
import React, {Component} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AutoPlay from './slider';
import Carousel from "./carousel";
class App extends Component {
    render() {
        return (
            <div>
                <AutoPlay/>
                <div id="container">
                    <div id="leftbox">
                        <img src="./logo192.png" alt="logo" width="100" height="100"/>
                    </div>
                    <div id="middlebox">
                        <h1 className="title">ART HUNTERS.</h1>
                    </div>
                    <div id="rightbox">
                        <button className="walletButton">CONNECT WALLET</button>
                    </div>

                </div>
                <div className="menu">
                    <button className="menuButton">
                        NFT’S
                    </button>
                    <button className="menuButton">
                        AUCTIONS
                    </button>
                    <button className="menuButton">
                        PROFILE
                    </button>
                </div>
                <div>
                    <h2 className="secondTitle">"TRENDING THIS WEEK"</h2>
                </div>
                <div>
                    <Carousel/>
                </div>
            </div>

        );
    }
}

export default App;

