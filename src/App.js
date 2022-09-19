import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from './pages/homepage/homepage';
import Dashboard from './pages/dashboard/dashboard';
import SellNft from './pages/sellnft/createnft';
import MyNfts from './pages/mynfts/mynfts';
import CreateNft from './pages/sellnft/createnft';



function App() {

  

  return (
      <div className='w-100  bg-light full--page'>
      <nav className=' items h-auto border-b p-3 border-bottom ' >
        <p className='  .text-dark font-weight-bold fs-2 ' >MEHRDAD NFT MARKETPLACE</p>
        <div className='d-flex gap-3  '>
         <Link className='link--controlpages' to='/'><p>Home</p></Link>
         <Link className='link--controlpages' to='/sellnft' ><p>Sell NFT</p></Link>
         <Link className='link--controlpages' to='/mynfts' ><p>My NFTs</p></Link>
         {/* <Link className='link--controlpages' to='/dashboard'><p>Dashboard</p></Link> */}
        </div>
      </nav>
      <div className='w-100 '>
      <Routes>
        <Route path='/'>
            <Route index element={<Homepage/>} />
            <Route path='dashboard'  element={<Dashboard/>}/>
            <Route path='sellnft'  element={<CreateNft/>}/>
            <Route path='mynfts'  element={<MyNfts/>}/>
        </Route>
      </Routes>
      </div>
      </div>
  );
}

export default App;
