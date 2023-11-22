import React, { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import "./NFTpage.css";

const NftPage = ({ account }) => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const MORALIS_API_KEY = "qlm1Kks4ON1tljvmpQI1xaBI9w6u1GA19XMGUnheDE6dHBJ5oBp4663m9bssGyxn";

    useEffect(() => {
        async function fetchNFTs() {
            if (!account) return;
            const fetchedNFTs = await fetchMoralisNFTs(account, MORALIS_API_KEY);
            setNfts(fetchedNFTs);
            setLoading(false);
        }

        fetchNFTs();
    }, [account]);

    async function fetchMoralisNFTs(address, apiKey) {
        const url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=eth&format=decimal`;
        const headers = {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
        };

        try {
            const response = await fetch(url, {headers});
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Moralis API error response:", errorData);
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log("Moralis API response data:", data);

            if (!data.result) {
                throw new Error("Unexpected API response format");
            }

            const assets = data.result;

            const nfts = await Promise.all(
                assets.map(async (asset) => {
                    const name = asset.name || "Unnamed NFT";
                    const metadataUrl = asset.token_uri;
                    if (!metadataUrl) {
                        return {
                            contractAddress: asset.token_address,
                            tokenID: asset.token_id,
                            name,
                            image: `https://ipfs.io/ipfs/${asset.image_url || asset.image_preview_url}`,
                        };
                    }

                    const metadataResponse = await fetch(metadataUrl);
                    if (!metadataResponse.ok) {
                        console.error("Error fetching NFT metadata:", metadataResponse);
                        return {
                            contractAddress: asset.token_address,
                            tokenID: asset.token_id,
                            name,
                            image: `https://ipfs.io/ipfs/${asset.image_url || asset.image_preview_url}`,
                        };
                    }

                    const metadata = await metadataResponse.json();
                    const image = metadata.image.replace("ipfs://", "");

                    return {
                        contractAddress: asset.token_address,
                        tokenID: asset.token_id,
                        name,
                        image: `https://ipfs.io/ipfs/${image}`,
                    };
                })
            );

            return nfts;
        } catch (error) {
            console.error("Error fetching NFT data from Moralis:", error);
            return [];
        }
    }

    return (
        <div className="nft-grid">
            {loading ? (
                <div className="loader-container">
                    <SyncLoader color="#04d9ff"/>
                </div>
            ) : (
                nfts.map((nft, index) => (
                    <div key={index} className="nft-card">
                        {nft.image ? (
                            <img src={nft.image} alt={nft.name}/>
                        ) : (
                            <div className="no-image">
                                <p>No image available</p>
                            </div>
                        )}
                        <h3>{nft.name}</h3>
                        <p>ID: {nft.tokenID}</p>
                    </div>
                ))
            )}
        </div>
    );
}
export default NftPage;
