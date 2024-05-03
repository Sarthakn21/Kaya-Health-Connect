import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
//icons
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MedicationIcon from "@mui/icons-material/Medication";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Stack } from "@mui/material";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "@/context/GlobalContext";
import { useContext } from "react";

import { useSnackbar } from "notistack";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "smoke",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

export default function SideDash() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(GlobalContext);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setOpenModal(false);
        setCurrentUser(null);
        localStorage.clear();
        navigate("/");
        enqueueSnackbar("Logout Successful", { variant: "success" });
      }
    } catch (error) {
      if (error.response.status == 401) {
        enqueueSnackbar("Invalid access", {
          variant: "error",
        });
        setCurrentUser(null);
        navigate("/login");
      }
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <div>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </div>
            <Typography variant="h5" noWrap component="div">
              Kaya Health Connect
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open || isHovered}
          sx={{
            display: "flex",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <DrawerHeader>
            <IconButton
              onClick={handleDrawerClose}
              sx={{ width: "100%", height: "100%", borderRadius: "0" }}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={handleDrawerClose}
            >
              <ListItemButton
                component={Link}
                to="/dashboard"
                sx={{
                  minHeight: 48,
                  justifyContent: open || isHovered ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open || isHovered ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{ opacity: open || isHovered ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={handleDrawerClose}
            >
              <ListItemButton
                component={Link}
                to="/patients"
                sx={{
                  minHeight: 48,
                  justifyContent: open || isHovered ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open || isHovered ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Patients"
                  sx={{ opacity: open || isHovered ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={handleDrawerClose}
            >
              <ListItemButton
                component={Link}
                to="/appointment"
                sx={{
                  minHeight: 48,
                  justifyContent: open || isHovered ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open || isHovered ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Appointment"
                  sx={{ opacity: open || isHovered ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            {currentUser?.role == "Doctor" && (
              <ListItem
                disablePadding
                sx={{ display: "block" }}
                onClick={handleDrawerClose}
              >
                <ListItemButton
                  component={Link}
                  to="/register"
                  sx={{
                    minHeight: 48,
                    justifyContent: open || isHovered ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open || isHovered ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <AccountBoxIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Register"
                    sx={{ opacity: open || isHovered ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={handleDrawerClose}
            >
              <ListItemButton
                onClick={handleOpenModal}
                sx={{
                  minHeight: 48,
                  justifyContent: open || isHovered ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open || isHovered ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  sx={{ opacity: open || isHovered ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={handleDrawerClose}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open || isHovered ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open || isHovered ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={currentUser?.username}
                  sx={{ opacity: open || isHovered ? 1 : 0, padding: "0" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure to Logout ?
            </Typography>
            <Stack spacing={2} direction="row" sx={{ marginTop: 3 }}>
              <Button variant="contained" onClick={handleLogout}>
                Yes
              </Button>
              <Button variant="contained" onClick={handleCloseModal}>
                No
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
