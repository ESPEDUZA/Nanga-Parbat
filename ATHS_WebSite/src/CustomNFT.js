import React, {useCallback, useState} from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';




const CustomNFT = () => {
    const [isOpen, setIsOpen] = useState(false);  // renaming from 'open' to 'isOpen'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nftData, setNftData] = useState(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const handleClose = () => {
        setIsOpen(true);
    };
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    const {register, handleSubmit, reset} = useForm();
    const onSubmit = async (data) => {
        try {

            let web3;
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                await window.ethereum.enable(); // Request account access
            } else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider); // Legacy dapp browsers
            } else {
                throw new Error("Non-Ethereum browser detected. You should consider trying MetaMask!");
            }
            setIsSubmitting(true);
            // Create an instance of the IPFS client
            const ipfs = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: 'Basic ' + btoa('2Rnc26fjPPOjMENMe15K9HbeVj7:3066fad4cf7b1bfb468f818fc6542a82')

                }
            });

            // Read the uploaded file
            const fileBuffer = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(new Uint8Array(reader.result));
                reader.onerror = reject;
                reader.readAsArrayBuffer(file); // removed [0] from file
            });

            // Upload the file to IPFS
            const result = await ipfs.add(fileBuffer);

            // The IPFS hash of the file is result.path
            const ipfsHash = result.path;


            // Replace with your contract's address and ABI
            const contractAddress = "0xAa9b514116B94Dd69FFCbdd02979df3b4Bbe0e30";
            const contractABI = [
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "approved",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "Approval",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bool",
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "ApprovalForAll",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "_fromTokenId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "_toTokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "BatchMetadataUpdate",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "_tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "MetadataUpdate",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "Transfer",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "balanceOf",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getApproved",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getTokenData",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "name",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "trait1",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "trait2",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "trait3",
                                    "type": "string"
                                }
                            ],
                            "internalType": "struct MyNFT.NFTData",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        }
                    ],
                    "name": "isApprovedForAll",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "tokenURI",
                            "type": "string"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "name",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "trait1",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "trait2",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "trait3",
                                    "type": "string"
                                }
                            ],
                            "internalType": "struct MyNFT.NFTData",
                            "name": "data",
                            "type": "tuple"
                        }
                    ],
                    "name": "mintNFT",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "name",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "ownerOf",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "safeTransferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes",
                            "name": "data",
                            "type": "bytes"
                        }
                    ],
                    "name": "safeTransferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "internalType": "bool",
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "setApprovalForAll",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes4",
                            "name": "interfaceId",
                            "type": "bytes4"
                        }
                    ],
                    "name": "supportsInterface",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "symbol",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "tokenURI",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "transferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];


            const accounts = await web3.eth.getAccounts();
            // Create a new instance of the contract
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log(`https://ipfs.io/ipfs/${ipfsHash}`);
            const metadata = {
                name: data.name,
                description: data.description,
                image: `https://ipfs.io/ipfs/${ipfsHash}`,
                attributes: [
                    {trait_type: "Trait 1", value: data.Trait1},
                    {trait_type: "Trait 2", value: data.Trait2},
                    {trait_type: "Trait 3", value: data.Trait3},
                ],
            };

            // Convert the metadata object to a JSON string
            const metadataJSON = JSON.stringify(metadata);

            // Convert the JSON string to a Uint8Array
            const textEncoder = new TextEncoder();
            const metadataBuffer = textEncoder.encode(metadataJSON);

            // Upload the metadata to IPFS
            const metadataResult = await ipfs.add(metadataBuffer);

            // The IPFS hash of the metadata is metadataResult.path
            const metadataIpfsHash = metadataResult.path;

            // Prepare the data structure for the NFTData struct
            const nftData = {
                name: data.name,
                description: data.description,
                trait1: data.Trait1,
                trait2: data.Trait2,
                trait3: data.Trait3,
            };


            console.log(contract.methods);
            console.log(`https://ipfs.io/ipfs/${ipfsHash}`);
            console.log(`https://ipfs.io/ipfs/${metadataIpfsHash}`);

            // Use the IPFS URL of the metadata as the tokenURI
            const tx = await contract.methods.mintNFT(data.creatorAddress, `https://ipfs.io/ipfs/${metadataIpfsHash}`, nftData).send({from: accounts[0]});

            console.log('NFT minted successfully');
            setIsOpen(true);
            setIsSubmitting(false);
        } catch (err) {
            console.error('Error minting NFT: ', err);
        }
        reset();
        setFile(null);
    };

    return (
        <div className="mainContainer flex">
            <div className="nft-info w-1/2 p-4 border-r">
                <h1 className="NFT-title">Let's create your own NFT</h1>
                {!file && (
                    <div {...getRootProps()}
                         className="w-full h-64 border-2 border-gray-300 rounded flex items-center justify-center my-4 cursor-pointer">
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the file here ...</p> :
                                <p>Drag 'n' drop your NFT image here, or click to select a file</p>
                        }
                    </div>
                )}
                {file && <img src={previewUrl} alt="NFT Preview" className="w-full h-64 object-cover rounded"/>}
            </div>
            <div style={{fontFamily: 'Helvetica'}} className="auction-details w-1/2 p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <input {...register('name')} type="text" placeholder="NFT Name" className="border p-2"/>
                    <textarea {...register('description')} placeholder="Description" className="border p-2"/>
                    <input {...register('creatorAddress')} type="text" placeholder="Creator Address"
                           className="border p-2"/>
                    <input {...register('Trait1')} type="text" placeholder="Trait 1" className="border p-2"/>
                    <input {...register('Trait2')} type="text" placeholder="Trait 2" className="border p-2"/>
                    <input {...register('Trait3')} type="text" placeholder="Trait 3" className="border p-2"/>
                    <button type="submit" className="border p-2">Submit</button>
                </form>
            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isOpen}>
                    <Box
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white',
                            border: '2px solid #000',
                            boxShadow: 24,
                            padding: 20,
                        }}
                    >
                        <div style={{margin: '20px'}}>
                            <Typography id="transition-modal-title" variant="h6" component="h2"
                                        style={{fontFamily: 'Helvetica', marginBottom: '20px'}}>
                                NFT Successfully Minted !
                            </Typography>
                            <Typography id="transition-modal-description"
                                        sx={{mt: 2, fontFamily: 'Helvetica', marginBottom: '20px'}}>
                                Preview:
                                <img src={previewUrl} alt="NFT" style={{marginBottom: '20px'}}/>
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        fontFamily: 'Helvetica',
                                        marginTop: '20px',
                                        marginBottom: '20px',
                                        display: 'block',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}
                                    href={'https://testnets.opensea.io/account'}
                                    target="_blank"
                                >
                                    View on OpenSea
                                </Button>
                            </Typography>
                        </div>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="loading-modal-title"
                aria-describedby="loading-modal-description"
                open={isSubmitting}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isSubmitting}>
                    <Box
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white',
                            border: '2px solid #000',
                            boxShadow: 24,
                            padding: 20,
                        }}
                    >
                        <Typography id="loading-modal-title" variant="h6" component="h2"
                                    style={{fontFamily: 'Helvetica', marginBottom: '20px'}}>
                            Loading...
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )

}
    export default CustomNFT;
