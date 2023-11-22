import React, { useEffect, useState } from 'react';
import './Auctions.css';
import Web3 from 'web3';
const contractData = require('./contract.json');


function Auctions() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState();
    const [selectedNft, setSelectedNft] = useState(null); // Nouvel état pour le NFT sélectionné
    const [price, setPrice] = useState(0);

    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractData.abi, contractData.contractAddress);
    useEffect(() => {
        web3.eth.getAccounts().then(accounts => {
            setAccount(accounts[0]);
        });
    }, []);

    useEffect(() => {
        if (account) {
            loadNfts().then(nfts => {
                setItems(nfts);
                setLoading(false);
            });
        }
    }, [account]);

    const getTokensOnSale = async () => {
        const tokensOnSale = await contract.methods.allTokensOnSale().call();
        console.log("Tokens on sale: ", tokensOnSale);
    };

    const loadNfts = async () => {
        const listedTokenIds = await contract.methods.allTokensOnSale().call();

        const nftPromises = listedTokenIds.map(async (tokenId) => {
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            console.log(`Fetching NFT data for token ID = ${tokenId}, URI = ${tokenURI}`);

            try {
                // Fetch data from tokenURI
                const response = await fetch(tokenURI);
                // Check if response was successful
                if (!response.ok) {
                    console.error(`HTTP error, status = ${response.status}, URI = ${tokenURI}`);
                    return null;
                }
                const data = await response.json();

                const priceInWei = await contract.methods.getPrice(tokenId).call();
                const price = web3.utils.fromWei(priceInWei.toString(), 'ether');

                return {
                    id: tokenId,
                    price: price, // convert price from wei to ether
                    ...data,
                    listed: true,
                };
            } catch (error) {
                console.error(`Error fetching or parsing JSON from URI = ${tokenURI}, error =`, error);
                return null;
            }
        });

        const nfts = await Promise.all(nftPromises);
        // Filter out any null values from failed fetch requests
        return nfts.filter(nft => nft !== null);
    };



    const selectNft = (nft) => {
        setSelectedNft(nft); // Au lieu d'afficher la console, nous mettons à jour l'état du NFT sélectionné
    };


    const buyNft = async () => {
        if (!selectedNft) {
            console.error("No NFT selected");
            return;
        }
        const priceInWei = web3.utils.toWei(selectedNft.price.toString(), "ether"); // Convert price to wei
        await contract.methods.buyToken(selectedNft.id).send({ from: account, value: priceInWei });
    };


    if (loading) return <div>Loading...</div>;

    // Si un NFT est sélectionné, afficher l'interface de détails
    if (selectedNft) {
        return (
            <div className="mainContainer">
                <div className="nft-info">
                    <h1 className="NFT-title">{selectedNft.name}</h1>
                    <img src={selectedNft.image} alt={selectedNft.name} />
                    <p className="description">{selectedNft.description}</p>
                    <p><strong style={{fontWeight:'700'}}>Owner Address :</strong> XXX</p>
                    <p><strong style={{fontWeight:'700'}}>Creator Address :</strong> XXX</p>
                </div>
                <div className="auction-details">

                    <p className="timer">BUY NFT's on Art Hunters</p>
                    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', padding: '20px', fontSize: '26px', fontFamily:'Helvetica', marginTop:'20px'}}>
                            <p><strong style={{fontWeight:'700', margin:'10px'}}>Current Price :</strong> {selectedNft.price} ETH</p>
                            <p><strong style={{fontWeight:'700', margin:'10px'}}>Taker Fees :</strong> (1.1%) 0.011 ETH</p>
                            <p><strong style={{fontWeight:'700', margin:'10px'}}>Royalties :</strong> 0 ETH</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop:'30px'}}>
                        <p style={{ width: '48%', border: '1px solid #000', padding: '10px', fontSize: '16px' }}>PRICE : {selectedNft.price} ETH</p>
                        <button style={{ width: '48%', border: '1px solid #000', padding: '10px', fontSize: '16px' }} onClick={buyNft}>BUY NFT</button>
                    </div>

                    <h2 className="traits">Traits</h2>
                    <div className="nft-traits" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        border: '1px solid black',
                        padding: '15px'
                    }}>
                        {selectedNft.attributes && selectedNft.attributes.length > 0 && selectedNft.attributes.map((trait, index) => (
                            <div key={index} style={{
                                width: '45%',
                                backgroundColor: '#d3d3d3',
                                padding: '10px',
                                margin: '10px',
                                fontSize: '16px',
                                fontFamily: 'Helvetica',
                                textTransform: 'uppercase',
                                textAlign: 'center'
                            }}>
                                <p>{trait.trait_type}: {trait.value}</p>
                            </div>
                        ))}
                    </div>


                    <button style={{marginTop:'50px'}} className="return" onClick={() => setSelectedNft(null)}>Go back to auctions</button>
                </div>
            </div>

        )
    }

    // Sinon, afficher la liste des NFTs
    return (
        <div className="container">
            <div className="nft-items">
                {items.map((nft, i) => (
                    <div key={i} className="nft-item">
                        <div className="img-container"><img src={nft.image} alt={nft.name} /></div>
                        <div style={{fontSize:'22px', fontFamily:'Helvetica', paddingTop:'10px', paddingBottom:'0px', fontWeight:'700'}}>{nft.name}</div>
                        <div style={{display:'flex', flexDirection:'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems:'center'}}>
                            <p style={{fontSize:'22px', fontFamily:'Helvetica', paddingTop:'22px'}}> PRICE : {nft.price} ETH</p>
                            <a style={{fontSize:'52px',fontWeight:'700', fontFamily:'Helvetica', cursor:'pointer'}} onClick={() => selectNft(nft)}>
                                ...
                            </a>
                        </div>

                    </div>
                ))}
            </div>
        </div>

    );

}

export default Auctions;
