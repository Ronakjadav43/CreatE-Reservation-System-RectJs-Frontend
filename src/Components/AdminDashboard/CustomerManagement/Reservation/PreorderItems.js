/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableBody,
  TableSortLabel,
  Box,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import "./style.scss";

const columns = [
  { field: "image", headerName: "Image", width: 233 },
  { field: "name", headerName: " Item Name", width: 233 },
  { field: "originalAmount", headerName: "Unit Price", width: 233 },
  { field: "price", headerName: "Deposit Price", width: 233 },
  { field: "qty", headerName: "Qty", width: 233 },
  { field: "total", headerName: "Deposit Total", width: 233 },
  { field: "originalTotalAmount", headerName: "Total", width: 233 },
];

const createData = (
  name,
  originalAmount,
  price,
  qty,
  total,
  originalTotalAmount,
  image
) => {
  return {
    name,
    originalAmount,
    price,
    qty,
    total,
    originalTotalAmount,
    image,
  };
};

export const PreorderItems = (props) => {
  const [order, setOrder] = useState("asc");
  const [basket, setBasket] = useState([]);
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (props.basket) {
      convertDiningData(props.basket);
    }
  }, [props.basket]);

  const convertDiningData = (preorders) => {
    const data = preorders.map((preorder) => {
      return createData(
        preorder.name,
        preorder.originalAmount,
        preorder.price,
        preorder.qty,
        preorder.total,
        preorder.originalTotalAmount,
        preorder.image
      );
    });
    setBasket(data);
    return data;
  };

  useEffect(() => {
    if (basket.length > 0) {
      if (page * rowsPerPage >= basket.length) {
        setPage(page - 1);
      }
    }
  }, [basket]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="w-100 p-10">
      <Typography sx={{ fontWeight: "bold" }}>Pre-Order Meal Items</Typography>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 377px)" }}>
          <Table
            stickyHeader
            aria-label="sticky table "
            sx={{ minWidth: 750 }}
            size={"medium"}
          >
            <TableHead>
              <TableRow>
                {columns.map((headCell) => (
                  <TableCell
                    key={headCell.field}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.field ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.field}
                      direction={orderBy === headCell.field ? order : "asc"}
                      onClick={createSortHandler(headCell.field)}
                    >
                      {headCell.headerName}
                      {orderBy === headCell.field ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(basket, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <img
                          className="product-image"
                          src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${row.image}`}
                          alt="pre Order"
                        />
                      </TableCell>
                      <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                      <TableCell>
                        {row.originalAmount ? row.originalAmount : "N/A"}
                      </TableCell>
                      <TableCell>
                        {row.price ? row.price : "N/A"}
                      </TableCell>
                      <TableCell>{row.qty ? row.qty : "N/A"}</TableCell>
                      <TableCell>{row.total ? row.total : "N/A"}</TableCell>
                      <TableCell>
                        {row.originalTotalAmount
                          ? row.originalTotalAmount
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          component="div"
          count={basket.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
