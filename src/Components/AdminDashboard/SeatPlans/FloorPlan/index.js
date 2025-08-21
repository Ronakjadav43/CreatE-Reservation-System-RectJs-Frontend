/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { Card, Typography, Switch } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import Draggable from "react-draggable";
import Xarrow from "react-xarrows";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ReactSVG } from "react-svg";
import { cloneDeep } from "lodash";

import * as UserAction from "../../../../Action/AdminDashboard";
import UploadFloorPlan from "./UploadFloor";
import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import AddOutletTable from "./AddOutletTable";
import TableInfo from "./TableInfo";
import EditOutletTable from "./EditTableInfo";
import DeletePopUp from "../../../../CommonComponent/DeletePopUp";
import SectionTableList from "./SectionTableList";
import {
  getSVGColour,
  getTableShape,
} from "../../../../utils/tableShapeAdjustment";
import MergeTableList from "./MergeTableList/index";
import AddMergeTable from "./AddMergeTable";
import AddSectionTable from "./AddSectionTable";
import OutletTableList from "./OutletTableList";
import { RESET_OUTLETTABLES } from "../../../../utils/AdminDashboard/Constant";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../utils/userAccess";
import "./style.scss";

const FloorPlan = (props) => {
  const [open, setOpen] = useState(false);
  const [setFloorImage, isSetFloorImage] = useState(false);
  const [tables, setTables] = useState([]);
  const [outletTables, setOutletTables] = useState([]);
  const [tablePosition, setTablePosition] = useState(null);
  const [isSave, setIsSave] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openEditTableInfo, setOpenEditTableInfo] = useState(false);
  const [OpenDeleteOutletTable, setOpenDeleteOutletTable] = useState(false);
  const [isActiveTableMerging, setIsActiveTableMerging] = useState(false);
  const [isActiveOutletTables, setIsActiveOutletTables] = useState(true);
  const [tableListForMerge, setTableListForMerge] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addMergeTable, setAddMergeTable] = useState(false);
  const [addSectionTable, setAddSectionTable] = useState(false);
  const [isFloorPlanVisible, setIsFloorPlanVisible] = useState(true);
  const [isActiveSections, setIsActiveSections] = useState(false);
  const [outletSectionTables, setOutletSectionTables] = useState([]);
  const [sectionTables, setSectionTables] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSectionTable, setSelectedSectionTable] = useState(null);

  const dispatch = useDispatch();

  const hotelReducer = useSelector((state) => ({
    tables: state.hotelReducer.tables,
    outletTables: state.hotelReducer.outletTables,
    sectionTables: state.hotelReducer.sectionTables,
    mergedTables: state.hotelReducer.mergedTables,
  }));

  useEffect(() => {
    setOutletTables([]);
    if (props.selectedOutlet) {
      props.actions.userAction.getTable(props.selectedOutlet.outlet.id);
      props.actions.userAction.getOutletTables(props.outletSeatingType.id);
      props.actions.userAction.getTableSection(props.outletSeatingType.id);
      props.actions.userAction.getTableMerge(props.outletSeatingType.id);
    }
    return () => {
      dispatch({ type: RESET_OUTLETTABLES });
      setOutletTables([]);
    };
  }, []);

  useEffect(() => {
    if (hotelReducer.sectionTables) {
      const tables = [];

      hotelReducer.sectionTables
        .filter((tables) => tables.isPrivate === false)
        .map((section) => {
          section.OutletTableSection.map((outletTable) => {
            tables.push({ ...outletTable, color: section.color });
          });
        });
      setOutletSectionTables([...tables]);
    }
  }, [hotelReducer.sectionTables]);

  useEffect(() => {
    if (hotelReducer.tables.length > 0) {
      setTables(hotelReducer.tables.filter((table) => table.isActive === true));
    }
  }, [hotelReducer.tables]);

  useEffect(() => {
    if (hotelReducer.outletTables) {
      setOutletTables(cloneDeep(hotelReducer.outletTables));
    }
  }, [hotelReducer.outletTables]);

  useEffect(() => {
    if (hotelReducer.sectionTables) {
      const filterSection = hotelReducer.sectionTables.filter(
        (table) => table.isPrivate === false
      );
      setSectionTables(filterSection);
    }
  }, [hotelReducer.sectionTables]);

  const handleOpenAddOutletTable = () => {
    setOpen(true);
  };

  const handleCloseAddOutletTable = () => {
    setOpen(false);
  };

  const handleOpenFloorPlanImage = () => {
    isSetFloorImage(true);
  };

  const handleCloseFloorPlanImage = () => {
    isSetFloorImage(false);
  };

  const handleOpenEditTableInfo = () => {
    setDrawerOpen(false);
    setOpenEditTableInfo(true);
  };

  const handleOpenDeleteSectionTable = (data) => {
    setSelectedSectionTable(data);
    setDeleteOpen(true);
  };

  const handleCloseDeleteSectionTable = () => {
    setDeleteOpen(false);
  };

  const handleEditSelectedTable = (data) => {
    const findTable = outletTables.find(
      (outletTable) => outletTable.id === data.id
    );
    if (findTable) {
      setSelectedTable(findTable);
      handleOpenEditTableInfo();
    }
  };

  const handleCloseTableInfo = () => {
    setDrawerOpen(false);
  };

  const handleOpenDeleteOutletTable = () => {
    setDrawerOpen(false);
    setOpenDeleteOutletTable(true);
  };

  const handleDeleteSelectedTable = (data) => {
    const findTable = outletTables.find(
      (outletTable) => outletTable.id === data.id
    );
    if (findTable) {
      setSelectedTable(findTable);
      handleOpenDeleteOutletTable();
    }
  };

  const handleCloseDeleteOutletTable = () => {
    setOpenDeleteOutletTable(false);
  };

  const handleCloseEditTableInfo = () => {
    setOpenEditTableInfo(false);
  };

  const handleSaveEditTableInfo = (data, tableId) => {
    props.actions.userAction.updataTableInfo(data, tableId);
  };

  const handleSaveAddOutletTable = (data) => {
    props.actions.userAction.addOutletTable(data, props.outletSeatingType.id);
  };

  const handleUploadFloorPlan = (data) => {
    props.actions.userAction.uploadFloorPlan(data, props.outletSeatingType.id);
  };

  const handleDeleteOutletTable = (data) => {
    const { id } = data;
    props.actions.userAction.deleteOutletTable(id);
  };

  const handleSavePosition = () => {
    props.actions.userAction.updateOutletTablePosition(
      outletTables,
      props.outletSeatingType.id
    );
    setIsSave(true);
  };

  const handleDragStart = (event) => {
    const tableId = event.target.id;
    if (tableId) {
      const commonData = [...outletTables];
      const findTable = commonData.find(
        (singleTable) => singleTable.id === Number(tableId)
      );
      if (findTable) {
        setTablePosition(findTable);
        setIsSave(false);
      }
    }
  };

  const handleDragStop = (event, position) => {
    if (!isActiveTableMerging) {
      const { lastX, lastY } = position;
      if (tablePosition) {
        const commonData = [...outletTables];
        const findTable = commonData.find(
          (singleTable) => singleTable.id === tablePosition.id
        );
        if (findTable) {
          findTable.xPosition = lastX;
          findTable.yPosition = lastY;
          setOutletTables([...commonData]);
        }
      }
    }
  };

  const handleOpenAddMergeTable = () => {
    setAddMergeTable(true);
  };

  const handleCloseAddMergeTable = () => {
    setAddMergeTable(false);
  };

  const handleOpenSectionTable = () => {
    setAddSectionTable(true);
  };

  const handleCloseSectionTable = () => {
    setAddSectionTable(false);
  };

  const handleClick = (e, singleTable) => {
    if (!isActiveTableMerging) {
      if (e.detail === 2) {
        setDrawerOpen(true);
        setSelectedTable(singleTable);
      }
    } else if (e.detail === 1) {
      setSelectedRow(null);
      const mergingTableList = [...tableListForMerge];
      const findMergeTable = mergingTableList.find(
        (table) => table.id === singleTable.id
      );
      if (findMergeTable) {
        const index = mergingTableList.indexOf(findMergeTable);
        mergingTableList.splice(index, 1);
      } else {
        mergingTableList.push(singleTable);
      }
      setTableListForMerge(mergingTableList);
    }
  };

  const handleUnselectAll = () => {
    setTableListForMerge([]);
  };

  const handleTableMergeSwitch = () => {
    setIsActiveTableMerging(!isActiveTableMerging);
    setTableListForMerge([]);
    setIsSave(true);
    setSelectedRow(null);
    if (isActiveSections) {
      setIsActiveOutletTables(false);
    } else {
      setIsActiveOutletTables(!isActiveOutletTables);
    }
  };

  const handleFloorPlanVisible = () => {
    setIsFloorPlanVisible(!isFloorPlanVisible);
  };

  const handleSectionVisible = () => {
    if (!isActiveSections) {
      setIsActiveOutletTables(false);
    } else {
      setIsActiveOutletTables(true);
    }
    setIsActiveSections(!isActiveSections);
    setTableListForMerge([]);
    setIsSave(true);
    setSelectedRow(null);
  };

  const handleSaveMergeTable = (data) => {
    props.actions.userAction.createTableMerge(data, props.outletSeatingType.id);
    setTableListForMerge([]);
  };

  const handleSaveSectionTable = (data) => {
    props.actions.userAction.createSection(data, props.outletSeatingType.id);
    setTableListForMerge([]);
  };

  const handleDeleteSelectedSectionTable = (data) => {
    const { id } = data;
    props.actions.userAction.deleteSectionTable(id);
  };

  const selectedTableRow = (row) => {
    setTableListForMerge([]);
    setSelectedRow(row);
  };

  const getMergeTableConnected = (mergedTables) => {
    if (mergedTables) {
      let tableList = [];
      const mergeTableList = mergedTables.map((groupPossibility) => {
        return groupPossibility.GroupPossibility.map((outletGroupTable) => {
          return outletGroupTable.OutletGroupTable.map((singleTable, index) => {
            if (index < outletGroupTable.OutletGroupTable.length - 1) {
              const firstTable = singleTable;
              const secondTable = outletGroupTable.OutletGroupTable[index + 1];
              const findTable = tableList.find(
                (table) =>
                  table.t1 === firstTable.OutletTable.id &&
                  table.t2 === secondTable.OutletTable.id
              );

              if (findTable) {
                return null;
              }
              tableList.push({
                t1: firstTable.OutletTable.id,
                t2: secondTable.OutletTable.id,
              });
              return (
                <Xarrow
                  color="#FF0000"
                  showHead={false}
                  start={firstTable.OutletTable.id.toString()}
                  end={secondTable.OutletTable.id.toString()}
                />
              );
            } else {
              return null;
            }
          });
        });
      });
      return mergeTableList;
    }
  };

  return (
    <React.Fragment>
      {props.outletSeatingType && (
        <div style={{ height: "calc(100vh - 280px)", overflow: "auto" }}>
          {drawerOpen && (
            <TableInfo
              open={drawerOpen}
              selectedTable={{ ...selectedTable }}
              handleOpenEditTableInfo={handleOpenEditTableInfo}
              handleOpenDeleteOutletTable={handleOpenDeleteOutletTable}
              handleCloseTableInfo={handleCloseTableInfo}
              permission={{ ...props.permission }}
            />
          )}
          {open && (
            <AddOutletTable
              open={open}
              handleCloseAddOutletTable={handleCloseAddOutletTable}
              handleSaveAddOutletTable={handleSaveAddOutletTable}
              tables={[...tables]}
              outletSeatTypes={[...props.outletSeatTypes]}
            />
          )}
          {openEditTableInfo && (
            <EditOutletTable
              open={openEditTableInfo}
              selectedTable={{ ...selectedTable }}
              tables={[...tables]}
              outletSeatTypes={[...props.outletSeatTypes]}
              handleCloseEditTableInfo={handleCloseEditTableInfo}
              handleSaveEditTableInfo={handleSaveEditTableInfo}
            />
          )}
          {addMergeTable && (
            <AddMergeTable
              open={addMergeTable}
              tableListForMerge={[...tableListForMerge]}
              handleSaveMergeTable={handleSaveMergeTable}
              handleCloseAddMergeTable={handleCloseAddMergeTable}
            />
          )}
          {addSectionTable && (
            <AddSectionTable
              open={addSectionTable}
              tableListForMerge={[...tableListForMerge]}
              handleSaveSectionTable={handleSaveSectionTable}
              handleCloseSectionTable={handleCloseSectionTable}
            />
          )}
          {OpenDeleteOutletTable && (
            <DeletePopUp
              open={OpenDeleteOutletTable}
              data={{ ...selectedTable }}
              handleClose={handleCloseDeleteOutletTable}
              handleDelete={handleDeleteOutletTable}
              message="Confirm To Delete Outlet Table"
            />
          )}
          {setFloorImage && (
            <UploadFloorPlan
              open={setFloorImage}
              handleCloseFloorPlanImage={handleCloseFloorPlanImage}
              handleUploadFloorPlan={handleUploadFloorPlan}
            />
          )}
          {deleteOpen && (
            <DeletePopUp
              open={deleteOpen}
              data={selectedSectionTable}
              handleClose={handleCloseDeleteSectionTable}
              handleDelete={handleDeleteSelectedSectionTable}
              message="Confirm To Delete Section Table"
            />
          )}

          <Box className="indoor" pb={2}>
            <div className="indoor-header">
              <div className="indoor-header-inner">
                <div className="switch">
                  <Typography>Table Merging Mode</Typography>
                  <Switch
                    className="switch-status"
                    checked={isActiveTableMerging}
                    onClick={handleTableMergeSwitch}
                  />

                  <div className="gap-10 primary-btn">
                    <Button
                      className="add-btn"
                      variant="contained"
                      disabled={
                        !(
                          (isActiveTableMerging &&
                            tableListForMerge.length > 1) ||
                          handlePermission(
                            props.permission.permission,
                            Modules.SEATPLANS,
                            ActionType.create,
                            true
                          )
                        )
                      }
                      onClick={handleOpenAddMergeTable}
                    >
                      <AddOutlinedIcon /> MERGE
                    </Button>

                    <Button
                      className="add-btn"
                      variant="contained"
                      disabled={
                        !(
                          (isActiveTableMerging &&
                            tableListForMerge.length > 1) ||
                          handlePermission(
                            props.permission.permission,
                            Modules.SEATPLANS,
                            ActionType.create,
                            true
                          )
                        )
                      }
                      onClick={handleOpenSectionTable}
                    >
                      <AddOutlinedIcon /> SECTION
                    </Button>
                    <div className="unselect-btn">
                      <Button
                        className="large"
                        color="error"
                        variant="contained"
                        onClick={handleUnselectAll}
                        disabled={
                          !(
                            isActiveTableMerging && tableListForMerge.length > 1
                          )
                        }
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="switch primary-btn">
                  <Button
                    className="add-btn"
                    variant="contained"
                    onClick={handleSavePosition}
                    disabled={
                      isSave ||
                      isActiveTableMerging ||
                      handlePermission(
                        props.permission.permission,
                        Modules.SEATPLANS,
                        ActionType.update,
                        true
                      )
                    }
                  >
                    <SaveOutlinedIcon /> SAVE
                  </Button>

                  <Button
                    className="add-btn large"
                    variant="contained"
                    disabled={
                      isActiveTableMerging ||
                      handlePermission(
                        props.permission.permission,
                        Modules.SEATPLANS,
                        ActionType.create,
                        true
                      )
                    }
                    onClick={handleOpenAddOutletTable}
                  >
                    <AddOutlinedIcon /> ADD TABLE
                  </Button>
                </div>
              </div>

              <div className="primary-btn">
                <Button
                  disabled={handlePermission(
                    props.permission.permission,
                    Modules.SEATPLANS,
                    ActionType.create,
                    true
                  )}
                  className="add-btn large"
                  variant="contained"
                  onClick={handleOpenFloorPlanImage}
                >
                  <AddOutlinedIcon /> Floor Plan
                </Button>
              </div>
            </div>

            <div className="floor-plan-main">
              <div
                className="floor-plan"
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundImage:
                    isFloorPlanVisible &&
                    `url(${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${props.outletSeatingType.image})`,
                }}
              >
                {outletTables.map((table) => (
                  <React.Fragment>
                    <Draggable
                      bounds="parent"
                      onStart={handleDragStart}
                      onStop={handleDragStop}
                      position={{
                        x: table.xPosition,
                        y: table.yPosition,
                      }}
                      key={table.id}
                    >
                      <Card
                        id={table.id}
                        className={table.Table.shape}
                        style={{
                          ...getTableShape(
                            table.Table.shape,
                            table.Table.noOfPerson
                          ),
                        }}
                        onClick={(e) => handleClick(e, table)}
                      >
                        <ReactSVG
                          style={{
                            fill: getSVGColour(
                              isActiveSections,
                              tableListForMerge,
                              selectedRow,
                              outletSectionTables,
                              table
                            ),
                          }}
                          id={table.id}
                          className="table-image"
                          src={
                            getTableShape(
                              table.Table.shape,
                              table.Table.noOfPerson
                            ).svgUrl
                          }
                        />

                        <div className="table-infos" id={table.id}>
                          <div className="info-inner" id={table.id}>
                            {isActiveTableMerging ? (
                              <div className="info-text" id={table.id}>
                                {Number(tableListForMerge.indexOf(table)) !== -1
                                  ? Number(tableListForMerge.indexOf(table)) + 1
                                  : table.name}
                              </div>
                            ) : (
                              <div className="info-text" id={table.id}>
                                {table.name}
                              </div>
                            )}
                          </div>
                          <div className="info-text" id={table.id}>
                            {table.Table.noOfPerson}PX
                          </div>
                        </div>
                      </Card>
                    </Draggable>
                    {isActiveTableMerging &&
                      getMergeTableConnected(hotelReducer.mergedTables)}
                  </React.Fragment>
                ))}
              </div>
              <div className="floor-plan-right">
                <div></div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Switch
                      className="switch-status"
                      checked={isFloorPlanVisible}
                      onClick={handleFloorPlanVisible}
                      label="Display uploaded floorplan"
                    />
                    <span>Display uploaded floor plan</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Switch
                      className="switch-status"
                      checked={isActiveSections}
                      onClick={handleSectionVisible}
                    />
                    <span>Highlight all sections</span>
                  </div>
                </div>
              </div>
            </div>
          </Box>

          {isActiveSections && (
            <SectionTableList
              sectionTables={[...sectionTables]}
              handleOpenDeleteSectionTable={handleOpenDeleteSectionTable}
              selectedTableRow={selectedTableRow}
              permission={{ ...props.permission }}
              selectedRow={{ ...selectedRow }}
            />
          )}

          {isActiveTableMerging && (
            <MergeTableList
              mergedTables={[...hotelReducer.mergedTables]}
              outletSeatingType={{ ...props.outletSeatingType }}
              selectedTableRow={selectedTableRow}
              selectedRow={{ ...selectedRow }}
              permission={{ ...props.permission }}
            />
          )}

          {hotelReducer.outletTables.length > 0 && (
            <OutletTableList
              outletTables={[...outletTables]}
              handleEditSelectedTable={handleEditSelectedTable}
              handleDeleteSelectedTable={handleDeleteSelectedTable}
              permission={{ ...props.permission }}
              selectedTableRow={selectedTableRow}
              selectedRow={{ ...selectedRow }}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(FloorPlan);
