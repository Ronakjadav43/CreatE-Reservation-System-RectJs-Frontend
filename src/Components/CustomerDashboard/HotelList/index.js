/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, CardMedia } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import * as CustomerAction from "../../../Action/Customer";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import "./style.scss";

const HotelList = (props) => {
  const [companies, setCompanies] = useState([]);

  const customerReducer = useSelector((state) => ({
    companies: state.customerReducer.companies,
  }));

  useEffect(() => {
    props.actions.customerAction.getCompany();
  }, []);

  useEffect(() => {
    if (customerReducer.companies) {
      setCompanies(customerReducer.companies);
    }
  }, [customerReducer.companies]);

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="main-iframe">
      <div className="main-div">
        <div className="main">
          <div className="main-body">
            <div className="stepper-one">
              <h1 style={{ width: "100%", textAlign: "center" }}>Restaurant</h1>

              <div className="restaurant-list">
                <div className="restaurant-list-inner">
                  {companies.map((company, index) => (
                    <Card className="cards">
                      <div className="card-inner">
                        <CardMedia
                          component="img"
                          image={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${company.image}`}
                          sx={{ borderRadius: "10px", objectFit: "unset" }}
                          alt="CompanyImage"
                        />
                        <div className="card-info">
                          <div className="restaurant-name">{company.name}</div>

                          <Button
                            className="reservation-btn"
                            variant="outlined"
                            onClick={() =>
                              openInNewTab(`HotelReservation/${company.key}`)
                            }
                          >
                            Make Reservation
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(HotelList);
