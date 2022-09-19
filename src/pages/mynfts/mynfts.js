import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { marketplaceAddress} from '../../config'
import NFTMarketplace from '../../contracts/MarketPlace.sol/NFTMarketplace.json'


const MyNfts = () => 
{
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
      loadNFTs()
    }, [])
    async function loadNFTs() {
        setLoadingState('loaded')
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      const data = await marketplaceContract.fetchMyNFTs()
  
      const items = await Promise.all(data.map(async i => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenURI)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          tokenURI
        }
        return item
      }))
      setNfts(items)
       
    }

    if (loadingState === 'loaded' && !nfts.length)    return (<h1 className=" py-3 text-center">No item</h1>) 
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
             {/* <button className='p-1 card-btn' onClick={() => buyNft(nft)} >BUY NFT</button> */}
             </div>
          </div>
        
      ) )  }
      </div>
      )
}
export default MyNfts