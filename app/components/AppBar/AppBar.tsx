'use client';

// next
import Link from 'next/link';
// MUI
import { Box, Divider, AppBar, Avatar, Toolbar, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
// tyles
import { appbar_height } from '@const';
import appBarStyles from './AppBar.module.css';

/********************************************************************************************************************
 * app bar component
 ********************************************************************************************************************/
export default function AppBarComponent() {
  return (
    <>
      <AppBar position='sticky' color='default'
        sx={{
          height: appbar_height,
          justifyContent: 'center',
          bgcolor: 'background.paper',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>

          {/* title */}
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Typography
              variant='h6'
              color='primary'
              gutterBottom
              sx={{ fontWeight: 600, textAlign: 'left', mt: 1, ml: 2, cursor: 'pointer' }}
            >
              TASK MANAGER
            </Typography>
          </Link>

          {/* input search bar button */}
          <Box
            onClick={() => { }}
            role='button'
            tabIndex={0}
            className={appBarStyles.searchButton}
          >
            <SearchIcon fontSize='small' sx={{ mr: 1, color: 'action.active' }} />
            Search…
          </Box>

          {/* user */}
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }} alt='User'>
            U
          </Avatar>
        </Toolbar>
        <Divider />
      </AppBar>
    </>
  );
}
