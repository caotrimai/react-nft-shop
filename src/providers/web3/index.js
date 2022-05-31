import detectEthereumProvider from '@metamask/detect-provider';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import Web3 from 'web3';
import GameItemNFT from '~/contract/GameItemNFT';
import NftMarketPlace from '~/contract/NftMarketPlace';
import NftStandardABI from '~/contract/NftStandardABI';

const Web3Context = createContext({});

export function useWeb3 () {
  return useContext(Web3Context);
}

export default function Web3Provider ({ children }) {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      provider: null,
      web3: null,
      web3Network: null,
      networkProvider: null,
      accounts: [],
      currentAccount: null,
      gameItemContract: null,
      marketPlaceContract: null,
      isInitiated: false,
      error: null,
      nftContracts: {},
    },
    undefined,
  );

  const { provider, web3, nftContracts } = state;

  const loadNetworkInfo = useCallback(() => {
    const networkProvider = new Web3.providers.HttpProvider(
      process.env.REACT_APP_NETWORK_PROVIDER);
    const web3Network = new Web3(networkProvider);
    const gameItemContract = new web3Network.eth.Contract(
      GameItemNFT.ABI,
      GameItemNFT.ADDRESS,
    );
    const marketPlaceContract = new web3Network.eth.Contract(
      NftMarketPlace.ABI,
      NftMarketPlace.ADDRESS,
    );
    setState({
      web3Network,
      gameItemContract,
      marketPlaceContract,
    });
  }, []);

  useEffect(() => {
    loadNetworkInfo();
  }, [loadNetworkInfo]);

  const getNftContract = useCallback((nftAddress) => {
    const validAddress = web3.utils.isAddress(nftAddress)
    if(!validAddress){
      console.error('Invalid address');
      return null
    }
    if(nftContracts[nftAddress]) {
      return nftContracts[nftAddress]
    }
    const newNftContracts = { ...nftContracts };
    if(web3) {
      newNftContracts[nftAddress] = new web3.eth.Contract(
        NftStandardABI,
        nftAddress,
      )
      setState({
        nftContracts: newNftContracts
      })
      return newNftContracts[nftAddress]
    } else {
      alert('Please connect to metamask wallet')
      return null
    }
  }, [web3, nftContracts]);

  const loadProvider = useCallback(async () => {
    const provider = await detectEthereumProvider();
    if (!provider) {
      setState({ isInitiated: true });
      alert('Please install metamask');
    } else {
      const web3 = new Web3(provider);
      const accounts = await web3.eth.requestAccounts();
      const currentAccount = accounts[0];

      const metamaskNetworkId = await web3.eth.net.getId();

      const expandOptions = {};
      if (Number(metamaskNetworkId) ===
        Number(process.env.REACT_APP_NETWORK_ID)) {
        expandOptions.web3Network = web3;
        expandOptions.gameItemContract = new web3.eth.Contract(
          GameItemNFT.ABI,
          GameItemNFT.ADDRESS,
        );
        expandOptions.marketPlaceContract = new web3.eth.Contract(
          NftMarketPlace.ABI,
          NftMarketPlace.ADDRESS,
        );
      }

      setState({
        provider,
        web3,
        accounts,
        currentAccount,
        isInitiated: true,
        ...expandOptions,
      });
    }
  }, []);

  useEffect(() => {
    if (provider) {
      provider.on('accountsChanged', (accounts) => {
        setState({
          accounts,
          currentAccount: accounts[0],
        });
      });
      provider.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    }
  }, [provider]);

  return (
    <Web3Context.Provider value={{ ...state, loadProvider, getNftContract }}>
      {children}
    </Web3Context.Provider>
  );
}