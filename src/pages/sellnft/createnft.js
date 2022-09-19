import { marketplaceAddress} from '../../config';
import NftMarketplace from '../../contracts/MarketPlace.sol/NFTMarketplace.json';
import { useState } from 'react';
import { ethers } from 'ethers';
import {uploadFileToIPFS , uploadJSONToIPFS} from '../../pinata';
//import { useLocation } from "react-router";
import Web3Modal from 'web3modal';
import'./createnft.css';

//const client = ipfsHttpClient('https://api.pinata.cloud/pinning/pinFileToIPFS');
//const fs = require('fs')
//const pinataSDK = require('@pinata/sdk');
//const pinata = pinataSDK('2bb0d1449db512787da1','292a3b0e90b30f66dfae578ebf3c22ffb133508b3470eebe405909d7e6adaf16');

const CreateNft = () => {


     const [fileUrl, setFileURL] = useState(null)
     const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

     async function onChange(e) {
      const file = e.target.files[0]
      try {
    //upload the file to IPFS
    const response = await uploadFileToIPFS(file);
    if(response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL)
        setFileURL(response.pinataURL);
    }
      } catch (error) {
        console.log("Error during file upload", e);
      }  
    }

    
    async function uploadMetadataToIPFS() {
      const {name, description, price} = formInput;
      //Make sure that none of the fields are empty
      if( !name || !description || !price || !fileUrl)
          return;

      const nftJSON = {
          name, description, price, image: fileUrl
      }

      try {
          //upload the metadata JSON to IPFS
          const response = await uploadJSONToIPFS(nftJSON);
          if(response.success === true){
              console.log("Uploaded JSON to Pinata: ", response)
              return response.pinataURL;
          }
      }
      catch(e) {
          console.log("error uploading JSON metadata:", e)
      }
  }


    
  async function listNFTForSale() {

      const url = await uploadMetadataToIPFS();
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      /* next, create the item */
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      let contract = new ethers.Contract(marketplaceAddress, NftMarketplace.abi, signer)
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      let transaction = await contract.createToken(url, price, { value: listingPrice })
      await transaction.wait()

      alert("Successfully listed your NFT!");
      //window.location.replace("/")
    }




     return(<div className='w-100 h-100'>
     <div className="bg-dark  d-flex justify-content-center">
     <div className=" d-flex  flex-column">
       <input 
         placeholder=" Name"
         type="text"
         value={formInput.name}
         className=" mt-3 p-3"
         onChange={e => updateFormInput({...formInput, name: e.target.value })}
       />
       <textarea
      type="text"
      value={formInput.description}
         placeholder=" Description"
         className="mt-3 p-3"
         onChange={e => updateFormInput({...formInput, description: e.target.value })}
       />
       <input type="number"
       value={formInput.price}
         placeholder="Price in Eth"
         className="mt-3  p-3"
         onChange={e => updateFormInput({...formInput, price: e.target.value })}
       />
       <input
         type="file"
         name="Asset"
         className="my-3 text-white"
         onChange={onChange}
       />
       {
        fileUrl  && (<img className="rounded mt-3 img"   src={fileUrl} />)
       }
       <button onClick={listNFTForSale} className="font-bold mt-4 mb-3 card-btn  p-3 ">
         Create NFT
       </button>
     </div>
   </div>
   </div>  
   )
}
export default CreateNft