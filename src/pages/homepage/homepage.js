import './homepage.css';
import { marketplaceAddress} from '../../config';
import axios from 'axios';
import {useEffect, useState} from 'react';  
import {ethers} from 'ethers';
import Web3Modal from 'web3modal';  //baray vasl shodan be kifpol eth yek nafar
import NftMarketplace from '../../contracts/MarketPlace.sol/NFTMarketplace.json';



const Homepage = () => 
{   
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    setLoadingState('loaded') 
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const contract = new ethers.Contract(marketplaceAddress , NftMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    //  map over items returned from smart contract and format 
    //  them as well as fetch their token metadata
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId) 
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items) 
  }

  async function buyNft(nft) { //ghabliat kharid nft dar homepage
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect() // vase vasl shoden be kifpool
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NftMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price  //meghdari ke ersal mishe vase kharid
    })
    await transaction.wait()
    loadNFTs()
  }

 if (loadingState === 'loaded' && !nfts.length)    return (<h1 className=" py-3 text-center">No items in marketplace</h1>) 

      return(
        <div className="w-100 h-100 p-4 bg-dark  d-flex flex-wrap justify-content-center align-items-center gap-3 ">
        {          
        nfts.map((nft, i) => (
        
          <div key={i} className= 'card-container bg-light py-4 p-3 '>
            <div className='img'>
              <img className='w-100 h-100'  src={nft.image} />
            </div>  
            <div >
             <div className='mt-2'><h3>{nft.name}</h3></div> 
             <div className='fix-text'><h6  >{nft.description}</h6></div> 
             <h4>{nft.price} MATIC</h4>
             <button className='p-1 card-btn' onClick={() => buyNft(nft)} >BUY NFT</button>
             </div>
          </div>
        
      ) )  }
      </div>
      )
  
}  

export default Homepage