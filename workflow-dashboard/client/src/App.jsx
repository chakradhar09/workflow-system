import './App.css'; // Keep custom styles if any, or integrate MUI styling
import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Admin from './components/Admin.jsx';
import User from './components/User.jsx';

// Import Material-UI components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper'; // Import Paper
import Grid from '@mui/material/Grid'; // Import Grid

// Import Material-UI Icons (you might need to install @mui/icons-material)
// npm install @mui/icons-material
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';


// Define drawer width
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  


}),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  //
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// Placeholder component for the Dashboard content
const Dashboard = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <StyledPaper>
        <Typography variant="h6">Dashboard Section 1</Typography>
        {/* Add dashboard content here */}
      </StyledPaper>
    </Grid>
    <Grid item xs={12}>
       <StyledPaper>
        <Typography variant="h6">Dashboard Section 2</Typography>
        {/* Add more dashboard content here */}
      </StyledPaper>
    </Grid>
  </Grid>
);



function App() {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <AuthProvider> {/* Wrap with AuthProvider */}
        {/* Added Fragment here */}
        <React.Fragment>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBarStyled position="fixed" open={open}>
              <Toolbar>
                {/* You might want to add a button here to toggle the drawer */}
                <Typography variant="h6" noWrap component="div">
                  Workflow Dashboard
                </Typography>
              </Toolbar>
            </AppBarStyled>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerHeader>
                {/* Close button or logo could go here */}
                 <Typography variant="h6" noWrap component="div">
                  Navigation
                </Typography>
              </DrawerHeader>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/admin">
                    <ListItemIcon>
                      <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin Section" />
                  </ListItemButton>
                </ListItem>
                 <ListItem disablePadding>
                  <ListItemButton component={Link} to="/user">
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="User Section" />
                  </ListItemButton>
                </ListItem>
              </List>
              {/* You can add more sections or a second divider here */}
            </Drawer>
            <Main open={open}>
              <DrawerHeader /> {/* This is to push the content below the AppBar */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* Protect the /admin route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="/user" element={<User />} />
              </Routes>
            </Main>
          </Box>
        </React.Fragment>
      </AuthProvider>
    </Router>
  );
}

export default App;

// --- Authentication Context and Mock ---
const AuthContext = createContext(null);

// Mock user with a role for demonstration
const mockUser = { role: 'admin' }; // Change 'admin' to 'user' to test restricted access

const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={{ user: mockUser }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  return user && user.role === requiredRole ? children : <Navigate to="/" replace />;
};