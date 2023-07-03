import React, { useEffect, useState } from 'react';
import './Auctions.css';


function Auctions() {
    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNft, setSelectedNft] = useState(null); // Nouvel état pour le NFT sélectionné

    useEffect(() => {
        loadNfts().then(function(result) {
            setItems(result);
            setLoading(false);
        });
    }, []);

    const loadNfts = async () => {
        // This function would usually fetch NFT data from a smart contract or API
        // For now, we'll return a placeholder array of NFTs

        return [
            {
                image: '/0.png',
                name: 'NFT 1',
                description: 'This is a cool NFT',
                price: 0.01,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur',
                    'test'
                ]
            },
            {
                image: '/141.png',
                name: 'NFT 2',
                description: 'This is another cool NFT',
                price: 0.02,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur'
                ]
            },
            {
                image: '/5555.png',
                name: 'NFT 2',
                description: 'This is another cool NFT',
                price: 0.02,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur'
                ]
            },
            {
                image: '/436.png',
                name: 'NFT 2',
                description: 'This is another cool NFT',
                price: 0.02,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur'
                ]
            },
            {
                image: '/333.jpeg',
                name: 'NFT 2',
                description: 'This is another cool NFT',
                price: 0.02,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur'
                ]
            },
            {
                image: '/111.jpeg',
                name: 'NFT 2',
                description: 'This is another cool NFT',
                price: 0.02,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur'
                ]
            },
            {
                image: '/972.png',
                name: 'NFT 2',
                description: 'This is another cool NFT',
                price: 0.02,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur'
                ]
            },
            {
                image: '/1064.png',
                name: 'NFT 2',
                description: 'This is another cool NFT',
                price: 0.02,
                ownerAddress: '0x821D3AA3A0A4B75EEe1A6AC9C72e8F0269D295fD',
                creatorAddress: '0x7B987B92716dE129d67F51d16A1699D04F6c035D',
                currentBid: '4',
                royalties: '3.33%',
                traits : [
                    'crown',
                    'hazmat',
                    'goldblocks',
                    'grey fur'
                ]
            },

        ];
    };

    const buyNft = (nft) => {
        setSelectedNft(nft); // Au lieu d'afficher la console, nous mettons à jour l'état du NFT sélectionné
    };

    if (loading) return <div>Loading...</div>;
    if (items.length == 0) return <h1>No items for sale</h1>;

    // Si un NFT est sélectionné, afficher l'interface de détails
    if (selectedNft) {
        return (
            <div className="mainContainer">
                <div className="nft-info">
                    <h1 className="NFT-title">{selectedNft.name}</h1>
                    <img src={selectedNft.image} alt={selectedNft.name} />
                    <p className="description">{selectedNft.description}</p>
                    <p><strong style={{fontWeight:'700'}}>Owner Address :</strong> {selectedNft.ownerAddress}</p>
                    <p><strong style={{fontWeight:'700'}}>Creator Address :</strong> {selectedNft.creatorAddress}</p>
                </div>
                <div className="auction-details">

                    <p className="timer">Timer : 4D 13H 4M 38S </p>
                    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', padding: '20px', fontSize: '26px', fontFamily:'Helvetica', marginTop:'20px'}}>
                            <p><strong style={{fontWeight:'700', margin:'10px'}}>Current Bid :</strong> {selectedNft.currentBid} ETH</p>
                            <p><strong style={{fontWeight:'700', margin:'10px'}}>Taker Fees :</strong> (1.1%) 0.011 ETH</p>
                            <p><strong style={{fontWeight:'700', margin:'10px'}}>Royalties :</strong> {selectedNft.royalties} ETH</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop:'30px'}}>
                        <input type="text" placeholder="Enter you price" style={{ width: '48%', border: '1px solid #000', padding: '10px', fontSize: '16px' }} />
                        <button style={{ width: '48%', border: '1px solid #000', padding: '10px', fontSize: '16px' }}>LIST NFT</button>
                    </div>

                    <h2 className="traits">Traits</h2>
                    <div className="nft-traits" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', border: '1px solid black', padding:'15px' }}>
                        {selectedNft.traits.map((trait, index) => (
                            <div key={index} style={{ width: '45%', backgroundColor: '#d3d3d3', padding: '10px', margin: '10px', fontSize: '16px', fontFamily:'Helvetica', textTransform:'uppercase', textAlign:'center'}}>
                                <p>{trait}</p>
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
                            <p style={{fontSize:'22px', fontFamily:'Helvetica', paddingTop:'22px'}}>LAST BID : {nft.currentBid} ETH</p>
                            <a style={{fontSize:'52px',fontWeight:'700', fontFamily:'Helvetica', cursor:'pointer'}} onClick={() => buyNft(nft)}>
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
