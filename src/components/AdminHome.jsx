import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import certLogo from '../assets/c_logo.png';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ViewListIcon from '@mui/icons-material/ViewList';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LogoutIcon from '@mui/icons-material/Logout';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import BookingsIcon from '@mui/icons-material/EventNote';
import ApprovalIcon from '@mui/icons-material/HowToReg';

const drawerWidth = 280;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'space-between' : 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      background: '#34495e',
      height: '100vh',
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      ...closedMixin(theme),
      background: '#34495e',
      height: '100vh',
    },
  }),
}));

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login', { replace: true });
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handleConfirmLogout = () => {
    handleLogout();
    setDialogOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/admin-dashboard' },
    { text: 'All Bookings', icon: <AssignmentTurnedInIcon />, link: '/all-bookings' },
    { text: 'Pending for Approval', icon: <PendingActionsIcon />, link: '/pending-approval' },
    { text: 'History', icon: <HistoryIcon />, link: '/history' },
  ];
  const secondaryItems = [
    { text: 'My View', icon: <VisibilityIcon />, link: '/admin-view' },
    { text: 'Logout', icon: <LogoutIcon />, link: '', action: handleOpenDialog },  // Added logout action
  ];

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader open={open}>
          {open && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1 }}>
              <img src={certLogo} alt="Company Logo" style={{ width: 120, height: 'auto' }} />
            </div>
          )}
          <IconButton onClick={() => setOpen(!open)} sx={{ color: 'white' }}>
            {open ? (theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />) : (theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                display: 'flex',
                borderRadius: 3,
                justifyContent: 'center',
                width: 'auto',
                alignItems: 'center',
                margin: selectedItem === item.link ? '0 8px' : '0',
                backgroundColor: selectedItem === item.link ? 'white' : 'inherit',
                transition: 'background-color 0.3s ease, margin 0.3s ease',
              }}
            >
              <ListItemButton
                component={Link}
                to={item.link}
                sx={{
                  minHeight: 30,
                  justifyContent: open ? 'initial' : 'center',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: selectedItem === item.link ? 'white' : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: selectedItem === item.link ? '#0069A5' : '#ffffff',
                    fontSize: 30,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: selectedItem === item.link ? '#0069A5' : '#ffffff',
                    transition: 'color 0.3s ease, opacity 0.3s ease',
                    fontSize: '16px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {secondaryItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                display: 'flex',
                borderRadius: 3,
                justifyContent: 'center',
                width: 'auto',
                alignItems: 'center',
                margin: selectedItem === item.link ? '0 8px' : '0',
                backgroundColor: selectedItem === item.link ? 'white' : 'inherit',
                transition: 'background-color 0.3s ease, margin 0.3s ease',
              }}
            >
              <ListItemButton
                onClick={item.link ? () => navigate(item.link) : handleOpenDialog}
                sx={{
                  minHeight: 30,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5, 
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: selectedItem === item.link ? 'white' : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: selectedItem === item.link ? '#0069A5' : '#ffffff',
                    fontSize: 30,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: selectedItem === item.link ? '#0069A5' : '#ffffff',
                    transition: 'color 0.3s ease, opacity 0.3s ease',
                    fontSize: '16px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div style={{ flexGrow: 1, padding: 24 }}>
        <Outlet />
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Logout Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}