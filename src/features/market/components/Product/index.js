import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useReducer } from 'react';
import BuyButton from '~/features/market/components/BuyButton';
import { useWeb3 } from '~/providers/web3';

export default function Product ({ product, onFetchProducts }) {
  const FIELD = useMemo(() => ({
    ID: 0,
    SELLER: 1,
    NFT: 2,
    TOKEN_ID: 3,
    PRICE: 4,
    CLOSED: 5,
  }), []);
  const { web3Network, gameItemContract } = useWeb3();
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { image: '' },
    undefined,
  );
  const { image } = state;
  const tokenId = product[FIELD.TOKEN_ID];
  const price = web3Network
    ? web3Network.utils.fromWei(product[FIELD.PRICE], 'ether')
    : 0;

  useEffect(() => {
    gameItemContract &&
    gameItemContract.methods.tokenURI(tokenId).call().then((tokenURI) => {
      setState({ image: tokenURI });
    });
  }, [gameItemContract, tokenId]);


  return (
    <Box className='Product' sx={{
      display: 'inline-block',
      maxWidth: 345,
      margin: '1rem 1rem',
      padding: '.8rem',
      backgroundColor: '#fff',
      borderRadius: '.4rem',
      boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        '& img': {
          objectFit: 'cover',
        },
      }}>
        <img height='240' src={image} alt='NFT image' />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h5' component='div' sx={{
            color: 'red', fontWeight: 'bold', textAlign: 'center',
          }}>
            {price} BNB
          </Typography>
          <BuyButton 
            nft={product[FIELD.NFT]}
            tokenId={product[FIELD.TOKEN_ID]}
            sellingId={product[FIELD.ID]} 
            price={price}
            onBuySuccess={onFetchProducts}
          />
          <Typography
            variant='h5'
            color='text.secondary'
            sx={{ textAlign: 'center' }}
          >
            <p>Token ID: {product[FIELD.TOKEN_ID]}</p>
            <p>NFT address:</p>
          </Typography>
          <Typography
            variant='h5'
            color='text.secondary'
            sx={{ wordBreak: 'break-all', textAlign: 'center' }}
          >
            {product[FIELD.NFT]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}