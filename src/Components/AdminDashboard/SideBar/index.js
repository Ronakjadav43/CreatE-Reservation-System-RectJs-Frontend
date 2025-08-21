/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ListItemText from "@mui/material/ListItemText";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import BuildIcon from "@mui/icons-material/Build";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LivingIcon from "@mui/icons-material/Living";
import StyleIcon from "@mui/icons-material/Style";
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ChairIcon from "@mui/icons-material/Chair";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CallIcon from "@mui/icons-material/Call";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import StoreIcon from "@mui/icons-material/Store";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import ApiIcon from "@mui/icons-material/Api";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ReportIcon from "@mui/icons-material/Report";
import { Outlet, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { connect, useDispatch, useSelector } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import Navbar from "../../../CommonComponent/Navbar";
import * as UserAction from "../../../Action/AdminDashboard";
import {
  INPROGRESS,
  SET_OUTLET,
  SET_COMPANY,
  SET_MULTIPLE_COMPANY,
} from "../../../utils/AdminDashboard/Constant";
import { bindActionCreators } from "redux";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LabelTwoToneIcon from "@mui/icons-material/LabelTwoTone";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SmsIcon from "@mui/icons-material/Sms";
import TableBarIcon from "@mui/icons-material/TableBar";
import MultipleCompanySelection from "./MultipleCompanySelection";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../utils/userAccess";
import "./style.scss";

const drawerWidth = 310;

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

const SideBar = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [outlets, setOutlets] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [companys, setCompanys] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [activeCollapse, setActiveCollapse] = useState(null);
  const [generalSetting, setGeneralSetting] = useState(false);
  const location = useLocation();

  const hotelReducer = useSelector((state) => ({
    outletForDropDown: state.hotelReducer.outletForDropDown,
    selectedOutlet: state.hotelReducer.selectedOutlet,
    selectedCompany: state.hotelReducer.selectedCompany,
    isVisibleOutletSelection: state.hotelReducer.isVisibleOutletSelection,
    isVisibleCompanySelection: state.hotelReducer.isVisibleCompanySelection,
    isVisibleMultipleCompanySelection:
      state.hotelReducer.isVisibleMultipleCompanySelection,
    isVisibleOutlet: state.hotelReducer.isVisibleOutlet,
    isVisibleCompany: state.hotelReducer.isVisibleCompany,
    permission: state.hotelReducer.permission,
    multipleCompanies: state.hotelReducer.multipleCompanies,
  }));

  useEffect(() => {
    const splitsURLs = location.pathname.split("/");
    let buildURL = "";
    splitsURLs.map((url, index) => {
      if (index !== 0 && index <= 2) {
        buildURL += "/" + url;
      }
    });
    setActiveTab(buildURL);
    setActiveCollapse(buildURL);
    checkMaterialSettingDrawerOpen();
  }, [location.pathname]);

  useEffect(() => {
    if (hotelReducer.outletForDropDown) {
      const activeOutlets = hotelReducer.outletForDropDown.filter(
        (data) => data.outlet.isActive === true
      );
      setOutlets(activeOutlets);
    }
  }, [hotelReducer.outletForDropDown]);

  useEffect(() => {
    if (hotelReducer.multipleCompanies) {
      setCompanys([...hotelReducer.multipleCompanies]);
    }
  }, [hotelReducer.multipleCompanies]);

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      setSelectedOutlet(hotelReducer.selectedOutlet);
      props.actions.userAction.getAllPermission(
        hotelReducer.selectedOutlet.outlet.id
      );
    }
  }, [hotelReducer.selectedOutlet]);

  useEffect(() => {
    if (hotelReducer.selectedCompany) {
      setSelectedCompany(hotelReducer.selectedCompany);
    }
  }, [hotelReducer.selectedCompany]);

  const selectOutlet = (event) => {
    dispatch({ type: INPROGRESS });
    const outletId = event.target.value;
    const findOutlet = hotelReducer.outletForDropDown.find(
      (outlet) => outlet.outlet.id === Number(outletId)
    );
    dispatch({
      type: SET_OUTLET,
      data: findOutlet,
    });
  };

  const selectCompany = (event) => {
    dispatch({ type: INPROGRESS });
    const companyId = event.target.value;
    const findCompany = hotelReducer.multipleCompanies.find(
      (company) => company.id === Number(companyId)
    );
    dispatch({
      type: SET_COMPANY,
      data: findCompany,
    });
  };

  const logout = () => {
    props.actions.userAction.logout();
  };

  const redirect = (url, id) => {
    props.redirect(url);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleActiveTab = (id) => {
    setActiveCollapse(id);
    setGeneralSetting(false);
  };

  const checkMaterialSettingDrawerOpen = () => {
    if (
      location.pathname === "/Admin/Category" ||
      location.pathname === "/Admin/SubCategory"
    ) {
      setGeneralSetting(true);
    }
  };

  const setMultipleCompanys = (companies) => {
    setCompanys(companies);
    dispatch({
      type: SET_MULTIPLE_COMPANY,
      data: companies,
    });
  };

  return (
    <React.Fragment>
      {selectedOutlet?.outlet && outlets && hotelReducer.permission && (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open} className="main-header">
            <Toolbar>
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
              <Typography
                variant="h6"
                noWrap
                component="div"
                className="header-text"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                <Navbar />
              </Typography>

              <ValidatorForm autoComplete="off">
                <Box sx={{ display: "flex", gap: "10px", paddingTop: "5px" }}>
                  {hotelReducer.isVisibleOutletSelection && (
                    <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                      <InputLabel id="outlets-data">Outlet</InputLabel>
                      <Select
                        size="small"
                        labelId="outlets-data"
                        id="outlets-data"
                        value={selectedOutlet?.outlet.id}
                        label="Outlet"
                        onChange={selectOutlet}
                      >
                        {outlets.map((outlet, index) => (
                          <MenuItem key={index} value={outlet.outlet.id}>
                            {outlet.outlet.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {hotelReducer.isVisibleOutlet && (
                    <FormControl sx={{ m: 1, minWidth: 250 }}>
                      <TextValidator
                        fullWidth
                        size="small"
                        margin="normal"
                        type="text"
                        name="outlet"
                        value={selectedOutlet?.outlet.name}
                        placeholder="Enter Name"
                        sx={{ marginTop: 0 }}
                        variant="outlined"
                        label="Outlet"
                      />
                    </FormControl>
                  )}

                  {hotelReducer.isVisibleCompanySelection && (
                    <FormControl sx={{ minWidth: 250 }} size="small">
                      <InputLabel id="outlets-data">Brand</InputLabel>
                      <Select
                        size="small"
                        labelId="outlets-data"
                        id="outlets-data"
                        value={selectedCompany?.id}
                        label="Brand"
                        onChange={selectCompany}
                      >
                        {companys.map((company, index) => (
                          <MenuItem key={index} value={company.id}>
                            {company.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {hotelReducer.isVisibleMultipleCompanySelection &&
                    companys &&
                    companys.length > 0 && (
                      <MultipleCompanySelection
                        companys={[...companys]}
                        setMultipleCompanys={setMultipleCompanys}
                      />
                    )}

                  {hotelReducer.isVisibleCompany && (
                    <FormControl sx={{ m: 1, minWidth: 250 }}>
                      <TextValidator
                        fullWidth
                        size="small"
                        margin="normal"
                        type="text"
                        name="company"
                        value={selectedCompany.name}
                        sx={{ marginTop: 0 }}
                        variant="outlined"
                        label="Brand"
                      />
                    </FormControl>
                  )}
                </Box>
              </ValidatorForm>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader className="header">
              <img
                className="logo"
                src="/assets/images/Logo.png"
                alt="sidebar-header"
              />
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />

            <List className="sidebar-icon">
              <ListItemButton onClick={() => redirect("/Admin")}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" color="red" />
              </ListItemButton>

              {(handlePermission(
                hotelReducer.permission.permission,
                Modules.RESERVATIONMANAGEMENT,
                ActionType.read
              ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.TICKETING,
                  ActionType.read
                )) && (
                <ListItemButton
                  onClick={() => {
                    handleActiveTab(1);
                  }}
                >
                  <ListItemIcon>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reservation Management" />
                  {activeCollapse === 1 ||
                  activeCollapse === "/Admin/BookingOverview" ||
                  activeCollapse === "/Admin/Ticketing" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}

              <Collapse
                in={
                  activeCollapse === 1 ||
                  activeCollapse === "/Admin/BookingOverview" ||
                  activeCollapse === "/Admin/Ticketing"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.RESERVATIONMANAGEMENT,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/BookingOverview" ? "active" : ""
                      }
                      onClick={() =>
                        redirect("/Admin/BookingOverview/SeatingView")
                      }
                    >
                      <ListItemIcon>
                        <ContactMailIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Booking Overview" />
                    </ListItemButton>
                  )}
                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.TICKETING,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/Ticketing" ? "active" : ""
                      }
                      onClick={() => redirect("/Admin/Ticketing")}
                    >
                      <ListItemIcon>
                        <StorefrontIcon />
                      </ListItemIcon>
                      <ListItemText secondary=" Ticketing Set-up" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>

              {handlePermission(
                hotelReducer.permission.permission,
                Modules.CUSTOMERMANAGEMENT,
                ActionType.read
              ) && (
                <ListItemButton
                  className={
                    activeTab === "/Admin/CustomerManagement" ? "active" : ""
                  }
                  onClick={() => redirect("/Admin/CustomerManagement")}
                >
                  <ListItemIcon>
                    <PeopleAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customer-Management" />
                </ListItemButton>
              )}

              {handlePermission(
                hotelReducer.permission.permission,
                Modules.MATERIALS,
                ActionType.read
              ) && (
                <ListItemButton
                  className={activeTab === "/Admin/Materials" ? "active" : ""}
                  onClick={() => redirect("/Admin/Materials")}
                >
                  <ListItemIcon>
                    <DocumentScannerIcon />
                  </ListItemIcon>
                  <ListItemText primary="Materials" />
                </ListItemButton>
              )}

              {handlePermission(
                hotelReducer.permission.permission,
                Modules.CALLMANAGEMENT,
                ActionType.read
              ) && (
                <ListItemButton
                  className={activeTab === "/Admin/IvrsLogs" ? "active" : ""}
                  // sx={{ pl: 4 }}
                  onClick={() => redirect("/Admin/IvrsLogs")}
                >
                  <ListItemIcon>
                    <CallIcon />
                  </ListItemIcon>
                  <ListItemText primary="Call Management" />
                </ListItemButton>
              )}

              {handlePermission(
                hotelReducer.permission.CompanyPermission,
                Modules.REPORTS,
                ActionType.read
              ) && (
                <ListItemButton
                  onClick={() => {
                    handleActiveTab(10);
                  }}
                >
                  <ListItemIcon>
                    <ReportIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                  {activeCollapse === 10 ||
                  activeCollapse === "/Admin/ReservationSummary" ||
                  activeCollapse === "/Admin/CustomerReport" ||
                  activeCollapse === "/Admin/EventReport" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}

              <Collapse
                in={
                  activeCollapse === 10 ||
                  activeCollapse === "/Admin/ReservationSummary" ||
                  activeCollapse === "/Admin/CustomerReport" ||
                  activeCollapse === "/Admin/EventReport"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  <ListItemButton
                    sx={{ pl: 4 }}
                    className={
                      activeTab === "/Admin/ReservationSummary" ? "active" : ""
                    }
                    onClick={() => redirect("/Admin/ReservationSummary")}
                  >
                    <ListItemIcon>
                      <EventSeatIcon />
                    </ListItemIcon>
                    <ListItemText secondary="Reservation Summary" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    className={
                      activeTab === "/Admin/CustomerReport" ? "active" : ""
                    }
                    onClick={() => redirect("/Admin/CustomerReport")}
                  >
                    <ListItemIcon>
                      <StorefrontIcon />
                    </ListItemIcon>
                    <ListItemText secondary=" Customer Report" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    className={
                      activeTab === "/Admin/EventReport" ? "active" : ""
                    }
                    onClick={() => redirect("/Admin/EventReport")}
                  >
                    <ListItemIcon>
                      <EventBusyIcon />
                    </ListItemIcon>
                    <ListItemText secondary=" Event Report" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>

            <Divider />
            <List className="sidebar-icon">
              {(handlePermission(
                hotelReducer.permission.permission,
                Modules.USERGROUP,
                ActionType.read
              ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.USERLIST,
                  ActionType.read
                ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.USERGROUPACCESS,
                  ActionType.read
                )) && (
                <ListItemButton
                  onClick={() => {
                    handleActiveTab(2);
                  }}
                >
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Access" />
                  {activeCollapse === 2 ||
                  activeCollapse === "/Admin/UserGroup" ||
                  activeCollapse === "/Admin/userList" ||
                  activeCollapse === "/Admin/UserGroupAccess" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}
              <Collapse
                in={
                  activeCollapse === 2 ||
                  activeCollapse === "/Admin/UserGroup" ||
                  activeCollapse === "/Admin/userList" ||
                  activeCollapse === "/Admin/UserGroupAccess"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.USERGROUP,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/UserGroup" ? "active" : ""
                      }
                      onClick={() => redirect("/Admin/UserGroup")}
                    >
                      <ListItemIcon>
                        <GroupOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText secondary="User Group" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.USERLIST,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/userList" ? "active" : ""
                      }
                      onClick={() => redirect("/Admin/userList")}
                    >
                      <ListItemIcon>
                        <PermIdentityOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText secondary="User List" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.USERGROUPACCESS,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/UserGroupAccess" ? "active" : ""
                      }
                      onClick={() => redirect("/Admin/UserGroupAccess")}
                    >
                      <ListItemIcon>
                        <GroupOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText secondary="User Group Access" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>

              {(handlePermission(
                hotelReducer.permission.permission,
                Modules.OUTLETMANAGEMENT,
                ActionType.read
              ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.COMPANYMANAGEMENT,
                  ActionType.read
                )) && (
                <ListItemButton onClick={() => handleActiveTab(3)}>
                  <ListItemIcon>
                    <ApartmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Accounts Management" />
                  {activeCollapse === 3 ||
                  activeCollapse === "/Admin/OutletList" ||
                  activeCollapse === "/Admin/OutletManagement" ||
                  activeCollapse === "/Admin/BrandManagement" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}
              <Collapse
                in={
                  activeCollapse === 3 ||
                  activeCollapse === "/Admin/OutletList" ||
                  activeCollapse === "/Admin/OutletManagement" ||
                  activeCollapse === "/Admin/BrandManagement"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.OUTLETMANAGEMENT,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/OutletList" ||
                        activeTab === "/Admin/OutletManagement"
                          ? "active"
                          : ""
                      }
                      onClick={() => redirect("/Admin/OutletList")}
                    >
                      <ListItemIcon>
                        <StorefrontIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Outlet Management" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.COMPANYMANAGEMENT,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      className={
                        activeTab === "/Admin/BrandManagement" ? "active" : ""
                      }
                      sx={{ pl: 4 }}
                      onClick={() => redirect("/Admin/BrandManagement")}
                    >
                      <ListItemIcon>
                        <StoreIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Brand Management" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
              {(handlePermission(
                hotelReducer.permission.permission,
                Modules.SEATPLANS,
                ActionType.read
              ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.SEATTYPE,
                  ActionType.read
                ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.TABLEMANAGEMENT,
                  ActionType.read
                ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.SPACES,
                  ActionType.read
                )) && (
                <ListItemButton onClick={() => handleActiveTab(4)}>
                  <ListItemIcon>
                    <AirlineSeatReclineExtraIcon />
                  </ListItemIcon>
                  <ListItemText primary="Seat Management" />
                  {activeCollapse === 4 ||
                  activeCollapse === "/Admin/SeatPlans" ||
                  activeCollapse === "/Admin/Spaces" ||
                  activeCollapse === "/Admin/SeatType" ||
                  activeCollapse === "/Admin/TableManagement" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}

              <Collapse
                in={
                  activeCollapse === 4 ||
                  activeCollapse === "/Admin/SeatPlans" ||
                  activeCollapse === "/Admin/Spaces" ||
                  activeCollapse === "/Admin/SeatType" ||
                  activeCollapse === "/Admin/TableManagement"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.SEATPLANS,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      className={
                        activeTab === "/Admin/SeatPlans" ? "active" : ""
                      }
                      sx={{ pl: 4 }}
                      onClick={() => redirect("/Admin/SeatPlans")}
                    >
                      <ListItemIcon>
                        <ChairAltIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Seat Plans" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.SPACES,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      className={activeTab === "/Admin/Spaces" ? "active" : ""}
                      sx={{ pl: 4 }}
                      onClick={() => redirect("/Admin/Spaces")}
                    >
                      <ListItemIcon>
                        <ChairIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Spaces" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.SEATTYPE,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      className={
                        activeTab === "/Admin/SeatType" ? "active" : ""
                      }
                      sx={{ pl: 4 }}
                      onClick={() => redirect("/Admin/SeatType")}
                    >
                      <ListItemIcon>
                        <LivingIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Seat Type" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.TABLEMANAGEMENT,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/TableManagement" ? "active" : ""
                      }
                      onClick={() => redirect("/Admin/TableManagement")}
                    >
                      <ListItemIcon>
                        <TableBarIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Table Management" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>

              {(handlePermission(
                hotelReducer.permission.permission,
                Modules.TAGCATEGORY,
                ActionType.read
              ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.AUTOTAGGING,
                  ActionType.read
                ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.TAGS,
                  ActionType.read
                )) && (
                <ListItemButton onClick={() => handleActiveTab(5)}>
                  <ListItemIcon>
                    <LabelTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tags Management" />
                  {activeCollapse === 5 ||
                  activeCollapse === "/Admin/TagCategory" ||
                  activeCollapse === "/Admin/AutoTagging" ||
                  activeCollapse === "/Admin/Tags" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}

              <Collapse
                in={
                  activeCollapse === 5 ||
                  activeCollapse === "/Admin/TagCategory" ||
                  activeCollapse === "/Admin/AutoTagging" ||
                  activeCollapse === "/Admin/Tags"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.TAGCATEGORY,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      className={
                        activeTab === "/Admin/TagCategory" ? "active" : ""
                      }
                      onClick={() => redirect("/Admin/TagCategory")}
                    >
                      <ListItemIcon>
                        <StyleIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Tag Category" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.TAGS,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      className={activeTab === "/Admin/Tags" ? "active" : ""}
                      sx={{ pl: 4 }}
                      onClick={() => redirect("/Admin/Tags")}
                    >
                      <ListItemIcon>
                        <BookmarksIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Tags" />
                    </ListItemButton>
                  )}

                  {handlePermission(
                    hotelReducer.permission.permission,
                    Modules.AUTOTAGGING,
                    ActionType.read
                  ) && (
                    <ListItemButton
                      className={
                        activeTab === "/Admin/AutoTagging" ? "active" : ""
                      }
                      sx={{ pl: 4 }}
                      onClick={() => redirect("/Admin/AutoTagging")}
                    >
                      <ListItemIcon>
                        <CheckBoxOutlineBlankIcon />
                      </ListItemIcon>
                      <ListItemText secondary="Auto Tagging" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>

              {(handlePermission(
                hotelReducer.permission.permission,
                Modules.RESERVEDKEYWORDS,
                ActionType.read
              ) ||
                handlePermission(
                  hotelReducer.permission.CompanyPermission,
                  Modules.IVRSCONFIGURATION,
                  ActionType.read
                ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.MATERIALCATEGORY,
                  ActionType.read
                ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.MATERIALSUBCATEGORY,
                  ActionType.read
                )) && (
                <ListItemButton onClick={() => handleActiveTab(6)}>
                  <ListItemIcon>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText primary="System Settings" />
                  {activeCollapse === 6 ||
                  activeCollapse === "/Admin/ReservedKeywords" ||
                  activeCollapse === "/Admin/ApiLogs" ||
                  activeCollapse === "/Admin/IvrsConfiguration" ||
                  activeCollapse === "/Admin/Category" ||
                  activeCollapse === "/Admin/SubCategory" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}

              <Collapse
                in={
                  activeCollapse === 6 ||
                  activeCollapse === "/Admin/ReservedKeywords" ||
                  activeCollapse === "/Admin/IvrsConfiguration" ||
                  activeCollapse === "/Admin/Twilio" ||
                  activeCollapse === "/Admin/ApiLogs" ||
                  activeCollapse === "/Admin/Category" ||
                  activeCollapse === "/Admin/SubCategory"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.RESERVEDKEYWORDS,
                  ActionType.read
                ) && (
                  <ListItemButton
                    className={
                      activeTab === "/Admin/ReservedKeywords" ? "active" : ""
                    }
                    sx={{ pl: 4 }}
                    onClick={() => redirect("/Admin/ReservedKeywords")}
                  >
                    <ListItemIcon>
                      <KeyOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText secondary="Reserved Keywords" />
                  </ListItemButton>
                )}

                {/* {handlePermission(
                  hotelReducer.permission.CompanyPermission,
                  Modules.IVRSCONFIGURATION,
                  ActionType.read
                ) && (
                  <ListItemButton
                    className={
                      activeTab === "/Admin/IvrsConfiguration" ? "active" : ""
                    }
                    sx={{ pl: 4 }}
                    onClick={() => redirect("/Admin/IvrsConfiguration")}
                  >
                    <ListItemIcon>
                      <SmsIcon />
                    </ListItemIcon>
                    <ListItemText secondary="IVRS Configuration" />
                  </ListItemButton>
                )} */}

                <ListItemButton
                  sx={{ pl: 4 }}
                  className={activeTab === "/Admin/ApiLogs" ? "active" : ""}
                  onClick={() => redirect("/Admin/ApiLogs")}
                >
                  <ListItemIcon>
                    <ApiIcon />
                  </ListItemIcon>
                  <ListItemText secondary="Api Logs" />
                </ListItemButton>

                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.IVRSCONFIGURATION,
                  ActionType.read
                ) && (
                  <ListItemButton
                    className={activeTab === "/Admin/Twilio" ? "active" : ""}
                    sx={{ pl: 4 }}
                    onClick={() => redirect("/Admin/Twilio")}
                  >
                    <ListItemIcon>
                      <PendingOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText secondary="Twilio Configration" />
                  </ListItemButton>
                )}
              </Collapse>

              {(handlePermission(
                hotelReducer.permission.permission,
                Modules.MATERIALCATEGORY,
                ActionType.read
              ) ||
                handlePermission(
                  hotelReducer.permission.permission,
                  Modules.MATERIALSUBCATEGORY,
                  ActionType.read
                )) && (
                <Collapse
                  in={
                    generalSetting ||
                    activeCollapse === 6 ||
                    activeCollapse === "/Admin/ReservedKeywords" ||
                    activeCollapse === "/Admin/IvrsConfiguration" ||
                    activeCollapse === "/Admin/Twilio" ||
                    activeCollapse === "/Admin/ApiLogs" ||
                    activeCollapse === "/Admin/Category" ||
                    activeCollapse === "/Admin/SubCategory"
                  }
                  timeout="auto"
                  unmountOnExit
                  className="user-access-collapse"
                >
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => setGeneralSetting(!generalSetting)}
                  >
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText secondary="Material Settings" />
                    {generalSetting ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse
                    in={generalSetting}
                    timeout="auto"
                    unmountOnExit
                    className="user-access-collapse"
                  >
                    <List
                      component="div"
                      disablePadding
                      className="user-access-list"
                    >
                      {handlePermission(
                        hotelReducer.permission.permission,
                        Modules.MATERIALCATEGORY,
                        ActionType.read
                      ) && (
                        <ListItemButton
                          className={
                            activeTab === "/Admin/Category" ? "active" : ""
                          }
                          sx={{ pl: 6 }}
                          onClick={() => redirect("/Admin/Category")}
                        >
                          <ListItemIcon>
                            <CategoryIcon />
                          </ListItemIcon>
                          <ListItemText secondary="Category" />
                        </ListItemButton>
                      )}
                      {handlePermission(
                        hotelReducer.permission.permission,
                        Modules.MATERIALSUBCATEGORY,
                        ActionType.read
                      ) && (
                        <ListItemButton
                          className={
                            activeTab === "/Admin/SubCategory" ? "active" : ""
                          }
                          sx={{ pl: 6 }}
                          onClick={() => redirect("/Admin/SubCategory")}
                        >
                          <ListItemIcon>
                            <AssignmentIcon />
                          </ListItemIcon>
                          <ListItemText secondary="Sub Category" />
                        </ListItemButton>
                      )}
                    </List>
                  </Collapse>
                </Collapse>
              )}

              {handlePermission(
                hotelReducer.permission.CompanyPermission,
                Modules.MARKETING,
                ActionType.read
              ) && (
                <ListItemButton onClick={() => handleActiveTab(8)}>
                  <ListItemIcon className="sidebar2-icon">
                    <CurrencyYenIcon />
                  </ListItemIcon>
                  <ListItemText primary="Marketing" />
                  {activeCollapse === 8 ||
                  activeCollapse === "/Admin/Integration" ||
                  activeCollapse === "/Admin/CustomerList" ||
                  activeCollapse === "/Admin/CustomerCriteria" ||
                  activeCollapse === "/Admin/CustomerCriteriaList" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}

              <Collapse
                in={
                  activeCollapse === 8 ||
                  activeCollapse === "/Admin/Integration" ||
                  activeCollapse === "/Admin/CustomerList" ||
                  activeCollapse === "/Admin/CustomerCriteria" ||
                  activeCollapse === "/Admin/CustomerCriteriaList"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  <ListItemButton
                    sx={{ pl: 4 }}
                    className={
                      activeTab === "/Admin/Integration" ? "active" : ""
                    }
                    onClick={() => redirect("/Admin/Integration")}
                  >
                    <ListItemIcon>
                      <IntegrationInstructionsIcon />
                    </ListItemIcon>
                    <ListItemText secondary="Integration" />
                  </ListItemButton>

                  <ListItemButton
                    className={
                      activeTab === "/Admin/CustomerList" ||
                      activeTab === "/Admin/CustomerCriteria" ||
                      activeTab === "/Admin/CustomerCriteriaList"
                        ? "active"
                        : ""
                    }
                    sx={{ pl: 4 }}
                    onClick={() => redirect("/Admin/CustomerCriteriaList")}
                  >
                    <ListItemIcon>
                      <SupportAgentIcon />
                    </ListItemIcon>
                    <ListItemText secondary="Customer Criteria" />
                  </ListItemButton>
                </List>
              </Collapse>

              {handlePermission(
                hotelReducer.permission.permission,
                Modules.SUPERUSER,
                ActionType.read
              ) && (
                <ListItemButton onClick={() => handleActiveTab(9)}>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Super Access" />
                  {activeCollapse === 9 ||
                  activeCollapse === "/Admin/SuperUsers" ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </ListItemButton>
              )}
              <Collapse
                in={
                  activeCollapse === 9 || activeCollapse === "/Admin/SuperUsers"
                }
                timeout="auto"
                unmountOnExit
                className="user-access-collapse"
              >
                <List
                  component="div"
                  disablePadding
                  className="user-access-list"
                >
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => redirect("/Admin/SuperUsers")}
                  >
                    <ListItemIcon>
                      <PermIdentityOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText secondary="Super Users" />
                  </ListItemButton>
                </List>
              </Collapse>
              <ListItemButton onClick={() => logout()}>
                <ListItemIcon>
                  <RocketLaunchIcon />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </List>
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              paddingTop: "84px",
              paddingBottom: "50px !important",
            }}
          >
            <Outlet context={{ open }} />
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(SideBar);
