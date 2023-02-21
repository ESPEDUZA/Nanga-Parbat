import React, { Component, useState, useEffect } from "react";
import Slider from "react-slick";
import './slider.css';



export default class AutoPlay extends Component {

    state = {
        btcPrice: null,
        ethPrice: null,
    }

    componentDidMount() {
        const fetchData = async () => {
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd");
            const data = await response.json();
            this.setState({
                btcPrice: data.bitcoin.usd,
                ethPrice: data.ethereum.usd,
            });
        };
        fetchData();
    }

    render() {

        const settings = {
            infinite: true,
            slidesToShow: 3,
            autoplay: true,
            speed: 6000,
            autoplaySpeed: 0,
            cssEase: "linear"
        };

        return (

            <div className="divSlider">
                <Slider {...settings}>
                    <div>
                        <p className="txt">ETH : {this.state.ethPrice} $</p>
                    </div>
                    <div>
                        <p className="txt">BTC : {this.state.btcPrice} $</p>
                    </div>
                    <div>
                        <p className="txt">LAST 24H VOLUME : 57K ETH</p>
                    </div>
                    <div>
                        <p className="txt">NEW : LAST COLLECTION FROM DeLABS IS NOW LIVE ON ATH</p>
                    </div>
                </Slider>
            </div>
        );
    }
}