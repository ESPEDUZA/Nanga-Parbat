import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './Auctions.css';
import contractData from "./contract.json";
import {getAllByAltText} from "@testing-library/react";


function MyNfts() {

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
        const tokenIds = await contract.methods.tokensOfOwner(account).call();
        const listedTokenIds = new Set(await contract.methods.allTokensOnSale().call());

        const nftPromises = tokenIds.map(async (tokenId) => {
            const tokenURI = await contract.methods.tokenURI(tokenId).call();

            // Fetch data from tokenURI
            const response = await fetch(tokenURI);
            const data = await response.json();

            return {
                id: tokenId,
                ...data,
                listed: listedTokenIds.has(tokenId),
            };
        });

        const nfts = await Promise.all(nftPromises);
        return nfts;
    };

    const sellNft = (nft) => {
        setSelectedNft(nft); // Au lieu d'afficher la console, nous mettons à jour l'état du NFT sélectionné
    };
    const unlistNft = async () => {
        if (!selectedNft) {
            console.error('selectedNft is not defined!');
            return;
        }
        contract.methods.removeFromSale(selectedNft.id).send({ from: account })
            .on('transactionHash', (hash) => {
                console.log('Transaction sent with hash: ', hash);
            })
            .on('receipt', async (receipt) => {
                console.log('Transaction has been confirmed with receipt: ', receipt);
                console.log(`NFT ${selectedNft.id} is now unlisted.`);

                // Log all tokens on sale
                console.log(getTokensOnSale());

                // Optionally, you could also refresh the NFTs in the UI
                loadNfts().then(nfts => {
                    setItems(nfts);
                });
            })
            .on('error', (error) => {
                console.log('Transaction failed with error: ', error);
            });
    };
    const listNft = async () => {
        if (!selectedNft || !price) {
            console.error('selectedNft or price is not defined!');
            return;
        }
        console.log("selectedNft.id: ", selectedNft.id); // for debugging
        console.log("price: ", price); // for debugging
        const etherPrice = web3.utils.toWei(price, 'ether');
        console.log("etherPrice: ", etherPrice); // for debugging

        contract.methods.setForSale(selectedNft.id, etherPrice).send({ from: account })
            .on('transactionHash', (hash) => {
                // You can do something when the transaction is sent, like displaying a message
                console.log('Transaction sent with hash: ', hash);
            })
            .on('receipt', async (receipt) => {
                // You can do something when the transaction is confirmed, like displaying a message
                console.log('Transaction has been confirmed with receipt: ', receipt);

                // Check if the NFT is now listed for the expected price

                console.log(`NFT ${selectedNft.id} is now listed for ${price} ETH.`);



                // Log all tokens on sale
                console.log(getTokensOnSale());

                // Optionally, you could also refresh the NFTs in the UI
                loadNfts().then(nfts => {
                    setItems(nfts);
                });
            })
            .on('error', (error) => {
                // You can do something when the transaction failed, like displaying a message
                console.log('Transaction failed with error: ', error);
            });
    };


    if (loading) return <div>Loading...</div>;
    if (items.length === 0) return <h1>No items in wallet</h1>;


    // Si un NFT est sélectionné, afficher l'interface de détails
    if (selectedNft) {
        return (
            <div className="mainContainer">
                <div className="nft-info">
                    <h1 className="NFT-title">{selectedNft.name}</h1>
                    <img src={selectedNft.image} alt={selectedNft.name}/>
                    <p className="description">{selectedNft.description}</p>
                    <p><strong style={{fontWeight: '700'}}>Owner Address :</strong> 0x256fCA88CAB016c1D487007e3Dfd6b14E67111d0</p>
                    <p><strong style={{fontWeight: '700'}}>Creator Address :</strong> 0x256fCA88CAB016c1D487007e3Dfd6b14E67111d0</p>
                </div>
                <div className="auction-details">

                    <p className="timer">SELL your NFT on Art Hunters </p>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #000',
                        padding: '20px',
                        fontSize: '26px',
                        fontFamily: 'Helvetica',
                        marginTop: '20px'
                    }}>
                        <p><strong style={{fontWeight: '700', margin: '10px'}}>Current Price
                            :</strong> {selectedNft.price} ETH</p>
                        <p><strong style={{fontWeight: '700', margin: '10px'}}>Taker Fees :</strong> (1.1%) 0.011 ETH
                        </p>
                        <p><strong style={{fontWeight: '700', margin: '10px'}}>Royalties
                            :</strong> {selectedNft.royalties} ETH</p>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '30px'}}>
                        {selectedNft.listed
                            ? <p style={{width: '48%', border: '1px solid #000', padding: '10px', fontSize: '16px'}}>Current price: {selectedNft.price} ETH</p>
                            : <input type="text" placeholder="Enter your price" style={{width: '48%', border: '1px solid #000', padding: '10px', fontSize: '16px'}} onChange={e => setPrice(e.target.value)}/>
                        }
                        <button
                            style={{width: '48%', border: '1px solid #000', padding: '10px', fontSize: '16px'}}
                            onClick={selectedNft.listed ? unlistNft : listNft}
                        >{selectedNft.listed ? 'CANCEL LISTING' : 'LIST NFT'}
                        </button>
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


                    <button style={{marginTop: '50px'}} className="return" onClick={() => setSelectedNft(null)}>Go back
                        to your NFT's
                    </button>
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
                        <div className="img-container">
                            <img src={nft.image} alt={nft.name}/>
                            {nft.listed &&
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    fontSize: '22px',
                                    fontWeight: '700'
                                }}>
                                    LISTED
                                </div>
                            }
                        </div>
                        <div style={{
                            fontSize: '22px',
                            fontFamily: 'Helvetica',
                            paddingTop: '10px',
                            paddingBottom: '0px',
                            fontWeight: '700'
                        }}>{nft.name}</div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <p style={{fontSize: '22px', fontFamily: 'Helvetica', paddingTop: '22px'}}>SELL</p>
                            <a style={{fontSize: '52px', fontWeight: '700', fontFamily: 'Helvetica', cursor: 'pointer'}}
                               onClick={() => sellNft(nft)}>
                                ...
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyNfts;
