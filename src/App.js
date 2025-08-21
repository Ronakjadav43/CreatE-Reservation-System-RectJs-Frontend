import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import logger from "redux-logger";
import promise from "redux-promise";
import thunk from "redux-thunk";
import "@fontsource/roboto";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore } from "redux";

import initialState from "./Reducer/AdminDashboard/initialState";
import rootReducer from "./Reducer";
import Login from "./Components/AdminDashboard/Auth/Login";
import ForgotPassword from "./Components/AdminDashboard/Auth/ForgotPassword";
import CodeVerification from "./Components/AdminDashboard/Auth/CodeVerification";
import ResetPassword from "./Components/AdminDashboard/Auth/ResetPassword";
import {
  CheckCompanyPermission,
  CheckOutletPermission,
  LoginedIn,
  RequireAuth,
} from "./utils";
import DashBoard from "./Components/AdminDashboard/DashBoard";
import CustomerManagement from "./Components/AdminDashboard/CustomerManagement";
import Home from "./Components/AdminDashboard/Home";
import Email from "./Components/AdminDashboard/Auth/ForgotPassword/email";
import PageNotFound from "./CommonComponent/PageNotFound";
import UserGroup from "./Components/AdminDashboard/UserGroup";
import UserList from "./Components/AdminDashboard/UserList";
import SuperUsers from "./Components/AdminDashboard/SuperUsers";
import OutletManagement from "./Components/AdminDashboard/OutletManagement";
import SeatPlans from "./Components/AdminDashboard/SeatPlans";
import TableManagement from "./Components/AdminDashboard/TableManagement";
import SeatType from "./Components/AdminDashboard/SeatType";
import Spaces from "./Components/AdminDashboard/Spaces";
import BookingOverview from "./Components/AdminDashboard/BookingOverView";
import CustomerHome from "./Components/CustomerDashboard/CustomerHome";
import HotelReservation from "./Components/CustomerDashboard/HotelReservation";
import HotelList from "./Components/CustomerDashboard/HotelList";
import Company from "./Components/AdminDashboard/Company";
import OutletList from "./Components/AdminDashboard/OutletManagement/OutletList";
import Tags from "./Components/AdminDashboard/TagsManagement";
import TagCategory from "./Components/AdminDashboard/TagCategory";
import Display from "./Components/AdminDashboard/Materials/Display";
import Materials from "./Components/AdminDashboard/Materials";
import SubCategory from "./Components/AdminDashboard/SystemSettings/MaterialSettings/SubCategory";
import Category from "./Components/AdminDashboard/SystemSettings/MaterialSettings/Category";
import Confirmation from "./Components/CustomerDashboard/Confirmation";
import Ticketing from "./Components/AdminDashboard/Ticketing/index";
import Integration from "./Components/AdminDashboard/Marketing/Integration";
import CustomerCriteriaList from "./Components/AdminDashboard/Marketing/CustomerCriteriaList";
import IvrsConfiguration from "./Components/AdminDashboard/SystemSettings/IvrsConfiguration";
import ReservedKeywords from "./Components/AdminDashboard/SystemSettings/ReservedKeywords";
import UserGroupAccess from "./Components/AdminDashboard/UserGroupAccess";
import AutoTagging from "./Components/AdminDashboard/AutoTagging";
import Ivrslogs from "./Components/AdminDashboard/CallManagement";
import ReservationSummary from "./Components/AdminDashboard/Reports/ReservationSummary";
import CustomerReport from "./Components/AdminDashboard/Reports/CustomerReport/index";
import EventReport from "./Components/AdminDashboard/Reports/EventReport/index";
import Cross from "./Components/AdminDashboard/Reports/CustomerReport/Cross";
import Frequent from "./Components/AdminDashboard/Reports/CustomerReport/Frequent";
import { Modules } from "./utils/userAccess";
import Twilio from "./Components/AdminDashboard/SystemSettings/Twilio";
import ShortUrl from "./Components/CustomerDashboard/ShortUrl";
import Invoice from "./Components/CustomerDashboard/Invoice";
import ApiLogs from "./Components/AdminDashboard/SystemSettings/ApiLogs";
import "./App.scss";
import Checkout from "./Components/CustomerDashboard/PaymentConfirmation";

const composeEnhancers = composeWithDevTools({});
// const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk, promise)));
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk, promise, logger))
);
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            exact
            path="Login"
            element={
              <LoginedIn>
                <Login />
              </LoginedIn>
            }
          />
          <Route
            exact
            path="ForgotPassword"
            element={
              <LoginedIn>
                <ForgotPassword />
              </LoginedIn>
            }
          />
          <Route
            exact
            path="Email"
            element={
              <LoginedIn>
                <Email />
              </LoginedIn>
            }
          />
          <Route
            exact
            path="CodeVerification/:token"
            element={
              <LoginedIn>
                <CodeVerification />
              </LoginedIn>
            }
          />
          <Route
            exact
            path="ResetPassword/:accessToken"
            element={
              <LoginedIn>
                <ResetPassword />
              </LoginedIn>
            }
          />

          {/* <Route exact path=":id" element={<ShortUrl />} /> */}

          <Route
            exact
            path="Admin"
            element={
              <RequireAuth>
                <DashBoard />
              </RequireAuth>
            }
          >
            <Route index element={<Home />} />
            <Route
              path="CustomerManagement/:customerId"
              element={
                <CheckOutletPermission moduleName={Modules.CUSTOMERMANAGEMENT}>
                  <CustomerManagement />
                </CheckOutletPermission>
              }
            />
            <Route
              path="CustomerManagement"
              element={
                <CheckOutletPermission moduleName={Modules.CUSTOMERMANAGEMENT}>
                  <CustomerManagement />
                </CheckOutletPermission>
              }
            />

            <Route
              path="Materials"
              element={
                <CheckOutletPermission moduleName={Modules.MATERIALS}>
                  <Materials />
                </CheckOutletPermission>
              }
            />
            <Route
              path="Materials/Display/:id"
              element={
                <CheckOutletPermission moduleName={Modules.MATERIALS}>
                  <Display />
                </CheckOutletPermission>
              }
            />

            <Route
              path="UserGroup"
              element={
                <CheckOutletPermission moduleName={Modules.USERGROUP}>
                  <UserGroup />
                </CheckOutletPermission>
              }
            />
            <Route
              path="UserList"
              element={
                <CheckOutletPermission moduleName={Modules.USERLIST}>
                  <UserList />
                </CheckOutletPermission>
              }
            />
            <Route
              path="UserGroupAccess"
              element={
                <CheckOutletPermission moduleName={Modules.USERGROUPACCESS}>
                  <UserGroupAccess />
                </CheckOutletPermission>
              }
            />
            <Route path="SuperUsers" element={<SuperUsers />} />
            <Route path="BrandManagement" element={<Company />} />
            <Route
              path="OutletList"
              element={
                <CheckOutletPermission moduleName={Modules.OUTLETMANAGEMENT}>
                  <OutletList />
                </CheckOutletPermission>
              }
            />

            <Route
              path="ReservationSummary"
              element={
                <CheckCompanyPermission moduleName={Modules.REPORTS}>
                  <ReservationSummary />
                </CheckCompanyPermission>
              }
            />
            <Route
              path="CustomerReport"
              element={
                <CheckCompanyPermission moduleName={Modules.REPORTS}>
                  <CustomerReport />
                </CheckCompanyPermission>
              }
            />
            <Route
              path="Frequent"
              element={
                <CheckCompanyPermission moduleName={Modules.REPORTS}>
                  <Frequent />
                </CheckCompanyPermission>
              }
            />
            <Route
              path="Cross"
              element={
                <CheckCompanyPermission moduleName={Modules.REPORTS}>
                  <Cross />
                </CheckCompanyPermission>
              }
            />
            <Route
              path="EventReport"
              element={
                <CheckCompanyPermission moduleName={Modules.REPORTS}>
                  <EventReport />
                </CheckCompanyPermission>
              }
            />
            <Route
              path="Ticketing"
              element={
                <CheckOutletPermission moduleName={Modules.TICKETING}>
                  <Ticketing />
                </CheckOutletPermission>
              }
            />
            <Route path="OutletManagement" element={<OutletManagement />} />
            <Route
              path="BookingOverview/:name"
              element={
                <CheckOutletPermission
                  moduleName={Modules.RESERVATIONMANAGEMENT}
                >
                  <BookingOverview />
                </CheckOutletPermission>
              }
            />
            <Route
              path="SeatPlans"
              element={
                <CheckOutletPermission moduleName={Modules.SEATPLANS}>
                  <SeatPlans />
                </CheckOutletPermission>
              }
            />
            <Route
              path="Spaces"
              element={
                <CheckOutletPermission moduleName={Modules.SPACES}>
                  <Spaces />
                </CheckOutletPermission>
              }
            />
            <Route
              path="SeatType"
              element={
                <CheckOutletPermission moduleName={Modules.SEATTYPE}>
                  <SeatType />
                </CheckOutletPermission>
              }
            />
            <Route
              path="TableManagement"
              element={
                <CheckOutletPermission moduleName={Modules.TABLEMANAGEMENT}>
                  <TableManagement />
                </CheckOutletPermission>
              }
            />
            <Route
              path="TagCategory"
              element={
                <CheckOutletPermission moduleName={Modules.TAGCATEGORY}>
                  <TagCategory />
                </CheckOutletPermission>
              }
            />

            <Route
              path="Tags"
              element={
                <CheckOutletPermission moduleName={Modules.TAGS}>
                  <Tags />
                </CheckOutletPermission>
              }
            />
            <Route path="AutoTagging" element={<AutoTagging />} />

            <Route path="ApiLogs" element={<ApiLogs />} />

            <Route path="Twilio" element={<Twilio />} />
            {/* <Route
              path="Twilio"
              element={
                <CheckCompanyPermission
                  moduleName={Modules.TWILIO}
                  checkBoxSelection={false}
                >
                  <Twilio />
                </CheckCompanyPermission>
              }
            /> */}

            <Route
              path="ReservedKeywords"
              element={
                <CheckOutletPermission moduleName={Modules.RESERVEDKEYWORDS}>
                  <ReservedKeywords />
                </CheckOutletPermission>
              }
            />
            <Route
              path="IvrsLogs"
              element={
                <CheckOutletPermission moduleName={Modules.CALLMANAGEMENT}>
                  <Ivrslogs />
                </CheckOutletPermission>
              }
            />
            <Route
              path="IvrsConfiguration"
              element={
                <CheckCompanyPermission
                  moduleName={Modules.IVRSCONFIGURATION}
                  checkBoxSelection={false}
                >
                  <IvrsConfiguration />
                </CheckCompanyPermission>
              }
            />
            <Route
              path="Category"
              element={
                <CheckOutletPermission moduleName={Modules.MATERIALCATEGORY}>
                  <Category />
                </CheckOutletPermission>
              }
            />
            <Route
              path="SubCategory"
              element={
                <CheckOutletPermission moduleName={Modules.MATERIALSUBCATEGORY}>
                  <SubCategory />
                </CheckOutletPermission>
              }
            />
            <Route
              path="Integration"
              element={
                <CheckCompanyPermission moduleName={Modules.MARKETING}>
                  <Integration />
                </CheckCompanyPermission>
              }
            />
            <Route
              path="CustomerCriteriaList"
              element={
                <CheckCompanyPermission moduleName={Modules.MARKETING}>
                  <CustomerCriteriaList />
                </CheckCompanyPermission>
              }
            />
          </Route>

          <Route exact path="/" element={<CustomerHome />}>
            <Route index element={<HotelList />} />
            <Route path="invoice/:invoiceId" element={<Invoice />} />
            <Route
              path="invoice/:invoiceId/Status/:status"
              element={<Confirmation />}
            />

            <Route exact path=":id" element={<ShortUrl />} />

            <Route
              path="HotelReservation/:key/outlet/:outletId"
              element={<HotelReservation />}
            />
            <Route
              path="HotelReservation/:key/"
              element={<HotelReservation />}
            />

            <Route path="Checkout/:id/:time" element={<Checkout />} />
          </Route>
          <Route exact path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
