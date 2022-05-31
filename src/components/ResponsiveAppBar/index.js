import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { routeConfig } from '~/config';
import { useWeb3 } from '~/providers/web3';
import { shorthandAddress } from '~/utils';

const pages = [
  { to: routeConfig.market, label: 'Market' },
  { to: routeConfig.selling, label: 'Selling' },
  { to: routeConfig.getNft, label: 'Get NFT Free' },
];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { currentAccount, loadProvider } = useWeb3();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const connectButton = (
    <Button
      sx={{
        backgroundColor: '#d58e3d',
        border: '1px solid #d58e3d',
        opacity: 0.9,
        '&:hover': {
          backgroundColor: '#d58e3d',
          opacity: 1,
        },
      }}
      onClick={loadProvider} variant='contained'>
      Connect Wallet
    </Button>
  );

  return (
    <AppBar position='static' sx={{ width: '100%' }}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '1.6rem',
            }}
          >
            NFT MARKET - BSC TEST NET
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                <Link to={page.to} key={index}>
                  <MenuItem onClick={handleCloseNavMenu}>
                      <Typography fontSize='1.2rem' textAlign='center'>{page.label}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Link to={page.to} key={index}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    fontSize: '1.2rem',
                    my: 2,
                    color: 'white',
                    display: 'block',
                  }}
                >
                  {page.label}
                </Button>
              </Link>
            ))}
          </Box>

          {currentAccount ? shorthandAddress(currentAccount) : connectButton}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
