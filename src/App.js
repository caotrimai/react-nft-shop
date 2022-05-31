import { Box, Container } from '@mui/material';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from '~/components/ResponsiveAppBar';
import { publicRoutes } from '~/routes';

function App () {

  return (
    <Router>
      <Box sx={{
        width: 'calc(1920px - 10px)',
        minHeight: '1080px',
        backgroundColor: '#e7ebf0',
        margin: 0,
      }}>
        <ResponsiveAppBar />
        <Container sx={{ backgroundColor: '#fff' }}>
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              return <Route
                key={index}
                path={route.path}
                element={<Page />}
              />;
            })}
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
