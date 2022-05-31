import { Box } from '@mui/material';
import ProductList from '~/features/market/components/ProductList';

export default function Market () {
  return (
    <Box className='Market' sx={{ width: '100%' }}>
      <ProductList/>
    </Box>
  );
}