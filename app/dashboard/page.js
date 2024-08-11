'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Grid,
  Paper,
  Menu,
  MenuItem,
  InputBase,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  SmartToy as SmartToyIcon,
  CameraAlt as CameraAltIcon,
  Mic as MicIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { getUserInventory } from '../services/firebaseService';
import AddEditItemModal from '../components/AddEditItemModal';

// Dashboard CSS
const drawerWidth = 240;

export default function Dashboard() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const open = Boolean(anchorEl);

  const fetchInventory = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        console.error("User ID is not available");
        return;
      }
      const items = await getUserInventory(session.user.id);
      if (Array.isArray(items)) {
        setInventoryItems(items);
      } else {
        console.error("Fetched inventory is not an array:", items);
        setInventoryItems([]);
      }
    } catch (error) {
      console.error("Error fetching inventory: ", error);
      setInventoryItems([]);
    }
  }, [session?.user?.id]);

  const handleItemAdded = useCallback(async (newItem) => {
    try {
      // Update the local state immediately
      setInventoryItems(prevItems => {
        const updatedItems = [...prevItems];
        const existingItemIndex = updatedItems.findIndex(item => item.id === newItem.id);
        if (existingItemIndex !== -1) {
          // Update existing item
          updatedItems[existingItemIndex] = newItem;
        } else {
          // Add new item
          updatedItems.push(newItem);
        }
        return updatedItems;
      });

      // Close the modal after successful addition
      setModalOpen(false);

      // Optionally, you can still fetch the entire inventory to ensure sync
      await fetchInventory();
    } catch (error) {
      console.error("Error adding/updating item:", error);
      alert("Failed to add/update item. Please try again.");
    }
  }, [fetchInventory]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchInventory();
    }
  }, [session, fetchInventory]);

  if (!session) {
    return <Typography variant="h4" align="center" p={10}>Loading...</Typography>;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Pantry Manager
        </Typography>
        <IconButton onClick={toggleSidebar} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon /> },
          { text: 'Inventory', icon: <InventoryIcon /> },
          { text: 'Recipes', icon: <RestaurantIcon /> },
          { text: 'Shopping', icon: <ShoppingCartIcon /> },
          { text: 'Analytics', icon: <BarChartIcon /> },
          { text: 'AI Assistant', icon: <SmartToyIcon /> },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={toggleSidebar}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Add
        </Typography>
        <List>
          {[
            //{ text: 'Barcode', icon: <AddIcon /> },
            { text: 'Camera', icon: <CameraAltIcon /> },
            //{ text: 'Voice', icon: <MicIcon /> },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Added Milk" secondary="2 minutes ago" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Updated Inventory" secondary="1 hour ago" />
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Dashboard text removed */}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 1, padding: '0 10px' }}>
            <SearchIcon />
            <InputBase
              placeholder="Search..."
              sx={{ ml: 1, color: 'inherit', width: '200px' }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar alt={session.user.name} src={session.user.image} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            transform: sidebarOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
            transition: 'transform 0.3s ease-in-out'
          },
        }}
        open={sidebarOpen}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: 'margin 0.3s ease-in-out',
          mb: { xs: 7, sm: 0 }
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Overview
        </Typography>
        <Grid container spacing={3}>
          {['Total Items: 150', 'Low Stock: 12', 'Expiring Soon: 8', 'Categories: 15'].map((text) => (
            <Grid item xs={12} sm={6} md={3} key={text}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Inventory Grid
        </Typography>
        <Grid container spacing={3}>
          {inventoryItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography>Qty: {item.quantity}</Typography>
                {item.imageUrl && (
                  <Box sx={{ height: 100, my: 2 }}>
                    <Image src={item.imageUrl} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                  </Box>
                )}
                <Typography>Exp: {item.expiryDate}</Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => handleEditItem(item)}>
                  Edit
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddItem}>
          Add New Item
        </Button>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          AI-Powered Insights
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Suggested Recipes
              </Typography>
              <Typography>1. Apple Pie</Typography>
              <Typography>2. Banana Bread</Typography>
              <Button variant="text" sx={{ mt: 1 }}>
                View All Recipes
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Shopping List
              </Typography>
              <Typography>- Flour</Typography>
              <Typography>- Sugar</Typography>
              <Button variant="text" sx={{ mt: 1 }}>
                View Full List
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: { sm: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={0}
            onChange={(event, newValue) => {
              // Handle tab change
            }}
          >
            <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
            <BottomNavigationAction label="Inventory" icon={<InventoryIcon />} />
            <BottomNavigationAction label="Recipes" icon={<RestaurantIcon />} />
            <BottomNavigationAction label="More" icon={<MoreHorizIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {/* Add profile functionality */ }}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={() => {/* Add settings functionality */ }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
      <AddEditItemModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        item={selectedItem}
        userId={session?.user?.id}
        onItemAdded={handleItemAdded}
      />
    </Box>
  );
}