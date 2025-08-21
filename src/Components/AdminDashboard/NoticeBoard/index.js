/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Card, Pagination } from "@mui/material";
import _ from "lodash";
import { bindActionCreators } from "redux";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import * as UserAction from "../../../Action/AdminDashboard";
import AddOutletNote from "./Add";
import "./style.scss";
import EditOutletNote from "./Edit";
import DeletePopUp from "../../../CommonComponent/DeletePopUp";

const NoticeBoard = (props) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOutletNote, setSelectedOutletNote] = useState([]);
  let [notice, setNotice] = useState([]);
  let [chunks, setChunks] = useState([]);
  let [page, setPage] = useState(1);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    outletNotes: state.hotelReducer.outletNotes,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet && props.date)
      props.actions.userAction.getOutletNotes(
        hotelReducer.selectedOutlet?.outlet.id,
        props.date
      );
  }, [hotelReducer.selectedOutlet, props.date]);

  useEffect(() => {
    let split = _.chunk(hotelReducer.outletNotes, 3);
    if (split.length > 0) {
      setNotice(split[page - 1]);
      setChunks(split);
    } else {
      setNotice([]);
    }
  }, [hotelReducer.outletNotes]);

  const pageChange = (e, number) => {
    setNotice(chunks[number - 1]);
    setPage(number);
  };

  const handleOpenOutletNote = () => {
    setOpen(true);
  };

  const handleCloseOutletNote = () => {
    setOpen(false);
  };

  const handleSaveOutletNote = (data) => {
    props.actions.userAction.addOutletNote(
      data,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleOpenEditOutletNote = (data) => {
    setEditOpen(true);
    setSelectedOutletNote(data);
  };

  const handleCloseEditOutletNote = () => {
    setEditOpen(false);
  };

  const handleEditSaveOutletNote = (data) => {
    props.actions.userAction.editOutletNote(
      data,
      selectedOutletNote.id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  const handleCLoseDeleteOutletNote = () => {
    setDeleteOpen(false);
  };

  const handleOpenDeleteOutletData = (data) => {
    setDeleteOpen(true);
    setSelectedOutletNote(data);
  };

  const handleDeleteOutletNote = (data) => {
    props.actions.userAction.deleteOutletNote(
      data,
      selectedOutletNote.id,
      hotelReducer.selectedOutlet?.outlet.id
    );
  };

  return (
    <React.Fragment>
      {open && (
        <AddOutletNote
          open={open}
          handleCloseOutletNote={handleCloseOutletNote}
          handleSaveOutletNote={handleSaveOutletNote}
        />
      )}

      {editOpen && (
        <EditOutletNote
          open={editOpen}
          selectedOutletNote={selectedOutletNote}
          handleCloseEditOutletNote={handleCloseEditOutletNote}
          handleEditSaveOutletNote={handleEditSaveOutletNote}
        />
      )}

      {deleteOpen && (
        <DeletePopUp
          open={deleteOpen}
          data={selectedOutletNote}
          handleClose={handleCLoseDeleteOutletNote}
          handleDelete={handleDeleteOutletNote}
          message="Confirm To Delete OutletNote"
        />
      )}

      <div className="notice-board">
        <span className="notice-board-header">
          Notice Board <AddCircleIcon onClick={handleOpenOutletNote} />
        </span>

        <div className="notice-board-cardlist">
          {notice.map((singleNotice, index) => (
            <Card
              className={
                singleNotice.noteLevel === "HIGH"
                  ? "danger"
                  : singleNotice.noteLevel === "MEDIUM"
                  ? "liberal"
                  : "card"
              }
              key={index}
            >
              <span style={{ whiteSpace: "pre-wrap" }} className="card-text">
                {singleNotice.description}
              </span>
              <div className="card-btn">
                <EditIcon
                  onClick={() => handleOpenEditOutletNote(singleNotice)}
                />
                <DeleteIcon
                  onClick={() => handleOpenDeleteOutletData(singleNotice)}
                />
              </div>
            </Card>
          ))}
        </div>
        {notice.length > 0 && (
          <div className="pagination-div">
            <Pagination
              size="large"
              page={page}
              variant="outlined"
              shape="rounded"
              count={chunks.length}
              onChange={pageChange}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(NoticeBoard);
