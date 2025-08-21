/* eslint-disable array-callback-return */
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";

import "./style.scss";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../../utils/userAccess";

const MergeTableInfo = (props) => {
  const { open, handleCloseMergeTable, addTableMergePossibility } = props;
  const [mergeTableInfo, setMergeTableInfo] = useState([]);
  const [isActiveaddPossibility, setIsActiveAddPossibility] = useState(false);
  const [groupSequenceTable, setGroupSequenceTable] = useState([]);

  useEffect(() => {
    if (!isEmpty(props.selectedMergedTable)) {
      let tablePosibilities = [];
      let tableMergelist = [];
      props.selectedMergedTable.GroupSequenceTable.map((table) =>
        tableMergelist.push({ ...table.OutletTable, isChecked: false })
      );
      props.selectedMergedTable.GroupPossibility.map((possibility) => {
        let tables = "";
        possibility.OutletGroupTable.map((table, index) => {
          if (index === 0) tables += table.OutletTable.name;
          else tables += " ," + table.OutletTable.name;
        });
        tablePosibilities.push({
          id: possibility.id,
          groupId: props.selectedMergedTable.id,
          tables,
        });
      });
      setMergeTableInfo([...tablePosibilities]);
      setGroupSequenceTable([...tableMergelist]);
    }
  }, [props.selectedMergedTable]);

  const handleTableSelect = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = [...groupSequenceTable];
    const data = tempData.map((table) =>
      table.name === value ? { ...table, isChecked: !table.isChecked } : table
    );
    setGroupSequenceTable([...data]);
  };

  const addPossibility = () => {
    addTableMergePossibility(groupSequenceTable);
  };

  return (
    <React.Fragment>
      <Drawer
        className="drawer popup-layout"
        anchor="right"
        open={open}
        onClose={handleCloseMergeTable}
      >
        <Box className="popup-header">
          <DialogTitle>MERGE TABLE INFO</DialogTitle>
        </Box>

        <DialogContent
          sx={{ width: "330px", flexDirection: "column", gap: "30px" }}
          className="popup-body1"
        >
          <div className="add-possibility">
            <Button
              variant="contained"
              onClick={() => setIsActiveAddPossibility(!isActiveaddPossibility)}
            >
              <AddOutlinedIcon /> ADD Possibility
            </Button>
          </div>
          <div className="table-merge">
            {mergeTableInfo.map((info, index) => (
              <div className="table-merge-info" key={index}>
                <span className="merge-info-text">{info.tables}</span>
                <div className="delete-icon">
                  <DeleteOutlinedIcon
                    style={{
                      cursor: handlePermission(
                        props.permission.permission,
                        Modules.SEATPLANS,
                        ActionType.delete
                      )
                        ? "pointer"
                        : "not-allowed",
                    }}
                    onClick={() =>
                      handlePermission(
                        props.permission.permission,
                        Modules.SEATPLANS,
                        ActionType.delete
                      ) && props.handleOpenDeleteMergeTablePossibility(info)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="possibility-drower">
            {isActiveaddPossibility && (
              <FormControl sx={{ width: 300 }} size="small">
                <Select
                  multiple
                  value={groupSequenceTable}
                  onChange={handleTableSelect}
                  renderValue={(selected) => {
                    selected = groupSequenceTable.filter(
                      (table) => table.isChecked === true
                    );
                    const renderData = selected.map((data) => data.name);
                    return renderData.join(", ");
                  }}
                >
                  {groupSequenceTable.map((table) => (
                    <MenuItem key={table.id} value={table.name}>
                      <ListItemIcon>
                        <Checkbox checked={table.isChecked} />
                      </ListItemIcon>
                      <ListItemText primary={table.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {isActiveaddPossibility && (
              <div className="add-possibility">
                <Button
                  variant="contained"
                  onClick={addPossibility}
                  disabled={
                    !(
                      groupSequenceTable.filter(
                        (table) => table.isChecked === true
                      ).length > 1
                    )
                  }
                >
                  <AddOutlinedIcon /> SAVE
                </Button>
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions className="footer">
          <div className="footer-btn">
            <Button
              disabled={handlePermission(
                props.permission.permission,
                Modules.SEATPLANS,
                ActionType.update,
                true
              )}
              variant="contained"
              onClick={props.handleOpenEditMergetTable}
            >
              <BorderColorOutlinedIcon /> EDIT
            </Button>
            <Button
              disabled={handlePermission(
                props.permission.permission,
                Modules.SEATPLANS,
                ActionType.delete,
                true
              )}
              variant="contained"
              onClick={props.handleOpenDeleteMergeTable}
            >
              <DeleteOutlinedIcon /> DELETE
            </Button>
          </div>
          <Button
            variant="outlined"
            onClick={handleCloseMergeTable}
            className="close-btn"
          >
            <CloseOutlinedIcon /> Close
          </Button>
        </DialogActions>
      </Drawer>
    </React.Fragment>
  );
};

export default MergeTableInfo;
