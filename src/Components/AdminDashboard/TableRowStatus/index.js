import React from "react";

const TableRowStatus = (props) => {
  return (
    <div>
      {props.data && (
        <table style={{display:"flex", flexDirection:"column"}}>
          <span>
            <span>Record Name&nbsp;:&nbsp;</span>
            <span>{props.data.name}</span>
          </span>
          {props.data.contentChange &&
            props.data.contentChange.map((content) => (
              <span>
                <span>
                  <strong>{content.filedName}&nbsp;:&nbsp;</strong>
                </span>
                <span>{content.oldValue}&nbsp;</span> 
                <span>
                  <strong>{content.newValue} </strong>
                </span>
              </span>
            ))}
        </table>
      )}
    </div>
  );
};

export default TableRowStatus;
