import { isEmpty, unionBy } from "lodash";
import {
  getSelectedOutlet,
  setSelectedCompany,
  setSelectedutlet,
} from "../utils";
import { useDispatch } from "react-redux";
import {
  SET_COMPANYLIST_FOR_DROPDOWN,
  SET_OUTLIST_FOR_DROPDOWN,
} from "./AdminDashboard/Constant";

/* eslint-disable array-callback-return */
export const Modules = {
  OUTLETMANAGEMENT: "OutletManagement",
  MEALTYPE: "MealType",
  MEALTIMING: "MealTiming",
  CLOSURE: "Closure",
  TIMINGPROMO: "TimingPromo",
  PREORDER: "PreOrder",
  EMAILTEMPLATE: "EmailTemplate",
  DINNINGOPTION: "DinningOption",
  SMSTEMPLATE: "SmsTemplate",
  SEATPLANS: "SeatPlans",
  SPACES: "Spaces",
  SEATTYPE: "SeatType",
  TABLEMANAGEMENT: "TableManagement",
  TAGCATEGORY: "TagCategory",
  TAGS: "Tags",
  RESERVEDKEYWORDS: "ReservedKeywords",
  CALLMANAGEMENT: "CallManagement",
  TICKETING: "Ticketing",
  CUSTOMERMANAGEMENT: "CustomerManagement",
  MATERIALS: "Materials",
  MATERIALCATEGORY: "MaterialCategory",
  MATERIALSUBCATEGORY: "MaterialSubCategory",
  USERGROUP: "UserGroup",
  USERLIST: "UserList",
  USERGROUPACCESS: "UserGroupAccess",
  COMPANYMANAGEMENT: "CompanyManagement",
  SUPERUSER: "SuperUser",
  IVRSCONFIGURATION: "IvrsConfiguration",
  TWILIO: "Twilio",
  MARKETING: "Marketing",
  REPORTS: "Reports",
  RESERVATIONMANAGEMENT: "ReservationManagement",
  AUTOTAGGING: "AutoTagging",
};

export const ActionType = {
  create: "isCreate",
  update: "isUpdate",
  delete: "isDelete",
  read: "isRead",
};

export const handlePermission = (
  userPermission,
  moduleName,
  action,
  revert = false,
  outletId = undefined
) => {
  let permission = false;
  if (outletId !== null && userPermission && userPermission.length > 0) {
    userPermission.find((data) => {
      if (data.moduleName === moduleName) {
        permission = data[action];
      }
    });
  }
  if (revert) {
    return !permission;
  }
  return permission;
};

export const SetPermisibleOutlets = (
  moduleWisePermission,
  moduleName,
  action,
  outlets,
  companies
) => {
  const dispatch = useDispatch();

  let outletIds = [];
  let outletList = [];
  let companyList = [];
  let isAdmin = false;

  const getModulePermissionOfAllOutlet = moduleWisePermission.permissions.find(
    (permission) => permission.moduleName === moduleName
  );

  getModulePermissionOfAllOutlet.outlets.map((outlet) => {
    if (outlet[action] === true) {
      if (outlet.outletId === null) isAdmin = true;
      outletIds.push(outlet.outletId);
    }
  });

  outlets.map((outlet) => {
    if (outletIds.includes(outlet.outlet.id) || isAdmin) {
      outletList.push(outlet);
      companyList.push(
        companies.find((company) => company.id === outlet.outlet.companyId)
      );
    }
  });

  const activeCompanys = companyList.map((company) => {
    return { ...company, isChecked: true };
  });

  if (companyList.length > 1) {
    companyList = [
      { name: "All", id: Math.random() * 10, isChecked: true },
      ...activeCompanys,
    ];
  } else {
    companyList = activeCompanys;
  }

  companyList = unionBy(companyList, "id");

  if (outletList && outletList.length > 0) {
    dispatch({
      type: SET_OUTLIST_FOR_DROPDOWN,
      data: { outletList, companyList },
    });
  }
};

export const SetPermisibleCompanies = (
  moduleWisePermission,
  moduleName,
  action,
  companies,
  checkBoxSelection = true
) => {
  const dispatch = useDispatch();

  let companyList = [];
  let companyIds = [];
  let isAdmin = false;

  const getModulePermissionOfAllOutlet = moduleWisePermission.permissions.find(
    (permission) => permission.moduleName === moduleName
  );

  getModulePermissionOfAllOutlet.companies.map((company) => {
    if (company[action] === true) {
      if (company.companyId === null) isAdmin = true;
      companyIds.push(company.companyId);
    }
  });

  companies.map((company) => {
    if (companyIds.includes(company.id) || isAdmin) {
      companyList.push(company);
    }
  });

  const activeCompanys = companyList.map((company) => {
    return { ...company, isChecked: true };
  });

  if (companyList.length > 1 && checkBoxSelection) {
    companyList = [
      { name: "All", id: Math.random() * 10, isChecked: true },
      ...activeCompanys,
    ];
  } else {
    companyList = activeCompanys;
  }
  if (companyList && companyList.length > 0) {
    dispatch({
      type: SET_COMPANYLIST_FOR_DROPDOWN,
      data: companyList,
    });
  }
};

export const handleUpdatedBy = (updateValue) => {
  const data = updateValue.toString().split(",");
  if (data.length > 0) {
    if (!isEmpty(data[0].toString().trim())) {
      return data[0];
    }
    return data[1];
  }
};

export const getSelectedOutletAndCompany = (
  outlets,
  companies,
  preSelectedOutlet = null,
  preSelectedCompany = null
) => {
  let selectedOutlet = null;
  let selectedCompany = null;

  if (outlets.length > 0 && companies.length > 0) {
    let activeOutlets = outlets.filter((data) => data.outlet.isActive === true);
    const activeCompanies = companies.filter((data) => data.isActive === true);
    if (activeOutlets.length > 0 && activeCompanies.length > 0) {
      if (preSelectedOutlet) {
        selectedOutlet = preSelectedOutlet;
        setSelectedutlet(JSON.stringify(preSelectedOutlet));
      } else {
        const localStorageSelectedOutlet = getSelectedOutlet();
        if (localStorageSelectedOutlet) {
          selectedOutlet = JSON.parse(localStorageSelectedOutlet);
          let findOutlet = outlets.find(
            (data) => data.outlet.id === selectedOutlet.outlet.id
          );
          if (findOutlet) {
            selectedOutlet = findOutlet;
            setSelectedutlet(JSON.stringify(findOutlet));
          }
        } else {
          selectedOutlet = activeOutlets[0];
          setSelectedutlet(JSON.stringify(activeOutlets[0]));
        }
      }

      if (selectedOutlet) {
        if (preSelectedCompany) {
          selectedCompany = preSelectedCompany;
          setSelectedCompany(JSON.stringify(preSelectedCompany));
          const findOutletByCompany = activeOutlets.find(
            (outlet) => outlet.outlet.companyId === selectedCompany.id
          );
          if (findOutletByCompany) {
            selectedOutlet = findOutletByCompany;
            setSelectedutlet(JSON.stringify(selectedOutlet));
          }
        } else {
          const findCompanyOfSelectedOutlet = activeCompanies.find(
            (company) => company.id === selectedOutlet.outlet.companyId
          );

          if (findCompanyOfSelectedOutlet) {
            selectedCompany = findCompanyOfSelectedOutlet;
            setSelectedCompany(JSON.stringify(findCompanyOfSelectedOutlet));
          }
        }
      }
    }
  }
  return { selectedOutlet, selectedCompany };
};
