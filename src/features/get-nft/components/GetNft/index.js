import { Box, Button, Input } from '@mui/material';
import { useReducer } from 'react';
import { useWeb3 } from '~/providers/web3';

export default function GetNft () {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      image: '',
      loading: false,
    },
    undefined,
  );
  const { image, loading } = state;
  const { gameItemContract, currentAccount } = useWeb3();

  const handleSubmit = () => {
    if (!currentAccount) {
      alert('Please connect to metamask');
    } else {
      setState({ loading: true });
      gameItemContract.methods.mint(image).send({
        from: currentAccount,
      }).then((data) => {
        alert('Get NFT successfully!');
        setState({ image: '', loading: false });
        console.log(data);
      }).catch((error) => {
        console.error(error);
        setState({ loading: false });
      });
    }
  };

  const handleInputChange = (e) => {
    e && e.preventDefault();
    setState({ image: e.target.value });
  };

  return (
    <Box
      className='GetNft'
      sx={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <h4> Get NFT</h4>
      <Box>Image URL</Box>
      <Input
        sx={{ fontSize: '1.2rem', width: '30rem' }}
        value={image}
        placeholder='Image url'
        onChange={handleInputChange}
      />
      {image && <img height={240} src={image} alt='NFT image' />}
      <Button
        disabled={loading}
        sx={{ fontSize: '1.2rem', marginTop: '2rem', width: '30rem' }}
        variant='outlined'
        onClick={handleSubmit}
      >
        {loading ? 'Loading...' : 'Submit'}
      </Button>
    </Box>
  );
}