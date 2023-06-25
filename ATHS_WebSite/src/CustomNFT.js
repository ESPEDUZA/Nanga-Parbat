import React, {useCallback, useState} from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

const CustomNFT = () => {
    const [file, setFile] = useState(null)
    const onDrop = useCallback(acceptedFiles => {
        setFile(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    const { register, handleSubmit } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <div className="mainContainer flex">
            <div className="nft-info w-1/2 p-4 border-r">
                <h1 className="NFT-title">Let's create your own NFT</h1>
                {!file && (
                    <div {...getRootProps()} className="w-full h-64 border-2 border-gray-300 rounded flex items-center justify-center my-4 cursor-pointer">
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the file here ...</p> :
                                <p>Drag 'n' drop your NFT image here, or click to select a file</p>
                        }
                    </div>
                )}
                {file && <img src={file} alt="NFT Preview" className="w-full h-64 object-cover rounded"/>}
            </div>
            <div style={{fontFamily:'Helvetica'}} className="auction-details w-1/2 p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <input {...register('name')} type="text" placeholder="NFT Name" className="border p-2"/>
                    <textarea {...register('description')} placeholder="Description" className="border p-2"/>
                    <input {...register('creatorAddress')} type="text" placeholder="Creator Address" className="border p-2"/>
                    <input {...register('Trait1')} type="text" placeholder="Trait 1" className="border p-2"/>
                    <input {...register('Trait2')} type="text" placeholder="Trait 2" className="border p-2"/>
                    <input {...register('Trait3')} type="text" placeholder="Trait 3" className="border p-2"/>
                    <button type="submit" className="border p-2">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CustomNFT;
