/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as UserAction from "../../../Action/AdminDashboard";
import CustomerList from "./CustomerList";
import TabMenu from "./TabMenu";
import "./style.scss";
import { isEmpty } from "lodash";
import {
  SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_VISIBLE_SELECTION,
} from "../../../utils/AdminDashboard/Constant";

const CustomerManagement = (props) => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isProfileTabActive, setIsProfileTabActive] = useState(false);

  const filterselection = [
    { id: "ALL", value: "All" },
    { id: "UPCOMING", value: "Upcoming Customer" },
  ];

  const [filters, setFilters] = useState({
    filter: filterselection[0].id,
    companyIds: [],
  });

  const multipleCompanies = useSelector(
    (state) => state.hotelReducer.multipleCompanies
  );

  const customers = useSelector((state) => state.hotelReducer.customers);
  const chunkRisk = useSelector((state) => state.hotelReducer.chunkRisk);

  const handleChangeFilter = (event) => {
    const field = event.target.name;
    let commonData = { ...filters };
    commonData[field] = event.target.value;
    return setFilters(commonData);
  };

  useEffect(() => {
    dispatch({
      type: SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
    });
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });
    return () => {
      dispatch({
        type: SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
      });
      dispatch({
        type: SET_VISIBLE_SELECTION,
      });
      setIsProfileTabActive(false);
    };
  }, []);

  useEffect(() => {
    if (filters.companyIds.length > 0) {
      setCustomer(null);
      props.actions.userAction.getAllCustomer(filters);
    }
  }, [filters]);

  useEffect(() => {
    if (multipleCompanies && multipleCompanies.length > 0) {
      const mappedCompany = multipleCompanies.filter(
        (company) => company.isChecked === true && company.name !== "All"
      );

      setFilters({ ...filters, companyIds: mappedCompany });
    }
  }, [multipleCompanies]);

  useEffect(() => {
    if (customers.length > 0) {
      let selectedCustomer = null;
      if (!selectedCustomer) {
        if (isProfileTabActive && customer) {
          const findCustomer = customers.find(
            (singleCustomer) => singleCustomer.id === customer.id
          );
          if (findCustomer) {
            selectedCustomer = findCustomer;
          } else {
            selectedCustomer = customers[0];
          }
        } else if (customerId) {
          setIsProfileTabActive(true);
          const findCustomer = customers.find(
            (customer) => customer.id === Number(customerId)
          );
          if (findCustomer) {
            selectedCustomer = findCustomer;
          } else {
            selectedCustomer = customers[0];
          }
        } else {
          selectedCustomer = customers[0];
        }
        getCustomerReservation(selectedCustomer);
        setCustomer(selectedCustomer);
      }
    }
  }, [customers]);

  const getCustomerReservation = (customer) => {
    props.actions.userAction.getCustomerProfile(
      customer.id,
      customer.Outlet.id
    );
  };

  const handleChangeCustomer = (data) => {
    setCustomer(data);
    getCustomerReservation(data);
  };

  const handleProfileActive = (value) => {
    value ? setIsProfileTabActive(value) : setIsProfileTabActive(value);
  };

  return (
    <div className="user-groups">
      <h1 className="groups-header">Customer Management</h1>
      <div className="customer-management">
        <div className="management-left">
          {customers && (
            <CustomerList
              customers={[...customers]}
              selectedCustomer={{ ...customer }}
              handleChangeCustomer={handleChangeCustomer}
            />
          )}
        </div>
        <div className="management-right">
          {!isEmpty(customer) && (
            <TabMenu
              customer={customer}
              filterselection={filterselection}
              chunkRisk={chunkRisk}
              handleChangeFilter={handleChangeFilter}
              filters={filters}
              handleProfileActive={handleProfileActive}
              isProfileActive={customerId ? true : false}
            />
          )}
        </div>
      </div>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(CustomerManagement);
