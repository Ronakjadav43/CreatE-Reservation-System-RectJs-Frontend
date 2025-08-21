/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, CardMedia, IconButton, Tab } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as CustomerAction from "../../../Action/Customer";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import "./style.scss";

const ReservationStep1 = (props) => {
  const [value, setValue] = useState("2");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (props.events !== null && props.events.length < 1) {
      props.handleChange({
        target: {
          name: "bookingType",
          value: "NORMAL_RESERVATION",
        },
      });
    }
  }, [props.events]);

  return (
    <div className="stepper-one">
      {/* <div className="reservation-inner"> */}
      {/* <Box sx={{ width: "100%", typography: "body1" }}> */}
      <h1
        style={{ marginBottom: "20px", padding: "0 20px" }}
        className="stepper-header-text"
      >
        Select Reservation Type
      </h1>

      <TabContext value={value}>
        <Box className="stepper-one-header">
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Featured" value="1" />
            <Tab label="All Experiences" value="2" />
          </TabList>
        </Box>

        <TabPanel value="1" className="restaurant-list">
          <div className="restaurant-list-inner">
            <Card className="cards">
              <div className="card-inner">
                <CardMedia
                  component="img"
                  image={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.company.image}`}
                  alt="Paella dish"
                />

                <div className="card-info">
                  <div className="restaurant-name">Restaurant Reservation</div>

                  <div className="pay-info"></div>

                  <Button
                    className="reservation-btn"
                    variant="outlined"
                    onClick={() =>
                      props.handleChange({
                        target: { name: "bookingType", value: "event" },
                      })
                    }
                  >
                    Make Reservation
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="cards">
              <div className="card-inner">
                <CardMedia
                  component="img"
                  image="/assets/Hotels/hotel-1.jpeg"
                  alt="Paella dish"
                />

                <div className="card-info">
                  <div className="restaurant-name">Event</div>

                  <div className="pay-info">
                    <IconButton aria-label="share" className="card-footer">
                      <AccountBalanceWalletOutlinedIcon />{" "}
                      <span className="text">Deposit</span>
                    </IconButton>
                  </div>

                  <Button
                    className="reservation-btn"
                    variant="outlined"
                    onClick={() =>
                      props.handleChange({
                        target: { name: "bookingType", value: "event" },
                      })
                    }
                  >
                    Make Reservation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabPanel>

        {/* no */}

        <TabPanel value="2" className="restaurant-list">
          <div className="restaurant-list-inner">
            <Card className="cards">
              <div className="card-inner">
                <CardMedia
                  component="img"
                  image={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.company.image}`}
                  alt="Paella dish"
                />

                <div className="card-info">
                  <div className="restaurant-name">Restaurant Reservation</div>
                  <div className="pay-info"></div>
                  <Button
                    className="reservation-btn"
                    variant="outlined"
                    onClick={() =>
                      props.handleChange({
                        target: {
                          name: "bookingType",
                          value: "NORMAL_RESERVATION",
                        },
                      })
                    }
                  >
                    Make Reservation
                  </Button>
                </div>
              </div>
            </Card>

            {props.events &&
              props.events.map((event, index) => (
                <Card key={index} className="cards">
                  <div className="card-inner">
                    <CardMedia
                      component="img"
                      image={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${event.image}`}
                      alt="Event"
                    />

                    <div className="card-info">
                      <div className="restaurant-name">{event.name}</div>

                      <div className="pay-info">
                        <IconButton
                          aria-label="add to favorites"
                          className="card-footer"
                        >
                          <HomeIcon />
                          <span className="text">{event.Outlet.name}</span>
                        </IconButton>
                        <IconButton
                          aria-label="add to favorites"
                          className="card-footer"
                        >
                          <PeopleAltIcon />
                          <span className="text">
                            {event.ticketMaxQuantity} Pax
                          </span>
                        </IconButton>
                        <IconButton aria-label="share" className="card-footer">
                          <AccountBalanceWalletOutlinedIcon />
                          <span className="text">${event.amount}</span>
                        </IconButton>
                      </div>

                      <Button
                        className="reservation-btn"
                        variant="outlined"
                        onClick={() => props.handleSelectEvent(event)}
                      >
                        Make Reservation
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabPanel>
      </TabContext>
      {/* </Box> */}
      {/* </div> */}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(ReservationStep1);
