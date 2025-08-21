/* eslint-disable array-callback-return */
import {
  INPROGRESS,
  IS_AUTHENTICATED,
  ERROR,
  LOGOUT,
  STOPLOADER,
  RESET_PASSWORD,
  GET_OUTLETS,
  SET_OUTLET,
  SET_COMPANY,
  GET_ROLES,
  GET_USERS,
  ADD_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  DELETE_USER,
  ADD_USER,
  UPDATE_USER,
  ADD_ADMIN,
  DELETE_ADMIN,
  GET_ALL_ADMIN,
  ADD_OUTLET,
  DELETE_OUTLET,
  UPDATE_OUTLET,
  GET_MEALTYPES,
  UPDATE_ADMIN,
  GET_SYSTEM_LOGS,
  UPDATE_MEAL,
  DELETE_MEAL,
  ADD_MEAL,
  GET_ALL_TAGS,
  ADD_MEAL_TIMING,
  GET_MEAL_TIMINGS,
  DELETE_MEAL_TIMING,
  UPDATE_MEAL_TIME,
  ADD_TAG,
  UPDATE_TAG,
  DELETE_TAG,
  GET_ALL_OUTLETTAGS,
  ADD_OUTLETTAG,
  DELETE_OUTLETTAG,
  UPDATE_OUTLETTAG,
  GET_CLOSURES,
  ADD_CLOSURE,
  UPDATE_CLOSURE,
  DELETE_CLOSURE,
  GET_PREORDERS,
  ADD_PREORDER,
  DELETE_PREORDER,
  UPDATE_PREORDER,
  GET_TABLE,
  UPDATE_TABLE,
  DELETE_TABLE,
  ADD_TABLE,
  GET_OUTLET_NOTES,
  ADD_OUTLET_NOTE,
  UPDATE_OUTLET_NOTE,
  DELETE_OUTLET_NOTE,
  GET_SEATING_TYPE,
  GET_SEAT_TYPE,
  ADD_SEAT_TYPE,
  UPDATE_SEAT_TYPE,
  DELETE_SEAT_TYPE,
  UPDATE_OUTLET_SEATING_INFO,
  GET_OUTLET_SEATING_INFO,
  UPLOAD_FLOOR_PLAN,
  ADD_OUTLET_TABLE,
  GET_OUTLET_TABLE,
  UPDATE_OUTLET_TABLE_POSITION,
  ADD_SEATING_TYPE,
  UPDATE_SEATING_TYPE,
  DELETE_SEATING_TYPE,
  UPDATE_OUTLET_TABLE_INFO,
  DELETE_OUTLET_TABLE,
  ADD_TABLE_MERGE,
  GET_TABLE_MERGE,
  DELETE_TABLE_MERGE,
  DELETE_TABLE_MERGE_POSSIBILITY,
  ADD_TABLE_MERGE_POSSIBILITY,
  UPDATE_TABLE_MERGE,
  ADD_TABLE_SECTION,
  GET_TABLE_SECTION,
  GET_COMPANY,
  ADD_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
  GET_COMPANY_OUTLET,
  ADD_COMPANY_OUTLET,
  DELETE_COMPANY_OUTLET,
  GET_ALL_CUSTOMER,
  GET_CUSTOMER_RESERVATION,
  GET_ALL_INVOICE_DETAILS,
  UPDATE_ALL_CUSTOMER,
  RESET_OUTLETTABLES,
  SET_VISIBLE_SELECTION,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_COMPANY_SELECTION,
  SET_INVISIBLE_COMPANY_SELECTION,
  SET_VISIBLE_DISABLE_OUTLET,
  SET_INVISIBLE_DISABLE_OUTLET,
  GET_TAG_CATEGORY,
  ADD_TAG_CATEGORY,
  UPDATE_TAG_CATEGORY,
  DELETE_TAG_CATEGORY,
  GET_TIME_SLOT,
  GET_BOOKING_TABLE,
  GET_BOOKING_EVENT,
  UPDATE_INVOICE_STATUS,
  GET_SEATING_VIEW,
  UPDATE_SEATING_TABLE,
  MOVE_SEATING_RESERVATION,
  RESET_SEATING_VIEW_TABLES,
  RESET_INVOICE,
  RESET_CUSTOMER,
  RESET_IVRS,
  GET_COUPON,
  ADD_COUPON,
  UPDATE_COUPON,
  GET_CUSTOMER_PROFILE,
  RESET_PROFILE,
  UPDATE_CUSTOMER_RESERVATION,
  GET_ALL_MATERIALS,
  UPDATE_MATERIAL,
  GET_MATERIAL_BY_ID,
  ADD_MATERIALS,
  DELETE_MATERIAL,
  GET_CATEGORY,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ALL_SUBCATEGORY,
  ADD_SUBCATEGORY,
  UPDATE_SUBCATEGORY,
  DELETE_SUBCATEGORY,
  GET_DINING_OPTION,
  ADD_DINING_OPTION,
  UPDATE_DINING_OPTION,
  DELETE_DINING_OPTION,
  DELETE_TABLE_SECTION,
  GET_EMAIL_TEMPLATE,
  ADD_EMAIL_TEMPLATE,
  UPDATE_EMAIL_TEMPLATE,
  GET_ALL_TICKET,
  ADD_TICKET,
  UPDATE_TICKET,
  DELETE_TICKET,
  GET_BOOKING_RESERVATION_EVENT,
  GET_SMS_TEMPLATE,
  ADD_SMS_TEMPLATE,
  UPDATE_SMS_TEMPLATE,
  DELETE_SMS_TEMPLATE,
  GET_IVRS,
  UPDATE_IVRS,
  GET_IVRS_INFO,
  GET_MARKETING,
  ADD_MARKETING,
  UPDATE_MARKETING,
  DELETE_MARKETING,
  UPDATE_INTEGRATION,
  GET_TIMETABLE_VIEW,
  GET_MEALTIME_VIEW,
  UPDATE_IVRS_CONFIGRATION,
  GET_USER_ACCESS_MODULES,
  GET_PERMISSION,
  UPDATE_PERMISSION,
  GET_MEALTYPE_BY_COMPANY,
  GET_MODULE_PERMISSION,
  DELETE_EMAIL_TEMPLATE,
  SET_CUSTOMER_CRITERIA,
  GET_CUSTOMER_LIST,
  SET_VISIBLE_DISABLE_COMPANY,
  SET_INVISIBLE_DISABLE_COMPANY,
  GET_AUTO_TAGGING,
  ADD_AUTO_TAGGING,
  DELETE_AUTO_TAGGING,
  GET_CUSTOMER_LIST_TAGGING,
  GET_ALL_OCCASION,
  GET_ALL_PREORDER,
  GET_ALL_DINNING_OPTION,
  GET_OUTLET_OCCASION,
  UPDATE_TABLE_POSITION,
  GET_OUTLET_TABLE_BY_SEAT_TYPE,
  GET_OUTLET_TABLE_BY_GROUP,
  UPDATE_OUTLET_TABLE_BY_GROUP,
  DELETE_OUTLET_TABLE_BY_GROUP,
  ADD_OUTLET_TABLE_BY_GROUP,
  RESET_BOOKING_TABLES,
  RESET_SECTION_TABLES,
  RESET_MERGE_TABLES,
  GET_CUSTOMER_INVOICE,
  MANAGE_FLOOR_PLAN,
  GET_ALL_REPORT,
  GET_ALL_INVOICE_DETAILS_OF_LISTING_VIEW,
  GET_ALL_CUSTOMER_REPORT,
  GET_ALL_CUSTOMER_CROSS_REPORT,
  GET_DIETARY_RESTRICTION_OUTLET_OCCASION,
  RESET_CUSTOMER_RESERVATION,
  RESET_CUSTOMER_LIST_TAGGING,
  RESET_INVOICE_DETAILS,
  GET_MEAL_SESSION_OUTLET,
  GET_COMPANY_MEAL_SESSION,
  GET_CUSTOMER_EVENT_REPORT,
  GET_CUSTOMER_SINGLE_RESERVATION,
  RESET_ALL_SUBCATEGORY,
  RESET_CATEGORY,
  SET_MULTIPLE_COMPANY,
  SET_VISIBLE_MULTIPLE_COMPANY_SELECTION,
  SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION,
  GET_MARKETING_AUDIENCE_LIST,
  GET_ALL_DEITARY_RESTRICTION,
  SET_OUTLIST_FOR_DROPDOWN,
  SET_COMPANYLIST_FOR_DROPDOWN,
  SET_OUTLET_FROM_CUSTOMER,
  UPDATE_TWILIO_CONFIGRATION,
  GET_CHARGE_CUSTOMER_INVOICE,
  GET_ALL_API_LOGS,
} from "../../utils/AdminDashboard/Constant";
import initialState from "./initialState";
import { GET_BOOKING_RESERVATION } from "../../utils/AdminDashboard/Constant";
import { getSelectedOutletAndCompany } from "../../utils/userAccess";

const hotelReducer = (state = initialState.hotelReducer, action) => {
  switch (action.type) {
    case INPROGRESS:
      return {
        ...state,
        error_msg: "",
        success_msg: null,
        transactionMessage: null,
        loading: true,
      };

    case STOPLOADER:
      return {
        ...state,
        error_msg: "",
        success_msg: null,
        transactionMessage: null,
        loading: false,
      };

    case ERROR:
      return {
        ...state,
        error_msg: action.data.error_msg + "E:" + Math.random(),
        success_msg: null,
        transactionMessage: null,
        loading: false,
      };

    case LOGOUT:
      return {
        ...state,
        loading: false,
        error_msg: null,
        success_msg: null,
        transactionMessage: null,
        token: null,
        userDetail: null,
        outlets: [],
        companies: [],
        roles: [],
        selectedOutlet: null,
        selectedCompany: null,
        outletSeatingInfo: null,
        invoiceDetails: [],
        seatingView: [],
        mergedTables: [],
        users: [],
        superUsers: [],
        mealTypes: [],
        systemLogs: [],
        tags: [],
        mealTimings: [],
        outletTags: [],
        closures: [],
        preorders: [],
        tables: [],
        outletNotes: [],
        customers: [],
        allCompanies: [],
      };

    case IS_AUTHENTICATED:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        transactionMessage: null,
        loading: false,
        token: action.data.accessToken,
        // userDetail: action.data.userDetail,
      };

    case RESET_PASSWORD:
      return {
        ...state,
        error_msg: null,
        success_msg: action.data,
        loading: false,
        token: null,
        userDetail: null,
      };

    case GET_OUTLETS:
      const selectedData = getSelectedOutletAndCompany(
        action.data.outlets,
        action.data.companies
      );

      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outlets: action.data.outlets,
        selectedOutlet: selectedData.selectedOutlet,
        selectedCompany: selectedData.selectedCompany,
        companies: action.data.companies,
        outletForDropDown: action.data.outlets,
        moduleWisePermission: action.data.moduleWisePermission,
      };

    case SET_OUTLET:
      const selectedOutlet = getSelectedOutletAndCompany(
        state.outlets,
        state.companies,
        action.data,
        null
      );
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        selectedOutlet: selectedOutlet.selectedOutlet,
        selectedCompany: selectedOutlet.selectedCompany,
        roles: [],
        users: [],
        mealTypes: [],
        systemLogs: [],
        tags: [],
        mealTimings: [],
        outletTags: [],
        closures: [],
        preorders: [],
        floors: [],
        outletNotes: [],
        seatingType: [],
        seatType: [],
        outletSeatingInfo: null,
        outletTables: [],
        mergedTables: [],
        sectionTables: [],
        customers: [],
        customerReservationData: [],
        profiles: null,
        timeline: [],
      };

    case SET_COMPANY:
      const selectedCompany = getSelectedOutletAndCompany(
        state.outlets,
        state.companies,
        null,
        action.data
      );
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        selectedOutlet: selectedCompany.selectedOutlet,
        selectedCompany: selectedCompany.selectedCompany,
        roles: [],
        users: [],
        mealTypes: [],
        systemLogs: [],
        tags: [],
        mealTimings: [],
        outletTags: [],
        closures: [],
        preorders: [],
        floors: [],
        outletNotes: [],
        seatingType: [],
        seatType: [],
        outletSeatingInfo: null,
        outletTables: [],
        mergedTables: [],
        sectionTables: [],
        customers: [],
        customerReservationData: [],
        profiles: null,
        timeline: [],
      };

    case SET_MULTIPLE_COMPANY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        roles: [],
        users: [],
        mealTypes: [],
        systemLogs: [],
        tags: [],
        mealTimings: [],
        outletTags: [],
        closures: [],
        preorders: [],
        floors: [],
        outletNotes: [],
        seatingType: [],
        seatType: [],
        outletSeatingInfo: null,
        outletTables: [],
        mergedTables: [],
        sectionTables: [],
        customers: [],
        customerReservationData: [],
        profiles: null,
        timeline: [],
        companyMealSession: [],
        multipleCompanies: action.data,
      };

    case SET_OUTLIST_FOR_DROPDOWN:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletForDropDown: action.data.outletList,
        multipleCompanies: action.data.companyList,
      };

    case SET_OUTLET_FROM_CUSTOMER:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        selectedOutlet: action.data,
        outletSeatingInfo: null,
      };

    case SET_COMPANYLIST_FOR_DROPDOWN:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        multipleCompanies: action.data,
      };

    case GET_SYSTEM_LOGS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        systemLogs: action.data.data,
      };

    case GET_ROLES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        roles: action.data,
      };

    case GET_USERS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        users: action.data,
      };

    case GET_MEALTYPES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        mealTypes: action.data,
      };

    case GET_ALL_TAGS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        tags: action.data,
      };

    case GET_OUTLET_OCCASION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletOccasion: action.data,
      };

    case GET_DIETARY_RESTRICTION_OUTLET_OCCASION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletDietaryRestriction: action.data,
      };

    case GET_MEAL_SESSION_OUTLET:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        mealSession: action.data,
      };

    case GET_ALL_OCCASION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        companyOccasion: action.data,
      };

    case GET_ALL_DEITARY_RESTRICTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        dietaryRestiction: action.data,
      };

    case GET_COMPANY_MEAL_SESSION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        companyMealSession: action.data,
      };

    case GET_MARKETING_AUDIENCE_LIST:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        marketingAudienceList: action.data,
      };

    case GET_ALL_PREORDER:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        preOrderItems: action.data,
      };

    case GET_ALL_DINNING_OPTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        dinningOptions: action.data,
      };

    case ADD_ROLE:
      state.roles.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        roles: [...state.roles],
      };

    case UPDATE_ROLE:
      let role = state.roles.find((data) => data.id === action.data.data.id);
      if (role) {
        role.name = action.data.data.name;
        role.description = action.data.data.description;
        role.isActive = action.data.data.isActive;
        role.createdAt = action.data.data.createdAt;
        role.updatedAt = action.data.data.updatedAt;
        role.createdBy = action.data.data.createdBy;
        role.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        roles: [...state.roles],
      };

    case ADD_USER:
      state.users.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        users: [...state.users],
      };

    case UPDATE_USER:
      let user = state.users.find((data) => data.id === action.data.data.id);
      if (user) {
        user.userName = action.data.data.userName;
        user.firstName = action.data.data.firstName;
        user.lastName = action.data.data.lastName;
        user.email = action.data.data.email;
        user.phone = action.data.data.phone;
        user.Role = action.data.data.Role;
        user.CompanyPermission = action.data.data.CompanyPermission;
        user.isActive = action.data.data.isActive;
        user.createdAt = action.data.data.createdAt;
        user.updatedAt = action.data.data.updatedAt;
        user.createdBy = action.data.data.createdBy;
        user.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        users: [...state.users],
      };

    case GET_ALL_ADMIN:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        superUsers: action.data.data,
      };

    case ADD_ADMIN:
      state.superUsers.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        superUsers: [...state.superUsers],
      };

    case UPDATE_ADMIN:
      let admin = state.superUsers.find(
        (data) => data.id === action.data.data.id
      );
      if (admin) {
        admin.userName = action.data.data.userName;
        admin.firstName = action.data.data.firstName;
        admin.lastName = action.data.data.lastName;
        admin.email = action.data.data.email;
        admin.phone = action.data.data.phone;
        admin.isActive = action.data.data.isActive;
        admin.createdAt = action.data.data.createdAt;
        admin.updatedAt = action.data.data.updatedAt;
        admin.createdBy = action.data.data.createdBy;
        admin.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        superUsers: [...state.superUsers],
      };

    case ADD_OUTLET:
      const selectedCompanyToAddOutlet = state.companies.find(
        (company) => company.id === action.data.data.outlet.companyId
      );
      if (selectedCompanyToAddOutlet) {
        selectedCompanyToAddOutlet.Outlet.push(action.data.data.outlet);
      }
      state.outlets.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        companies: [...state.companies],
        outlets: [...state.outlets],
        outletForDropDown: [...state.outlets],
      };

    case DELETE_ROLE:
      let deleteRole = state.roles.find((data) => data.id === action.data.data);
      if (deleteRole) {
        let index = state.roles.indexOf(deleteRole);
        state.roles.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        roles: [...state.roles],
      };

    case DELETE_OUTLET:
      let deleteOutlet = state.outletForDropDown.find(
        (data) => data.outlet.id === action.data.data
      );

      if (deleteOutlet) {
        let index = state.outletForDropDown.indexOf(deleteOutlet);
        state.outletForDropDown.splice(index, 1);
      }

      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletForDropDown: [...state.outletForDropDown],
        outlets: [...state.outletForDropDown],
      };

    case DELETE_USER:
      let deleteUser = state.users.find((data) => data.id === action.data.data);
      if (deleteUser) {
        let index = state.users.indexOf(deleteUser);
        state.users.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        users: [...state.users],
      };

    case DELETE_ADMIN:
      let deleteAdmin = state.superUsers.find(
        (data) => data.id === action.data.data
      );
      if (deleteAdmin) {
        let index = state.superUsers.indexOf(deleteAdmin);
        state.superUsers.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        superUsers: [...state.superUsers],
      };

    case UPDATE_OUTLET:
      let outlet = state.outlets.find(
        (data) => data.outlet.id === action.data.data.id
      );
      if (outlet) {
        outlet.outlet.name = action.data.data.name;
        outlet.outlet.description = action.data.data.description;
        outlet.outlet.address1 = action.data.data.address1;
        outlet.outlet.postcode = action.data.data.postcode;
        outlet.outlet.latitude = action.data.data.latitude;
        outlet.outlet.longitude = action.data.data.longitude;
        outlet.outlet.phone = action.data.data.phone;
        outlet.outlet.email = action.data.data.email;
        outlet.outlet.googlePlaceId = action.data.data.googlePlaceId;
        outlet.outlet.gst = action.data.data.gst;
        outlet.outlet.timezone = action.data.data.timezone;
        outlet.outlet.rebookingTableInterval =
          action.data.data.rebookingTableInterval;
        outlet.outlet.timeSlotInterval = action.data.data.timeSlotInterval;
        outlet.outlet.isActive = action.data.data.isActive;
        outlet.outlet.createdAt = action.data.data.createdAt;
        outlet.outlet.updatedAt = action.data.data.updatedAt;
        outlet.outlet.createdBy = action.data.data.createdBy;
        outlet.outlet.updatedBy = action.data.data.updatedBy;
        outlet.outlet.image = action.data.data.image;
        outlet.outlet.allowOrder = action.data.data.allowOrder;
        outlet.outlet.allowBooking = action.data.data.allowBooking;
        outlet.outlet.Company = action.data.data.Company;
        outlet.outlet.companyId = action.data.data.companyId;
        outlet.outlet.paxSpacing = action.data.data.paxSpacing;
        outlet.outlet.ivrsPhoneNo = action.data.data.ivrsPhoneNo;
        outlet.outlet.blockTime = action.data.data.blockTime;
        outlet.outlet.chopeName = action.data.data.chopeName;
        outlet.outlet.oddleName = action.data.data.oddleName;
      }

      if (state.selectedOutlet.outlet.id === outlet.outlet.id) {
        state.selectedOutlet.outlet.name = action.data.data.name;
        state.selectedOutlet.outlet.description = action.data.data.description;
        state.selectedOutlet.outlet.address1 = action.data.data.address1;
        state.selectedOutlet.outlet.postcode = action.data.data.postcode;
        state.selectedOutlet.outlet.latitude = action.data.data.latitude;
        state.selectedOutlet.outlet.longitude = action.data.data.longitude;
        state.selectedOutlet.outlet.phone = action.data.data.phone;
        state.selectedOutlet.outlet.email = action.data.data.email;
        state.selectedOutlet.outlet.googlePlaceId =
          action.data.data.googlePlaceId;
        state.selectedOutlet.outlet.gst = action.data.data.gst;
        state.selectedOutlet.outlet.timezone = action.data.data.timezone;
        state.selectedOutlet.outlet.rebookingTableInterval =
          action.data.data.rebookingTableInterval;
        state.selectedOutlet.outlet.timeSlotInterval =
          action.data.data.timeSlotInterval;
        state.selectedOutlet.outlet.isActive = action.data.data.isActive;
        state.selectedOutlet.outlet.createdAt = action.data.data.createdAt;
        state.selectedOutlet.outlet.updatedAt = action.data.data.updatedAt;
        state.selectedOutlet.outlet.createdBy = action.data.data.createdBy;
        state.selectedOutlet.outlet.updatedBy = action.data.data.updatedBy;
        state.selectedOutlet.outlet.image = action.data.data.image;
        state.selectedOutlet.outlet.allowOrder = action.data.data.allowOrder;
        state.selectedOutlet.outlet.allowBooking =
          action.data.data.allowBooking;
        state.selectedOutlet.outlet.Company = action.data.data.Company;
        state.selectedOutlet.outlet.companyId = action.data.data.companyId;
        state.selectedOutlet.outlet.paxSpacing = action.data.data.paxSpacing;
        state.selectedOutlet.outlet.ivrsPhoneNo = action.data.data.ivrsPhoneNo;
        state.selectedOutlet.outlet.blockTime = action.data.data.blockTime;
        state.selectedOutlet.outlet.chopeName = action.data.data.chopeName;
        state.selectedOutlet.outlet.oddleName = action.data.data.oddleName;
      }

      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outlets: [...state.outlets],
        selectedOutlet: { ...state.selectedOutlet },
      };

    case UPDATE_MEAL:
      let meal = state.mealTypes.find(
        (data) => data.id === action.data.data.id
      );
      if (meal) {
        meal.name = action.data.data.name;
        meal.description = action.data.data.description;
        meal.isActive = action.data.data.isActive;
        meal.createdAt = action.data.data.createdAt;
        meal.updatedAt = action.data.data.updatedAt;
        meal.createdBy = action.data.data.createdBy;
        meal.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mealTypes: [...state.mealTypes],
      };

    case DELETE_MEAL:
      let deletemeal = state.mealTypes.find(
        (data) => data.id === action.data.data
      );
      if (deletemeal) {
        let index = state.mealTypes.indexOf(deletemeal);
        state.mealTypes.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mealTypes: [...state.mealTypes],
      };

    case ADD_MEAL:
      state.mealTypes.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mealTypes: [...state.mealTypes],
      };

    case GET_MEAL_TIMINGS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        mealTimings: action.data,
      };

    case ADD_MEAL_TIMING:
      state.mealTimings.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mealTimings: [...state.mealTimings],
      };

    case UPDATE_MEAL_TIME:
      let mealTime = state.mealTimings.find(
        (data) => data.id === action.data.data.id
      );
      if (mealTime) {
        mealTime.sectionId = action.data.data.sectionId;
        mealTime.dayOfWeekName = action.data.data.dayOfWeekName;
        mealTime.Section = action.data.data.Section;
        mealTime.dayofweek = action.data.data.dayofweek;
        mealTime.isActive = action.data.data.isActive;
        mealTime.openingTime = action.data.data.openingTime;
        mealTime.closingTime = action.data.data.closingTime;
        mealTime.createdAt = action.data.data.createdAt;
        mealTime.updatedAt = action.data.data.updatedAt;
        mealTime.createdBy = action.data.data.createdBy;
        mealTime.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mealTimings: [...state.mealTimings],
      };

    case DELETE_MEAL_TIMING:
      let deleteMealTime = state.mealTimings.find(
        (data) => data.id === action.data.data
      );
      if (deleteMealTime) {
        let index = state.mealTimings.indexOf(deleteMealTime);
        state.mealTimings.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mealTimings: [...state.mealTimings],
      };

    case ADD_TAG:
      state.tags.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tags: [...state.tags],
      };

    case UPDATE_TAG:
      let tag = state.tags.find((data) => data.id === action.data.data.id);
      if (tag) {
        tag.name = action.data.data.name;
        tag.description = action.data.data.description;
        tag.isActive = action.data.data.isActive;
        tag.createdAt = action.data.data.createdAt;
        tag.updatedAt = action.data.data.updatedAt;
        tag.createdBy = action.data.data.createdBy;
        tag.updatedBy = action.data.data.updatedBy;
        tag.tagCategory = action.data.data.tagCategoryId;
        tag.TagCategory = action.data.data.TagCategory;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tags: [...state.tags],
      };

    case DELETE_TAG:
      let deleteTag = state.tags.find((data) => data.id === action.data.data);
      if (deleteTag) {
        let index = state.tags.indexOf(deleteTag);
        state.tags.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tags: [...state.tags],
      };

    case GET_ALL_OUTLETTAGS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletTags: action.data.data,
      };

    case ADD_OUTLETTAG:
      state.outletTags.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTags: [...state.outletTags],
      };

    case DELETE_OUTLETTAG:
      let deletOutletTag = state.outletTags.find(
        (data) => data.id === action.data.data
      );
      if (deletOutletTag) {
        let index = state.outletTags.indexOf(deletOutletTag);
        state.outletTags.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTags: [...state.outletTags],
      };

    case UPDATE_OUTLETTAG:
      let outletTag = state.outletTags.find(
        (data) => data.id === action.data.data.id
      );
      if (outletTag) {
        outletTag.tagId = action.data.data.tagId;
        outletTag.Tag = action.data.data.Tag;
        outletTag.isActive = action.data.data.isActive;
        outletTag.createdAt = action.data.data.createdAt;
        outletTag.updatedAt = action.data.data.updatedAt;
        outletTag.createdBy = action.data.data.createdBy;
        outletTag.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTags: [...state.outletTags],
      };

    case GET_CLOSURES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        closures: action.data.data,
      };

    case ADD_CLOSURE:
      state.closures.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        closures: [...state.closures],
      };

    case UPDATE_CLOSURE:
      let closure = state.closures.find(
        (data) => data.id === action.data.data.id
      );
      if (closure) {
        closure.sectionId = action.data.data.sectionId;
        closure.dayofweek = action.data.data.dayofweek;
        closure.openingTime = action.data.data.openingTime;
        closure.closingTime = action.data.data.closingTime;
        closure.effectiveFrom = action.data.data.effectiveFrom;
        closure.effectiveTo = action.data.data.effectiveTo;
        closure.reason = action.data.data.reason;
        closure.outletStatus = action.data.data.outletStatus;
        closure.isActive = action.data.data.isActive;
        closure.Section = action.data.data.Section;
        closure.createdAt = action.data.data.createdAt;
        closure.updatedAt = action.data.data.updatedAt;
        closure.createdBy = action.data.data.createdBy;
        closure.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        closures: [...state.closures],
      };

    case DELETE_CLOSURE:
      let deleteClosure = state.closures.find(
        (data) => data.id === action.data.data
      );
      if (deleteClosure) {
        let index = state.closures.indexOf(deleteClosure);
        state.closures.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        closures: [...state.closures],
      };

    case GET_PREORDERS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        preorders: action.data,
      };

    case ADD_PREORDER:
      action.data.data.map((data) => state.preorders.push(data));
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        preorders: [...state.preorders],
      };

    case UPDATE_PREORDER:
      let preOrder = state.preorders.find(
        (data) => data.id === action.data.data.id
      );
      if (preOrder) {
        preOrder.image = action.data.data.image;
        preOrder.name = action.data.data.name;
        preOrder.sectionId = action.data.data.sectionId;
        preOrder.price = action.data.data.price;
        preOrder.dailyMaxQty = action.data.data.dailyMaxQty;
        preOrder.bookingMaxQty = action.data.data.bookingMaxQty;
        preOrder.originalPrice = action.data.data.originalPrice;
        preOrder.creditCardHoldAmount = action.data.data.creditCardHoldAmount;
        preOrder.description = action.data.data.description;
        preOrder.Section = action.data.data.Section;
        preOrder.isActive = action.data.data.isActive;
        preOrder.createdAt = action.data.data.createdAt;
        preOrder.updatedAt = action.data.data.updatedAt;
        preOrder.createdBy = action.data.data.createdBy;
        preOrder.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        preorders: [...state.preorders],
      };

    case DELETE_PREORDER:
      let deletePreOrder = state.preorders.find(
        (data) => data.id === action.data.data
      );
      if (deletePreOrder) {
        let index = state.preorders.indexOf(deletePreOrder);
        state.preorders.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        preorders: [...state.preorders],
      };

    case GET_TABLE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        tables: action.data,
      };

    case ADD_TABLE:
      state.tables.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tables: [...state.tables],
      };

    case UPDATE_TABLE:
      let table = state.tables.find((data) => data.id === action.data.data.id);
      if (table) {
        table.shape = action.data.data.shape;
        table.name = action.data.data.name;
        table.noOfPerson = action.data.data.noOfPerson;
        table.description = action.data.data.description;
        table.isActive = action.data.data.isActive;
        table.createdAt = action.data.data.createdAt;
        table.updatedAt = action.data.data.updatedAt;
        table.createdBy = action.data.data.createdBy;
        table.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tables: [...state.tables],
      };

    case DELETE_TABLE:
      let deleteTable = state.tables.find(
        (data) => data.id === action.data.data
      );
      if (deleteTable) {
        let index = state.tables.indexOf(deleteTable);
        state.tables.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tables: [...state.tables],
      };

    case GET_OUTLET_NOTES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletNotes: action.data,
      };

    case ADD_OUTLET_NOTE:
      state.outletNotes.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletNotes: [...state.outletNotes],
      };

    case UPDATE_OUTLET_NOTE:
      let outletNote = state.outletNotes.find(
        (data) => data.id === action.data.data.id
      );
      if (outletNote) {
        outletNote.noteLevel = action.data.data.noteLevel;
        outletNote.description = action.data.data.description;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletNotes: [...state.outletNotes],
      };

    case DELETE_OUTLET_NOTE:
      let deleteOutletNote = state.outletNotes.find(
        (data) => data.id === action.data.data
      );
      if (deleteOutletNote) {
        let index = state.outletNotes.indexOf(deleteOutletNote);
        state.outletNotes.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletNotes: [...state.outletNotes],
      };

    case GET_SEATING_TYPE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        seatingType: action.data,
      };

    case GET_SEAT_TYPE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        seatType: action.data,
      };

    case ADD_SEAT_TYPE:
      state.seatType.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatType: [...state.seatType],
      };

    case UPDATE_SEAT_TYPE:
      let seatTypes = state.seatType.find(
        (data) => data.id === action.data.data.id
      );
      if (seatTypes) {
        seatTypes.name = action.data.data.name;
        seatTypes.description = action.data.data.description;
        seatTypes.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatType: [...state.seatType],
      };

    case DELETE_SEAT_TYPE:
      let deleteSeatType = state.seatType.find(
        (data) => data.id === action.data.data
      );
      if (deleteSeatType) {
        let index = state.seatType.indexOf(deleteSeatType);
        state.seatType.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatType: [...state.seatType],
      };

    case GET_OUTLET_SEATING_INFO:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletSeatingInfo: action.data.data,
      };

    case UPDATE_OUTLET_SEATING_INFO:
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletSeatingInfo: action.data.data,
      };

    case UPLOAD_FLOOR_PLAN:
      let floorPlan = state.outletSeatingInfo.OutletSeatingType.find(
        (data) => data.id === action.data.data.id
      );
      if (floorPlan) {
        floorPlan.image = action.data.data.image;
        floorPlan.height = action.data.data.height;
        floorPlan.width = action.data.data.width;
        floorPlan.updatedAt = action.data.data.updatedAt;
        floorPlan.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletSeatingInfo: { ...state.outletSeatingInfo },
      };

    case ADD_SEATING_TYPE:
      state.seatingType.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatingType: [...state.seatingType],
      };

    case UPDATE_SEATING_TYPE:
      let seatingtypes = state.seatingType.find(
        (data) => data.id === action.data.data.id
      );
      if (seatingtypes) {
        seatingtypes.name = action.data.data.name;
        seatingtypes.description = action.data.data.description;
        seatingtypes.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatingType: [...state.seatingType],
      };

    case DELETE_SEATING_TYPE:
      let deleteSeatingType = state.seatingType.find(
        (data) => data.id === action.data.data
      );
      if (deleteSeatingType) {
        let index = state.seatingType.indexOf(deleteSeatingType);
        state.seatingType.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatingType: [...state.seatingType],
      };

    case GET_OUTLET_TABLE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletTables: action.data,
      };

    case GET_OUTLET_TABLE_BY_GROUP:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletTablesByGroup: action.data,
      };

    case GET_OUTLET_TABLE_BY_SEAT_TYPE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletTablesBySeatType: action.data,
      };

    case ADD_OUTLET_TABLE:
      state.outletTables.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTables: [...state.outletTables],
      };

    case ADD_OUTLET_TABLE_BY_GROUP:
      state.outletTablesByGroup.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTablesByGroup: [...state.outletTablesByGroup],
      };

    case UPDATE_OUTLET_TABLE_BY_GROUP:
      let outletTable = state.outletTablesByGroup.find(
        (data) => data.id === action.data.data.id
      );
      if (outletTable) {
        outletTable.name = action.data.data.name;
        outletTable.isActive = action.data.data.isActive;
        outletTable.createdAt = action.data.data.createdAt;
        outletTable.updatedAt = action.data.data.updatedAt;
        outletTable.createdBy = action.data.data.createdBy;
        outletTable.updatedBy = action.data.data.updatedBy;
        outletTable.image = action.data.data.image;
        outletTable.description = action.data.data.description;
        outletTable.originalPrice = action.data.data.originalPrice;
        outletTable.price = action.data.data.price;
        outletTable.blockTime = action.data.data.blockTime;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTablesByGroup: [...state.outletTablesByGroup],
      };

    case DELETE_OUTLET_TABLE_BY_GROUP:
      let deleteTableGroup = state.outletTablesByGroup.find(
        (data) => data.id === action.data.data
      );
      if (deleteTableGroup) {
        let index = state.outletTablesByGroup.indexOf(deleteTableGroup);
        state.outletTablesByGroup.splice(index, 1);
        // deleteTableGroup.deletedAt = new Date();
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTablesByGroup: [...state.outletTablesByGroup],
      };

    case UPDATE_OUTLET_TABLE_POSITION:
      action.data.data.map((singleTable) => {
        const findTable = state.outletTables.find(
          (table) => table.id === singleTable.id
        );
        if (findTable) {
          findTable.xPosition = singleTable.xPosition;
          findTable.yPosition = singleTable.yPosition;
        }
      });
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTables: [...state.outletTables],
      };

    case UPDATE_OUTLET_TABLE_INFO:
      let outletTableInfo = state.outletTables.find(
        (data) => data.id === action.data.data.id
      );
      if (outletTableInfo) {
        outletTableInfo.name = action.data.data.name;
        outletTableInfo.xPosition = action.data.data.xPosition;
        outletTableInfo.yPosition = action.data.data.yPosition;
        outletTableInfo.tableId = action.data.data.tableId;
        outletTableInfo.Table = { ...action.data.data.Table };
        outletTableInfo.outletSeatTypeId = action.data.data.outletSeatTypeId;
        outletTableInfo.OutletSeatType = { ...action.data.data.OutletSeatType };
        outletTableInfo.isActive = action.data.data.isActive;
        outletTableInfo.createdAt = action.data.data.createdAt;
        outletTableInfo.updatedAt = action.data.data.updatedAt;
        outletTableInfo.createdBy = action.data.data.createdBy;
        outletTableInfo.updatedBy = action.data.data.updatedBy;
        outletTableInfo.description = action.data.data.description;
        outletTableInfo.minimumSpendAmount =
          action.data.data.minimumSpendAmount;
        outletTableInfo.perPaxUnitDeposit = action.data.data.perPaxUnitDeposit;
        outletTableInfo.image = action.data.data.image;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTables: [...state.outletTables],
      };

    case RESET_OUTLETTABLES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        outletTables: [],
      };

    case DELETE_OUTLET_TABLE:
      let deleteoutletTable = state.outletTables.find(
        (data) => data.id === action.data.data
      );
      if (deleteoutletTable) {
        let index = state.outletTables.indexOf(deleteoutletTable);
        state.outletTables.splice(index, 1);
        // deleteoutletTable.deletedAt = new Date();
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        outletTables: [...state.outletTables],
      };

    case ADD_TABLE_MERGE:
      state.mergedTables.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mergedTables: [...state.mergedTables],
      };

    case GET_TABLE_MERGE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        mergedTables: action.data,
      };

    case UPDATE_TABLE_MERGE:
      let editTableMerge = state.mergedTables.find(
        (data) => data.id === action.data.data.id
      );
      if (editTableMerge) {
        editTableMerge.name = action.data.data.name;
        editTableMerge.minPax = action.data.data.minPax;
        editTableMerge.maxPax = action.data.data.maxPax;
        editTableMerge.isActive = action.data.data.isActive;
      }

      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mergedTables: [...state.mergedTables],
      };

    case DELETE_TABLE_MERGE:
      let deleteTableMerge = state.mergedTables.find(
        (data) => data.id === action.data.data
      );
      if (deleteTableMerge) {
        let index = state.mergedTables.indexOf(deleteTableMerge);
        state.mergedTables.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mergedTables: [...state.mergedTables],
      };

    case DELETE_TABLE_MERGE_POSSIBILITY:
      let deleteTableMergePossibility = state.mergedTables.find(
        (data) => data.id === action.data.data.id
      );
      if (deleteTableMergePossibility) {
        deleteTableMergePossibility.GroupPossibility = [
          ...action.data.data.GroupPossibility,
        ];
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mergedTables: [...state.mergedTables],
      };

    case ADD_TABLE_MERGE_POSSIBILITY:
      let addTableMergePossibility = state.mergedTables.find(
        (data) => data.id === action.data.data.id
      );
      if (addTableMergePossibility) {
        addTableMergePossibility.GroupPossibility = [
          ...action.data.data.GroupPossibility,
        ];
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        mergedTables: [...state.mergedTables],
      };

    case ADD_TABLE_SECTION:
      state.sectionTables.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        sectionTables: [...state.sectionTables],
      };

    case GET_TABLE_SECTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        sectionTables: action.data,
      };

    case DELETE_TABLE_SECTION:
      let deleteTableSection = state.sectionTables.find(
        (data) => data.id === action.data.data
      );
      if (deleteTableSection) {
        let index = state.sectionTables.indexOf(deleteTableSection);
        state.sectionTables.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        sectionTables: [...state.sectionTables],
      };

    case GET_COMPANY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        allCompanies: action.data.data,
      };

    case ADD_COMPANY:
      state.allCompanies.push(action.data.data);
      state.companies.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        allCompanies: [...state.allCompanies],
        companies: [...state.companies],
      };

    case UPDATE_COMPANY:
      let editSuperAdmin = state.allCompanies.find(
        (data) => data.id === action.data.data.id
      );
      let findCompanyFromSidebarReducer = state.companies.find(
        (company) => company.id === action.data.data.id
      );
      if (editSuperAdmin) {
        editSuperAdmin.name = action.data.data.name;
        editSuperAdmin.contentLanguage = action.data.data.contentLanguage;
        editSuperAdmin.description = action.data.data.description;
        editSuperAdmin.isActive = action.data.data.isActive;
        editSuperAdmin.paymentTC = action.data.data.paymentTC;
        editSuperAdmin.noPaymentTC = action.data.data.noPaymentTC;
        editSuperAdmin.image = action.data.data.image;
      }
      if (findCompanyFromSidebarReducer) {
        findCompanyFromSidebarReducer.name = action.data.data.name;
        findCompanyFromSidebarReducer.contentLanguage =
          action.data.data.contentLanguage;
        findCompanyFromSidebarReducer.description =
          action.data.data.description;
        findCompanyFromSidebarReducer.isActive = action.data.data.isActive;
        findCompanyFromSidebarReducer.paymentTC = action.data.data.paymentTC;
        findCompanyFromSidebarReducer.noPaymentTC =
          action.data.data.noPaymentTC;
        findCompanyFromSidebarReducer.image = action.data.data.image;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        allCompanies: [...state.allCompanies],
        companies: [...state.companies],
      };

    case UPDATE_INTEGRATION:
      state.companies.map((data) => {
        data.tags = action.data.data.tags;
        data.mailChimpPrivateKey = action.data.data.mailChimpPrivateKey;
        data.mailChimpPublicKey = action.data.data.mailChimpPublicKey;
        data.mailChimpStatus = action.data.data.mailChimpStatus;
        data.marketingId = action.data.data.marketingId;
        data.mailChimpUserName = action.data.data.mailChimpUserName;
      });

      // if (findCompany) {
      //   findCompany.tags = action.data.data.tags;
      //   findCompany.mailChimpPrivateKey = action.data.data.mailChimpPrivateKey;
      //   findCompany.mailChimpPublicKey = action.data.data.mailChimpPublicKey;
      //   findCompany.mailChimpStatus = action.data.data.mailChimpStatus;
      //   findCompany.marketingId = action.data.data.marketingId;
      //   findCompany.mailChimpUserName = action.data.data.mailChimpUserName;
      // }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        companies: [...state.companies],
        // selectedCompany: { ...findCompany },
      };

    case DELETE_COMPANY:
      let deleteCompany = state.allCompanies.find(
        (data) => data.id === action.data.data
      );
      let deleteCompanyFromSidebarReducer = state.companies.find(
        (company) => company.id === action.data.data
      );
      if (deleteCompany) {
        let index = state.allCompanies.indexOf(deleteCompany);
        state.allCompanies.splice(index, 1);
      }
      if (deleteCompanyFromSidebarReducer) {
        let index = state.companies.indexOf(deleteCompanyFromSidebarReducer);
        state.companies.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        allCompanies: [...state.allCompanies],
        companies: [...state.companies],
      };

    case GET_COMPANY_OUTLET:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        companyOutlets: action.data.data,
      };

    case ADD_COMPANY_OUTLET:
      state.companyOutlets.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        companyOutlets: [...state.companyOutlets],
      };

    case DELETE_COMPANY_OUTLET:
      let deleteCompanyOutlet = state.companyOutlets.find(
        (data) => data.id === action.data.data
      );
      if (deleteCompanyOutlet) {
        let index = state.companyOutlets.indexOf(deleteCompanyOutlet);
        state.companyOutlets.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        companyOutlets: [...state.companyOutlets],
      };

    case GET_ALL_CUSTOMER:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customers: action.data,
      };

    case GET_CUSTOMER_INVOICE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        invoices: action.data,
      };

    case GET_CHARGE_CUSTOMER_INVOICE:
      let updateInvoiceDataCharge = state.invoiceDetails?.find(
        (data) => data.id === action.data.data.id
      );
      if (updateInvoiceDataCharge) {
        updateInvoiceDataCharge.isValidSetupIntent =
          action.data.data.isValidSetupIntent;
        updateInvoiceDataCharge.status = action.data.data.status;
        updateInvoiceDataCharge.totalAmountBeforeDiscount =
          action.data.data.totalAmountBeforeDiscount;
        updateInvoiceDataCharge.totalPaidAmount =
          action.data.data.totalPaidAmount;
        updateInvoiceDataCharge.updatedAt = action.data.data.updatedAt;
        updateInvoiceDataCharge.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        invoicesCharge: { ...state.invoiceDetails },
      };

    case GET_CUSTOMER_RESERVATION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customerReservationData: action.data,
      };

    case RESET_CUSTOMER_RESERVATION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customerReservationData: [],
      };

    case UPDATE_CUSTOMER_RESERVATION:
      let updateInvoiceData =
        state.customerReservationData?.Customer?.OutletInvoice?.find(
          (data) => data.id === action.data.data.id
        );

      if (updateInvoiceData) {
        updateInvoiceData.Checkout = action.data.data.Checkout;
        updateInvoiceData.Coupon = action.data.data.Coupon;
        updateInvoiceData.GST = action.data.data.GST;
        updateInvoiceData.OutletTableBooking =
          action.data.data.OutletTableBooking;
        updateInvoiceData.amountExcludingGST =
          action.data.data.amountExcludingGST;
        updateInvoiceData.amountIncludingGST =
          action.data.data.amountIncludingGST;
        updateInvoiceData.basket = action.data.data.basket;
        updateInvoiceData.bookingDate = action.data.data.bookingDate;
        updateInvoiceData.bookingEndTime = action.data.data.bookingEndTime;
        updateInvoiceData.bookingStartTime = action.data.data.bookingStartTime;
        updateInvoiceData.bookingType = action.data.data.bookingType;
        updateInvoiceData.couponId = action.data.data.couponId;
        updateInvoiceData.createdAt = action.data.data.createdAt;
        updateInvoiceData.createdBy = action.data.data.createdBy;
        updateInvoiceData.customerCompanyName =
          action.data.data.customerCompanyName;
        updateInvoiceData.customerId = action.data.data.customerId;
        updateInvoiceData.dietaryRestriction =
          action.data.data.dietaryRestriction;
        updateInvoiceData.diningOptionId = action.data.data.diningOptionId;
        updateInvoiceData.diningOptionQty = action.data.data.diningOptionQty;
        updateInvoiceData.dinningOptions = action.data.data.dinningOptions;
        updateInvoiceData.discountAmount = action.data.data.discountAmount;
        updateInvoiceData.id = action.data.data.id;
        updateInvoiceData.image = action.data.data.image;
        updateInvoiceData.isActive = action.data.data.isActive;
        updateInvoiceData.isPrivateTableBooked =
          action.data.data.isPrivateTableBooked;
        updateInvoiceData.mealType = action.data.data.mealType;
        updateInvoiceData.noOfPerson = action.data.data.noOfPerson;
        updateInvoiceData.occasion = action.data.data.occasion;
        updateInvoiceData.originalTotalAmount =
          action.data.data.originalTotalAmount;
        updateInvoiceData.outletId = action.data.data.outletId;
        updateInvoiceData.paymentType = action.data.data.paymentType;
        updateInvoiceData.privateRoom = action.data.data.privateRoom;
        updateInvoiceData.promocode = action.data.data.promocode;
        updateInvoiceData.reservationNotes = action.data.data.reservationNotes;
        updateInvoiceData.seatingPreference =
          action.data.data.seatingPreference;
        updateInvoiceData.source = action.data.data.source;
        updateInvoiceData.specialRequest = action.data.data.specialRequest;
        updateInvoiceData.status = action.data.data.status;
        updateInvoiceData.ticketingId = action.data.data.ticketingId;
        updateInvoiceData.totalAmount = action.data.data.totalAmount;
        updateInvoiceData.totalAmountBeforeDiscount =
          action.data.data.totalAmountBeforeDiscount;
        updateInvoiceData.totalPaidAmount = action.data.data.totalPaidAmount;
        updateInvoiceData.updatedAt = action.data.data.updatedAt;
        updateInvoiceData.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        customerReservationData: { ...state.customerReservationData },
      };

    case GET_ALL_INVOICE_DETAILS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        invoiceDetails: action.data,
      };

    case GET_ALL_INVOICE_DETAILS_OF_LISTING_VIEW:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        invoiceDetailsOfListingView: action.data,
      };

    case UPDATE_INVOICE_STATUS:
      let updateTransactionalEmail = state.systemLogs.find(
        (systemLog) => systemLog.OutletInvoice?.id === action.data.data.id
      );

      let updateInvoice = state.invoiceDetails.find(
        (data) => data.id === action.data.data.id
      );

      if (updateInvoice) {
        updateInvoice.Checkout = action.data.data.Checkout;
        updateInvoice.Coupon = action.data.data.Coupon;
        updateInvoice.GST = action.data.data.GST;
        updateInvoice.OutletTableBooking = action.data.data.OutletTableBooking;
        updateInvoice.amountExcludingGST = action.data.data.amountExcludingGST;
        updateInvoice.amountIncludingGST = action.data.data.amountIncludingGST;
        updateInvoice.basket = action.data.data.basket;
        updateInvoice.bookingDate = action.data.data.bookingDate;
        updateInvoice.bookingEndTime = action.data.data.bookingEndTime;
        updateInvoice.bookingStartTime = action.data.data.bookingStartTime;
        updateInvoice.bookingType = action.data.data.bookingType;
        updateInvoice.couponId = action.data.data.couponId;
        updateInvoice.createdAt = action.data.data.createdAt;
        updateInvoice.createdBy = action.data.data.createdBy;
        updateInvoice.customerCompanyName =
          action.data.data.customerCompanyName;
        updateInvoice.customerId = action.data.data.customerId;
        updateInvoice.dietaryRestriction = action.data.data.dietaryRestriction;
        updateInvoice.diningOptionId = action.data.data.diningOptionId;
        updateInvoice.diningOptionQty = action.data.data.diningOptionQty;
        updateInvoice.dinningOptions = action.data.data.dinningOptions;
        updateInvoice.discountAmount = action.data.data.discountAmount;
        updateInvoice.id = action.data.data.id;
        updateInvoice.image = action.data.data.image;
        updateInvoice.isActive = action.data.data.isActive;
        updateInvoice.isPrivateTableBooked =
          action.data.data.isPrivateTableBooked;
        updateInvoice.mealType = action.data.data.mealType;
        updateInvoice.noOfPerson = action.data.data.noOfPerson;
        updateInvoice.occasion = action.data.data.occasion;
        updateInvoice.originalTotalAmount =
          action.data.data.originalTotalAmount;
        updateInvoice.outletId = action.data.data.outletId;
        updateInvoice.paymentType = action.data.data.paymentType;
        updateInvoice.privateRoom = action.data.data.privateRoom;
        updateInvoice.promocode = action.data.data.promocode;
        updateInvoice.reservationNotes = action.data.data.reservationNotes;
        updateInvoice.seatingPreference = action.data.data.seatingPreference;
        updateInvoice.source = action.data.data.source;
        updateInvoice.specialRequest = action.data.data.specialRequest;
        updateInvoice.status = action.data.data.status;
        updateInvoice.ticketingId = action.data.data.ticketingId;
        updateInvoice.totalAmount = action.data.data.totalAmount;
        updateInvoice.totalAmountBeforeDiscount =
          action.data.data.totalAmountBeforeDiscount;
        updateInvoice.totalPaidAmount = action.data.data.totalPaidAmount;
        updateInvoice.updatedAt = action.data.data.updatedAt;
        updateInvoice.updatedBy = action.data.data.updatedBy;
        updateInvoice.isValidSetupIntent = action.data.data.isValidSetupIntent;
      }
      if (updateTransactionalEmail?.OutletInvoice) {
        updateTransactionalEmail.OutletInvoice.status = action.data.data.status;
        updateTransactionalEmail.OutletInvoice.occasion =
          action.data.data.occasion;
        updateTransactionalEmail.OutletInvoice.specialRequest =
          action.data.data.specialRequest;
        updateTransactionalEmail.OutletInvoice.seatingPreference =
          action.data.data.seatingPreference;
        updateTransactionalEmail.OutletInvoice.dietaryRestriction =
          action.data.data.dietaryRestriction;
      }

      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        invoiceDetails: [...state.invoiceDetails],
        systemLogs: [...state.systemLogs],
      };

    case GET_CUSTOMER_PROFILE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        profiles: action.data.Customer,
        chunkRisk: action.data.ChurnRisk,
      };

    case UPDATE_ALL_CUSTOMER:
      let customer = state.customers.find(
        (data) => data.id === action.data.data.id
      );
      if (state.profiles.id === action.data.data.id && customer) {
        state.profiles.name = action.data.data.name;
        state.profiles.lastName = action.data.data.lastName;
        state.profiles.email = action.data.data.email;
        state.profiles.gender = action.data.data.gender;
        state.profiles.mobileNo = action.data.data.mobileNo;
        state.profiles.salutation = action.data.data.salutation;
        state.profiles.customerCompanyName =
          action.data.data.customerCompanyName;
        state.profiles.dob = action.data.data.dob;
        state.profiles.lastTransactionDate =
          action.data.data.lastTransactionDate;
        state.profiles.createdAt = action.data.data.createdAt;
        state.profiles.averageSpend = action.data.data.averageSpend;

        state.profiles.eatPoints = action.data.data.eatPoints;
        state.profiles.noOfRefferalPurchased =
          action.data.data.noOfRefferalPurchased;
        state.profiles.noOfRefferalSignUp = action.data.data.noOfRefferalSignUp;

        state.profiles.age = action.data.data.age;
        state.profiles.address = action.data.data.address;
        state.profiles.postalCode = action.data.data.postalCode;
        state.profiles.programName = action.data.data.programName;
        state.profiles.activationTerminal = action.data.data.activationTerminal;
        customer.name = action.data.data.name;
        customer.lastName = action.data.data.lastName;
        state.profiles.tags = action.data.data.tags;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        profiles: { ...state.profiles },
        customers: [...state.customers],
      };

    case RESET_CUSTOMER:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customers: [],
      };

    case RESET_IVRS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        ivrs: [],
      };

    case RESET_PROFILE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        profiles: null,
      };

    case SET_VISIBLE_SELECTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleOutletSelection: true,
      };

    case SET_INVISIBLE_SELECTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleOutletSelection: false,
      };

    case SET_VISIBLE_DISABLE_OUTLET:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleOutlet: false,
      };

    case SET_INVISIBLE_DISABLE_OUTLET:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleOutlet: true,
      };

    case SET_VISIBLE_DISABLE_COMPANY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleCompany: false,
      };

    case SET_INVISIBLE_DISABLE_COMPANY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleCompany: true,
      };

    case SET_VISIBLE_COMPANY_SELECTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleCompanySelection: true,
      };

    case SET_INVISIBLE_COMPANY_SELECTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleCompanySelection: false,
      };

    case SET_VISIBLE_MULTIPLE_COMPANY_SELECTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleMultipleCompanySelection: true,
      };

    case SET_INVISIBLE_MULTIPLE_COMPANY_SELECTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        isVisibleMultipleCompanySelection: false,
      };

    case GET_TAG_CATEGORY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        tagCategories: action.data.data,
      };

    case ADD_TAG_CATEGORY:
      state.tagCategories.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tagCategories: [...state.tagCategories],
      };

    case UPDATE_TAG_CATEGORY:
      let updateTagCategory = state.tagCategories.find(
        (data) => data.id === action.data.data.id
      );
      if (updateTagCategory) {
        updateTagCategory.name = action.data.data.name;
        updateTagCategory.description = action.data.data.description;
        updateTagCategory.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tagCategories: [...state.tagCategories],
      };

    case DELETE_TAG_CATEGORY:
      let deleteTagCategory = state.tagCategories.find(
        (data) => data.id === action.data.data
      );
      if (deleteTagCategory) {
        let index = state.tagCategories.indexOf(deleteTagCategory);
        state.tagCategories.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tagCategories: [...state.tagCategories],
      };

    case GET_AUTO_TAGGING:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        autoTagging: action.data.data,
      };

    case ADD_AUTO_TAGGING:
      state.autoTagging.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        autoTagging: [...state.autoTagging],
      };

    case DELETE_AUTO_TAGGING:
      let deleteAutoTagging = state.autoTagging.find(
        (data) => data.id === action.data.data
      );
      if (deleteAutoTagging) {
        let index = state.autoTagging.indexOf(deleteAutoTagging);
        state.autoTagging.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        autoTagging: [...state.autoTagging],
      };

    case GET_TIME_SLOT:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        timeSlots: action.data,
      };

    case GET_BOOKING_TABLE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        bookingTables: action.data,
      };

    case GET_BOOKING_EVENT:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        bookingTables: action.data,
      };

    case RESET_BOOKING_TABLES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        bookingTables: [],
      };

    case RESET_SECTION_TABLES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        sectionTables: [],
      };

    case RESET_MERGE_TABLES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        mergedTables: [],
      };

    case GET_BOOKING_RESERVATION:
      let outletInvoiceDetails = [...state.invoiceDetails];
      if (action.data.data.outletId === state.selectedOutlet.outlet.id)
        outletInvoiceDetails.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        invoiceDetails: [...outletInvoiceDetails],
      };

    case GET_BOOKING_RESERVATION_EVENT:
      let outletInvoiceDetail = [...state.invoiceDetails];
      if (action.data.data.outletId === state.selectedOutlet.outlet.id)
        outletInvoiceDetail.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        invoiceDetails: [...outletInvoiceDetail],
      };

    case GET_SEATING_VIEW:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        seatingView: action.data,
      };

    case UPDATE_SEATING_TABLE:
      let updateSeatingTable = state.seatingView.find(
        (data) => data.id === action.data.data.id
      );
      if (updateSeatingTable) {
        updateSeatingTable.OutletTableBooking = [
          ...action.data.data.OutletTableBooking,
        ];
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatingView: [...state.seatingView],
      };

    case MOVE_SEATING_RESERVATION:
      action.data.data.map((table) => {
        let updateSeatingTable = state.seatingView.find(
          (seatingTable) => table.id === seatingTable.id
        );
        if (updateSeatingTable) {
          updateSeatingTable.OutletTableBooking = [...table.OutletTableBooking];
        }
      });
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        seatingView: [...state.seatingView],
      };

    case RESET_SEATING_VIEW_TABLES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        seatingView: [],
      };

    case RESET_INVOICE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        invoiceDetails: [],
      };

    case RESET_INVOICE_DETAILS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        invoices: null,
      };

    case GET_COUPON:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        coupons: action.data.coupons,
        couponsTimeSlotDetails: { ...action.data.timeSlotDetails },
      };

    case ADD_COUPON:
      state.coupons.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        coupons: [...state.coupons],
      };

    case UPDATE_COUPON:
      if (action.data.data.id) {
        let coupon = state.coupons.find(
          (data) => data.id === action.data.data.id
        );
        if (coupon) {
          coupon.name = action.data.data.name;
          coupon.discountAmount = action.data.data.discountAmount;
          coupon.noOfPerson = action.data.data.noOfPerson;
          coupon.startDate = action.data.data.startDate;
          coupon.endDate = action.data.data.endDate;
          coupon.repeatOn = action.data.data.repeatOn;
          coupon.createdAt = action.data.data.createdAt;
          coupon.updatedAt = action.data.data.updatedAt;
          coupon.createdBy = action.data.data.createdBy;
          coupon.updatedBy = action.data.data.updatedBy;
          coupon.openingTime = action.data.data.openingTime;
          coupon.closingTime = action.data.data.closingTime;
          coupon.tc = action.data.data.tc;
        }
      } else {
        let deletePromo = state.coupons.find(
          (data) => data.id === action.data.data
        );
        if (deletePromo) {
          let index = state.coupons.indexOf(deletePromo);
          state.coupons.splice(index, 1);
        }
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        coupons: [...state.coupons],
      };

    case GET_ALL_MATERIALS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        materials: action.data,
      };

    case GET_MATERIAL_BY_ID:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        materials: action.data,
      };

    case ADD_MATERIALS:
      state.materials.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        materials: [...state.materials],
      };

    case UPDATE_MATERIAL:
      state.materials = action.data.data;
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        materials: { ...state.materials },
      };

    case DELETE_MATERIAL:
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
      };

    case GET_CATEGORY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        categories: action.data.data,
      };

    case RESET_CATEGORY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        categories: [],
      };

    case ADD_CATEGORY:
      state.categories.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        categories: [...state.categories],
      };

    case UPDATE_CATEGORY:
      let updateCategory = state.categories.find(
        (data) => data.id === action.data.data.id
      );
      if (updateCategory) {
        updateCategory.name = action.data.data.name;
        updateCategory.description = action.data.data.description;
        updateCategory.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        categories: [...state.categories],
      };

    case DELETE_CATEGORY:
      let deleteCategory = state.categories.find(
        (data) => data.id === action.data.data
      );
      if (deleteCategory) {
        let index = state.categories.indexOf(deleteCategory);
        state.categories.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        categories: [...state.categories],
      };

    case GET_ALL_SUBCATEGORY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        subCategories: action.data,
      };

    case RESET_ALL_SUBCATEGORY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        subCategories: [],
      };

    case ADD_SUBCATEGORY:
      state.subCategories.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        subCategories: [...state.subCategories],
      };

    case UPDATE_SUBCATEGORY:
      let subCategory = state.subCategories.find(
        (data) => data.id === action.data.data.id
      );
      if (subCategory) {
        subCategory.name = action.data.data.name;
        subCategory.description = action.data.data.description;
        subCategory.isActive = action.data.data.isActive;
        subCategory.createdAt = action.data.data.createdAt;
        subCategory.updatedAt = action.data.data.updatedAt;
        subCategory.createdBy = action.data.data.createdBy;
        subCategory.updatedBy = action.data.data.updatedBy;
        subCategory.tagCategory = action.data.data.tagCategoryId;
        subCategory.TagCategory = action.data.data.TagCategory;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        subCategories: [...state.subCategories],
      };

    case DELETE_SUBCATEGORY:
      let deleteSubCategory = state.subCategories.find(
        (data) => data.id === action.data.data
      );
      if (deleteSubCategory) {
        let index = state.subCategories.indexOf(deleteSubCategory);
        state.subCategories.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        subCategories: [...state.subCategories],
      };

    case GET_DINING_OPTION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        diningOptions: action.data,
      };

    case ADD_DINING_OPTION:
      state.diningOptions.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        diningOptions: [...state.diningOptions],
      };

    case UPDATE_DINING_OPTION:
      let diningOption = state.diningOptions.find(
        (data) => data.id === action.data.data.id
      );
      if (diningOption) {
        diningOption.image = action.data.data.image;
        diningOption.name = action.data.data.name;
        diningOption.price = action.data.data.price;
        diningOption.originalPrice = action.data.data.originalPrice;
        diningOption.bookingMaxQty = action.data.data.bookingMaxQty;
        diningOption.dailyMaxQty = action.data.data.dailyMaxQty;
        diningOption.description = action.data.data.description;
        diningOption.isActive = action.data.data.isActive;
        diningOption.createdAt = action.data.data.createdAt;
        diningOption.updatedAt = action.data.data.updatedAt;
        diningOption.createdBy = action.data.data.createdBy;
        diningOption.updatedBy = action.data.data.updatedBy;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        diningOptions: [...state.diningOptions],
      };

    case DELETE_DINING_OPTION:
      let deleteDiningOption = state.diningOptions.find(
        (data) => data.id === action.data.data
      );
      if (deleteDiningOption) {
        let index = state.diningOptions.indexOf(deleteDiningOption);
        state.diningOptions.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        diningOptions: [...state.diningOptions],
      };

    case GET_EMAIL_TEMPLATE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        emailTemplates: action.data.data,
      };

    case ADD_EMAIL_TEMPLATE:
      state.emailTemplates.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        emailTemplates: [...state.emailTemplates],
      };

    case UPDATE_EMAIL_TEMPLATE:
      let updateEmailTemplate = state.emailTemplates.find(
        (data) => data.id === action.data.data.id
      );
      if (updateEmailTemplate) {
        updateEmailTemplate.name = action.data.data.name;
        updateEmailTemplate.templateType = action.data.data.templateType;
        updateEmailTemplate.contentLanguage = action.data.data.contentLanguage;
        updateEmailTemplate.subject = action.data.data.subject;
        updateEmailTemplate.body = action.data.data.body;
        updateEmailTemplate.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        emailTemplates: [...state.emailTemplates],
      };

    case DELETE_EMAIL_TEMPLATE:
      let deleteEmailTemplate = state.emailTemplates.find(
        (data) => data.id === action.data.data
      );
      if (deleteEmailTemplate) {
        let index = state.emailTemplates.indexOf(deleteEmailTemplate);
        state.emailTemplates.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        emailTemplates: [...state.emailTemplates],
      };

    case GET_ALL_TICKET:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        tickets: action.data,
      };

    case ADD_TICKET:
      state.tickets.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tickets: [...state.tickets],
      };

    case UPDATE_TICKET:
      let ticket = state.tickets.find(
        (data) => data.id === action.data.data.id
      );
      if (ticket) {
        ticket.image = action.data.data.image;
        ticket.name = action.data.data.name;
        ticket.description = action.data.data.description;
        ticket.startDate = action.data.data.startDate;
        ticket.endDate = action.data.data.endDate;
        ticket.openingTime = action.data.data.openingTime;
        ticket.closingTime = action.data.data.closingTime;
        ticket.amount = action.data.data.amount;
        ticket.noOfPerson = action.data.data.noOfPerson;
        ticket.ticketMaxQuantity = action.data.data.ticketMaxQuantity;
        ticket.timeSlotInterval = action.data.data.timeSlotInterval;
        ticket.blockTable = action.data.data.blockTable;
        ticket.blockSchedule = action.data.data.blockSchedule;
        ticket.prePayment = action.data.data.prePayment;
        ticket.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tickets: [...state.tickets],
      };

    case DELETE_TICKET:
      let deleteTicket = state.tickets.find(
        (data) => data.id === action.data.data
      );
      if (deleteTicket) {
        let index = state.tickets.indexOf(deleteTicket);
        state.tickets.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        tickets: [...state.tickets],
      };

    case GET_SMS_TEMPLATE:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        smsTemplates: action.data.data,
      };

    case ADD_SMS_TEMPLATE:
      state.smsTemplates.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        smsTemplates: [...state.smsTemplates],
      };

    case UPDATE_SMS_TEMPLATE:
      let updateSmsTemplate = state.smsTemplates.find(
        (data) => data.id === action.data.data.id
      );
      if (updateSmsTemplate) {
        updateSmsTemplate.name = action.data.data.name;
        updateSmsTemplate.contentLanguage = action.data.data.contentLanguage;
        updateSmsTemplate.templateType = action.data.data.templateType;
        updateSmsTemplate.body = action.data.data.body;
        updateSmsTemplate.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        smsTemplates: [...state.smsTemplates],
      };

    case DELETE_SMS_TEMPLATE:
      let deleteSmsTemplate = state.smsTemplates.find(
        (data) => data.id === action.data.data
      );
      if (deleteSmsTemplate) {
        let index = state.smsTemplates.indexOf(deleteSmsTemplate);
        state.smsTemplates.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        smsTemplates: [...state.smsTemplates],
      };

    case GET_IVRS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        ivrs: action.data.data,
      };

    case UPDATE_IVRS:
      let updateIvrsDetail = state.ivrs.find(
        (data) => data.id === action.data.data.id
      );
      if (updateIvrsDetail) {
        updateIvrsDetail.isDone = action.data.data.isDone;
        updateIvrsDetail.tags = action.data.data.tags;
        updateIvrsDetail.notes = action.data.data.notes;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        ivrs: [...state.ivrs],
      };

    case GET_IVRS_INFO:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        ivrsInfo: action.data.data,
      };

    case GET_MARKETING:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        marketing: action.data.data,
      };

    case GET_CUSTOMER_LIST:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customerList: action.data.data,
      };

    case GET_CUSTOMER_LIST_TAGGING:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customerListTagging: action.data.data,
      };

    case RESET_CUSTOMER_LIST_TAGGING:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customerListTagging: [],
      };

    case GET_MEALTYPE_BY_COMPANY:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        mealTypeCompany: action.data.data,
      };

    case ADD_MARKETING:
      state.marketing.push(action.data.data);
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        marketing: [...state.marketing],
      };

    case UPDATE_MARKETING:
      let updateTemplate = state.marketing.find(
        (data) => data.id === action.data.data.id
      );
      if (updateTemplate) {
        updateTemplate.name = action.data.data.name;
        updateTemplate.description = action.data.data.description;
        updateTemplate.tags = action.data.data.tags;
        updateTemplate.isActive = action.data.data.isActive;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        marketing: [...state.marketing],
      };

    case DELETE_MARKETING:
      let deleteTemplate = state.marketing.find(
        (data) => data.id === action.data.data
      );
      if (deleteTemplate) {
        let index = state.marketing.indexOf(deleteTemplate);
        state.marketing.splice(index, 1);
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        marketing: [...state.marketing],
      };

    case GET_TIMETABLE_VIEW:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        timeline: action.data,
      };

    case GET_MEALTIME_VIEW:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        mealTime: action.data,
      };

    case UPDATE_IVRS_CONFIGRATION:
      let findCompanys = state.companies.find(
        (data) => data.id === action.data.data.id
      );
      if (findCompanys) {
        findCompanys.ivrsUserKey = action.data.data.ivrsUserKey;
        findCompanys.ivrsSecretKey = action.data.data.ivrsSecretKey;
      }
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        companies: [...state.companies],
      };

    case UPDATE_TWILIO_CONFIGRATION:
      state.companies.map((data) => {
        data.twilioAccountSid = action.data.data.twilioAccountSid;
        data.twilioAuthToken = action.data.data.twilioAuthToken;
        data.twilioMessagingServiceSid =
          action.data.data.twilioMessagingServiceSid;
      });
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        companies: [...state.companies],
      };

    case GET_USER_ACCESS_MODULES:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        moduleData: [...state.moduleData],
      };

    case GET_PERMISSION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        permission: action.data,
      };

    case GET_MODULE_PERMISSION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        modulePermissions: action.data,
      };

    case UPDATE_PERMISSION:
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        modulePermissions: { ...action.data.data },
      };

    case UPDATE_TABLE_POSITION:
      action.data.data.map((data) => {
        let tablePositions = state.timeline.find(
          (tableBooking) => data.id === tableBooking.id
        );

        if (tablePositions) {
          tablePositions.OutletTableBooking = [...data.OutletTableBooking];
          tablePositions.name = data.name;
          tablePositions.tableId = data.tableId;
        }
      });
      return {
        ...state,
        error_msg: null,
        success_msg: action.data.message,
        loading: false,
        timeline: [...state.timeline],
      };

    case SET_CUSTOMER_CRITERIA:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        selectedCustomerCriteria: action.data,
      };

    case MANAGE_FLOOR_PLAN:
      const showFloorPlan = !state.showFloorPlan;
      return {
        ...state,
        showFloorPlan: showFloorPlan,
      };

    case GET_ALL_REPORT:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        reports: action.data,
      };

    case GET_ALL_CUSTOMER_REPORT:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customerReports: action.data,
      };

    case GET_CUSTOMER_EVENT_REPORT:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        eventReports: action.data,
      };

    case GET_CUSTOMER_SINGLE_RESERVATION:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        eventSingleReservation: action.data,
      };

    case GET_ALL_CUSTOMER_CROSS_REPORT:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        customerCrossReports: action.data,
      };

    case GET_ALL_API_LOGS:
      return {
        ...state,
        error_msg: null,
        success_msg: null,
        loading: false,
        apiLogs: action.data,
      };

    default:
      return state;
  }
};
export default hotelReducer;
