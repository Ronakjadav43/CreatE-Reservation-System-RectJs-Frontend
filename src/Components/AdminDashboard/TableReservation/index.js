import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Draggable from "react-draggable";
import { Card } from "@mui/material";

import "./style.scss";

const TableReservation = () => {
  const [deltaPosition, setDeltaPosition] = useState([
    { name: "table1", postion: { x: 770, y: 91 } },
    { name: "table2", postion: { x: 770, y: 91 } },
    { name: "table3", postion: { x: 770, y: 91 } },
  ]);
  const [imageSize, setImageSize] = useState({
    height: "1000px",
    width: "1000px",
  });
  const imgElement = React.useRef(null);

  const handleDrag = (event, ui) => {
    const tableName = event.target.id;
    if (tableName) {
      const commonData = [...deltaPosition];
      const findTable = commonData.find(
        (singleTable) => singleTable.name === tableName
      );
      if (findTable) {
        const { x, y } = findTable.postion;
        findTable.postion = {
          x: x + ui.deltaX,
          y: y + ui.deltaY,
        };
        setDeltaPosition([...commonData]);
      }
    }
  };

  useEffect(() => {
    if (imgElement) {
      setImageSize({
        height: imgElement.current.naturalHeight,
        width: imgElement.current.naturalWidth,
      });
    }
  }, [imgElement]);

  return (
    <div className="table-reservation">
      <span className="floor-plan-text">Floor Plan</span>
      <Box>
        <FormControl fullWidth>
          <InputLabel></InputLabel>
          <Select className="floor-selection" size="small">
            <MenuItem key={1}>Floor 1</MenuItem>
            <MenuItem key={2}>Floor 2</MenuItem>
            <MenuItem key={3}>Floor 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className="table-reservation-inner">
        <div
          className="floor-img"
          style={{ width: imageSize.width, height: imageSize.height }}
        >
          <img src="assets/images/Floor.png" ref={imgElement} alt="logo" />
          {deltaPosition.map((singleTable, index) => (
            <Draggable
              bounds="parent"
              onDrag={handleDrag}
              defaultPosition={singleTable.postion}
              key={index}
            >
              <Card className="tables1" id={singleTable.name}></Card>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableReservation;
