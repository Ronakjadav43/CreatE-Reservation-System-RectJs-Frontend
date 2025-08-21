import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import hotelReducer from "./AdminDashboard/hotelReducer";
import customerReducer from "./Customer/customerReducer";

const rootReducer = combineReducers({
  customerReducer: customerReducer,
  hotelReducer: hotelReducer,
  routing: routerReducer,
});

export default rootReducer;
