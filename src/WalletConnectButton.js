import React, { useState } from "react";
import Web3 from "web3";

function WalletConnectButton({ web3 }) {
    const [accounts, setAccounts] = useState(null);

    const handleClick = async () => {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const newAccounts = await web3.eth.getAccounts();
            setAccounts(newAccounts);
        } catch (error) {
            console.error(error);
        }
    };

    const buttonLabel = accounts
        ? `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
        : "CONNECT WALLET";

    return (
        <button className="walletButton" onClick={handleClick}>
            {buttonLabel}
        </button>
    );
}
export default WalletConnectButton;