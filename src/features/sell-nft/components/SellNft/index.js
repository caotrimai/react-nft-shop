import { Box, Button, Input } from '@mui/material';
import { useReducer } from 'react';
import nftMarketPlace from '~/contract/NftMarketPlace';
import { useWeb3 } from '~/providers/web3';

const initState = {
  nftAddress: '',
  tokenId: 0,
  price: 0,
  nftContract: null,
  approved: false,
  loading: false,
}

export default function SellNft () {
  const { web3, currentAccount, marketPlaceContract, getNftContract } = useWeb3();
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      ...initState
    },
    undefined,
  );
  const { nftAddress, tokenId, price, approved, loading } = state;

  const handleApproval = () => {
    if (!nftAddress || !tokenId || !price) {
      alert('Please input to the form');
      return;
    }
    setState({ loading: true });
    if (!approved) {
      const nftContract = getNftContract(nftAddress)
      nftContract.methods.approve(nftMarketPlace.ADDRESS, tokenId).send({
        from: currentAccount,
      }).then(() => {
        setState({ loading: false, approved: true });
      }).catch((error) => {
        console.error(error);
        setState({ loading: false });
      });
    }
  };

  const sellNft = () => {
    if (!nftAddress || !tokenId || !price) {
      alert('Please input to the form');
      return;
    }
    setState({loading: true});
    marketPlaceContract.methods.sellNFT(
      nftAddress,
      tokenId,
      web3.utils.toWei(price, 'ether')
    ).send({
      from: currentAccount
    }).then((data) => {
      console.log(data);
      setState({...initState})
      alert('Post selling successfully')
    }).catch((error) => {
      setState({loading: false});
      console.error(error);
    })

  }
  
  const handleSellNft = () => {
    if(approved) {
      sellNft()  
    } else {
      handleApproval()
    }
  };

  const handleChangeNftAddress = (e) => {
    e && e.preventDefault();
    setState({
      nftAddress: e.target.value,
    });
  };
  const handleChangeTokenId = (e) => {
    e && e.preventDefault();
    setState({
      tokenId: Number(e.target.value),
    });
  };
  const handleChangePrice = (e) => {
    e && e.preventDefault();
    setState({
      price: e.target.value,
    });
  };

  return (
    <Box className='SellNft'>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& input': {
          fontSize: '1.4rem'
        }
      }}>
        <Box>NFT Address</Box>
        <Input
          disabled={approved || loading}
          sx={{ fontSize: '1.2rem', width: '30rem', marginBottom: '2rem' }}
          value={nftAddress}
          placeholder='NFT Address'
          onChange={handleChangeNftAddress}
        />
        <Box>Token ID</Box>
        <Input
          disabled={approved || loading}
          sx={{ fontSize: '1.2rem', width: '30rem', marginBottom: '2rem' }}
          value={tokenId}
          placeholder='Token ID'
          onChange={handleChangeTokenId}
        />
        <Box>Price</Box>
        <Input
          disabled={approved || loading}
          sx={{ fontSize: '1.2rem', width: '30rem', marginBottom: '2rem' }}
          value={price}
          placeholder='Price'
          onChange={handleChangePrice}
        />
        {!currentAccount 
          ? 'Please connect to metamask'
          : (
          <Button
            disabled={loading}  
            variant='contained'
            sx={{ fontSize: '1.2rem', marginTop: '2rem' }}
            onClick={handleSellNft}
          >
            {loading ? 'Loading...' : (approved ? 'Sell' : 'Enable')}
          </Button>
          )
        }
      </Box>
    </Box>
  );
}