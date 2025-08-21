/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.scss";
import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../../utils/userAccess";

const TableInfo = (props) => {
  const { open, handleCloseTableInfo } = props;

  return (
    <React.Fragment>
      <Drawer
        className="drawer popup-layout"
        anchor="right"
        open={open}
        onClose={handleCloseTableInfo}
      >
        <Box className="popup-header">
          <DialogTitle>OUTLET TABLE INFO</DialogTitle>
        </Box>
        <DialogContent sx={{ width: "330px" }} className="add-outlet-main">
          <div className="table-info">
            <div className="table-info-box">
              <Typography>Table Name</Typography>
              <TextField
                size="small"
                disabled
                fullWidth
                margin="normal"
                value={props.selectedTable.name}
              />
            </div>

            <div className="table-info-box">
              <Typography>Table No.</Typography>
              <TextField
                size="small"
                disabled
                fullWidth
                margin="normal"
                value={props.selectedTable.Table?.name}
              />
            </div>
            <div className="table-info-box">
              <Typography> NO Of Person</Typography>
              <TextField
                size="small"
                disabled
                fullWidth
                margin="normal"
                value={props.selectedTable.Table?.noOfPerson}
              />
            </div>

            <div className="table-info-box">
              <Typography>Seat Type</Typography>
              <TextField
                size="small"
                disabled
                fullWidth
                margin="normal"
                value={
                  props.selectedTable?.OutletSeatType?.SeatType
                    ? props.selectedTable?.OutletSeatType?.SeatType?.name
                    : "N/A"
                }
              />
            </div>
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
              onClick={props.handleOpenEditTableInfo}
              variant="contained"
              className="add-btn"
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
              type="submit"
              variant="contained"
              onClick={props.handleOpenDeleteOutletTable}
            >
              <DeleteOutlinedIcon /> DELETE
            </Button>
          </div>
          <Button
            variant="outlined"
            onClick={handleCloseTableInfo}
            className="close-btn"
          >
            <CloseOutlinedIcon /> Close
          </Button>
        </DialogActions>
      </Drawer>
    </React.Fragment>
  );
};
export default TableInfo;
