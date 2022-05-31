import { Box, Button } from '@mui/material';
import { useWeb3 } from '~/providers/web3';

export default function BuyButton ({sellingId, price, onBuySuccess}) {
  const { provider, web3, web3Network, marketPlaceContract,currentAccount } = useWeb3();
  
  const addMainNet = async () => {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${process.env.REACT_APP_NETWORK_ID}`,
            chainName: process.env.REACT_APP_NETWORK_NAME,
            rpcUrls: [process.env.REACT_APP_NETWORK_PROVIDER],
          },
        ],
      });
    } catch (addError) {
      // handle "add" error
      console.log(addError);
    }
  }
  
  const buyNft = () => {
    marketPlaceContract.methods.buyNFT(sellingId).send({
      from: currentAccount,
      value: web3.utils.toWei(price, 'ether')
    }).then((data) => {
      console.log(data);
      onBuySuccess && onBuySuccess()
    }).catch((error) => {
      console.error(error)
    })
  }
  
  const handleBuy = async (e) => {
    e && e.preventDefault() && e.stopPropagation();
    if (web3) {
      const metamaskNetworkId = await web3.eth.net.getId();
      const marketNetworkId = await web3Network.eth.net.getId();
      console.log({ metamaskNetworkId, marketNetworkId });
      if (metamaskNetworkId === marketNetworkId) {
        buyNft()
      } else {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${marketNetworkId}` }], // chainId must be in hexadecimal numbers
          });
        } catch (switchError) {
          alert(`Please switch to ${process.env.REACT_APP_NETWORK_NAME}`)
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            await addMainNet()
          }
        }
      }
    } else {
      alert('Please connect to metamask')
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      '& .MuiButton-root': {
        fontSize: '1.2rem',
      },
    }}>
      <Button variant='contained' onClick={handleBuy}>
        Buy
      </Button>
    </Box>
  );
}