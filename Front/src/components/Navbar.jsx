import React, { useContext, useState } from "react";
import { 
  AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, 
  ListItemIcon, ListItemText, Divider, IconButton, Drawer, 
  List, ListItem
} from "@mui/material";
import { 
  Person, Dashboard, Assessment, Leaderboard, Payment, 
  Logout, Quiz, ContactSupport, Info, Description as ResumeIcon,
  Menu as MenuIcon, Home
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import styles from "../styles/components/Navbar.module.css";
import ThemeToggle from './ThemeToggle';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reachOutAnchorEl, setReachOutAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/auth");
    setMobileOpen(false);
  };

  const handleCloseAll = () => {
    setMobileOpen(false);
    handleCloseUserMenu();
    handleCloseReachOut();
  };

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleOpenReachOut = (event) => {
    setReachOutAnchorEl(event.currentTarget);
  };

  const handleCloseReachOut = () => {
    setReachOutAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ 
      width: { xs: '70vw', sm: 250 }, // Responsive width
      maxWidth: '280px', // Maximum width on mobile
      padding: 2, 
      height: '100%', 
      backgroundColor: darkMode ? '#121212' : '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <List>
        {/* Section Headers - Not clickable */}
        <ListItem>
          <ListItemText 
            primary="Navigation" 
            sx={{ 
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontSize: '0.875rem'
            }} 
          />
        </ListItem>

        {/* Clickable Items */}
        <ListItem 
          component={Link} 
          to="/" 
          onClick={handleCloseAll}
          sx={{ 
            '&:hover': { bgcolor: 'action.hover' }, 
            cursor: 'pointer',
            borderRadius: '8px',
            mb: 0.5 
          }}
        >
          <ListItemIcon>
            <Home sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem 
          component={Link} 
          to="/quizzes" 
          onClick={handleCloseAll}
          sx={{ 
            '&:hover': { bgcolor: 'action.hover' }, 
            cursor: 'pointer',
            borderRadius: '8px',
            mb: 0.5 
          }}
        >
          <ListItemIcon>
            <Quiz sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
          </ListItemIcon>
          <ListItemText primary="Quizzes" />
        </ListItem>

        <Divider sx={{ my: 1.5 }} />

        {/* User Section */}
        {user ? (
          <>
            {/* Profile Section */}
            <ListItem>
              <ListItemText 
                primary="Profile" 
                sx={{ 
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  fontSize: '0.875rem'
                }} 
              />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/profile" 
              onClick={handleCloseAll}
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' }, 
                cursor: 'pointer',
                borderRadius: '8px',
                mb: 0.5 
              }}
            >
              <ListItemIcon>
                <Person sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/dashboard" 
              onClick={handleCloseAll}
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' }, 
                cursor: 'pointer',
                borderRadius: '8px',
                mb: 0.5 
              }}
            >
              <ListItemIcon>
                <Dashboard sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            {/* Activities Section */}
            <ListItem sx={{ mt: 1.5 }}>
              <ListItemText 
                primary="Activities" 
                sx={{ 
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  fontSize: '0.875rem'
                }} 
              />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/leaderboard" 
              onClick={handleCloseAll}
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' }, 
                cursor: 'pointer',
                borderRadius: '8px',
                mb: 0.5 
              }}
            >
              <ListItemIcon>
                <Leaderboard sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
              </ListItemIcon>
              <ListItemText primary="Leaderboard" />
            </ListItem>

            {/* Tools Section */}
            <ListItem sx={{ mt: 1.5 }}>
              <ListItemText 
                primary="Tools" 
                sx={{ 
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  fontSize: '0.875rem'
                }} 
              />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/resume-builder" 
              onClick={handleCloseAll}
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' }, 
                cursor: 'pointer',
                borderRadius: '8px',
                mb: 0.5 
              }}
            >
              <ListItemIcon>
                <ResumeIcon sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
              </ListItemIcon>
              <ListItemText primary="Resume Builder" />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/payment" 
              onClick={handleCloseAll}
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' }, 
                cursor: 'pointer',
                borderRadius: '8px',
                mb: 0.5 
              }}
            >
              <ListItemIcon>
                <Payment sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
              </ListItemIcon>
              <ListItemText primary="Payment" />
            </ListItem>
          </>
        ) : (
          <ListItem 
            component={Link} 
            to="/auth" 
            onClick={handleCloseAll}
            sx={{ 
              '&:hover': { bgcolor: 'action.hover' }, 
              cursor: 'pointer',
              borderRadius: '8px',
              mb: 0.5 
            }}
          >
            <ListItemIcon>
              <Person sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}

        {/* Help & Support Section */}
        <ListItem sx={{ mt: 1.5 }}>
          <ListItemText 
            primary="Help & Support" 
            sx={{ 
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontSize: '0.875rem'
            }} 
          />
        </ListItem>
        <ListItem 
          component={Link} 
          to="/about-us" 
          onClick={handleCloseAll}
          sx={{ 
            '&:hover': { bgcolor: 'action.hover' }, 
            cursor: 'pointer',
            borderRadius: '8px',
            mb: 0.5 
          }}
        >
          <ListItemIcon>
            <Info sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
          </ListItemIcon>
          <ListItemText primary="About Us" />
        </ListItem>
        <ListItem 
          component={Link} 
          to="/contact-us" 
          onClick={handleCloseAll}
          sx={{ 
            '&:hover': { bgcolor: 'action.hover' }, 
            cursor: 'pointer',
            borderRadius: '8px',
            mb: 0.5 
          }}
        >
          <ListItemIcon>
            <ContactSupport sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
          </ListItemIcon>
          <ListItemText primary="Contact Us" />
        </ListItem>
      </List>

      {/* Logout Section - At the bottom */}
      {user && (
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <Divider sx={{ my: 1.5 }} />
          <ListItem 
            onClick={handleLogout}
            sx={{ 
              '&:hover': { bgcolor: 'action.hover' }, 
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            <ListItemIcon>
              <Logout sx={{ color: darkMode ? '#fff' : '#1a237e' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      )}
    </Box>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar position="fixed" className={styles.navbar}>
        <Toolbar className={styles.toolbar}>
          {/* Mobile Menu Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                mr: 1
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo/Brand */}
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              className={styles.brand}
            >
              QuizMaster
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 2,
            flexGrow: 0
          }}>
            {/* Quizzes Button */}
            <Button
              color="inherit"
              component={Link}
              to="/quizzes"
              startIcon={<Quiz />}
              className={styles.navButton}
            >
              Quizzes
            </Button>

            {/* Reach Out Dropdown */}
            <Button
              color="inherit"
              onClick={handleOpenReachOut}
              startIcon={<ContactSupport />}
              className={styles.navButton}
            >
              Reach Out to Us
            </Button>
            <Menu
              anchorEl={reachOutAnchorEl}
              open={Boolean(reachOutAnchorEl)}
              onClose={handleCloseReachOut}
            >
              <MenuItem 
                component={Link} 
                to="/about-us"
                onClick={handleCloseReachOut}
              >
                <ListItemIcon>
                  <Info fontSize="small" />
                </ListItemIcon>
                <ListItemText>About Us</ListItemText>
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/contact-us"
                onClick={handleCloseReachOut}
              >
                <ListItemIcon>
                  <ContactSupport fontSize="small" />
                </ListItemIcon>
                <ListItemText>Contact Us</ListItemText>
              </MenuItem>
            </Menu>

            {user && (
              <>
                {/* User Menu */}
                <Button
                  color="inherit"
                  onClick={handleOpenUserMenu}
                  startIcon={<Person />}
                  className={styles.userButton}
                >
                  {user.username}
                </Button>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleCloseUserMenu}
                  className={styles.userMenu}
                >
                  <MenuItem 
                    component={Link} 
                    to="/profile"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/dashboard"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/leaderboard"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Leaderboard fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Leaderboard</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/payment"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Payment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Payment</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/resume-builder"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <ResumeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Resume Builder</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Theme Toggle & Mobile User Icon */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            {user && (
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' } }}
                color="inherit"
                onClick={handleOpenUserMenu}
              >
                <Person />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{ paper: styles.drawer }}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </motion.div>
  );
};

export default Navbar;