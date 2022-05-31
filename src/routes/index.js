//Pages
import { routeConfig } from '~/config';
import GetNft from '~/features/get-nft';
import Market from '~/features/market'
import SellNft from '~/features/sell-nft'

const publicRoutes = [
  {path: routeConfig.home, component: Market},
  {path: routeConfig.market, component: Market},
  {path: routeConfig.selling, component: SellNft},
  {path: routeConfig.getNft, component: GetNft},
];

const privateRoutes = [];

export {publicRoutes, privateRoutes}