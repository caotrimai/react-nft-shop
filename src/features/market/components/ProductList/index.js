import { Box } from '@mui/material';
import { useCallback, useEffect, useReducer } from 'react';
import { useWeb3 } from '~/providers/web3';
import Product from '../Product';

export default function ProductList () {
  const { marketPlaceContract } = useWeb3();
  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      products: []
    },
    undefined
  )
  
  const fetchProductList = useCallback(() => {
    marketPlaceContract && marketPlaceContract.methods.getAllSellingItems().call()
    .then((data) => {
      data.length > 0 && setState({products: data})
    })
    .catch((error) => {
      console.log(error);
    })
  },[marketPlaceContract])
  
  const {products} = state
  useEffect(() => {
    fetchProductList()
  }, [fetchProductList]);

  return (
    <Box className='ProductList'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 1,
      }}
    >
      {products.map((product) => (
        <Product 
          key={product[0]}
          product={product}
          onFetchProducts={fetchProductList}
        />
      ))}
    </Box>
  );
}