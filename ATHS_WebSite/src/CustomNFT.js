import React, { useState, useCallback } from 'react';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import './CustomNft.css';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const provider = new Web3Provider(window.ethereum);

const CustomNFT = ({ account }) => {
    const [tokenURI, setTokenURI] = useState('');
    const [contractAddress] = useState('0xYourContractAddress');
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState('');
    const [traits, setTraits] = useState('');

    const handleDrop = useCallback((event) => {
        event.preventDefault();

        const [file] = event.dataTransfer.files;
        if (!file) return;

        setFile(file);
        setDragging(false);

        const reader = new FileReader();
        reader.onloadend = async function () {
            const buffer = Buffer.from(reader.result);
            const result = await ipfs.add(buffer);
            setTokenURI('https://ipfs.infura.io/ipfs/' + result.path);
        };
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            setPreview(reader.result);
        };
    }, []);

    const handleDragEnter = useCallback((event) => {
        event.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setDragging(false);
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
    }, []);

    const mintNFT = async () => {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, [
            'function mintNFT(address recipient, string memory tokenURI, string memory name, string memory traits) public returns (uint256)',
        ], signer);
        const transaction = await contract.mintNFT(account, tokenURI, name, traits);
        await transaction.wait();
    };

    return (
        <div className="custom">
            <div
                className={`drag-drop-area${dragging ? ' dragging' : ''}`}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="image-preview" />
                ) : dragging ? (
                    <p>Drop your file here</p>
                ) : (
                    <p>Drag a file here to upload, or click to select a file</p>
                )}
            </div>
            <div className="nft-options">
                <input
                    placeholder="Name of NFT"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    placeholder="Traits of NFT"
                    value={traits}
                    onChange={e => setTraits(e.target.value)}
                />
            </div>
            <button className="mint-button" onClick={mintNFT}>Mint NFT</button>
        </div>
    );
};

export default CustomNFT;
