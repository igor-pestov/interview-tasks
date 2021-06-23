import data from "../../data.json";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import "./Tabel.scss";
import axios from "axios";
const columns = [
  { id: "id", label: "Id", minWidth: 170 },
  { id: "number", label: "Number", minWidth: 100 },
  {
    id: "firstName",
    label: "First Name",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "lastName",
    label: "Last Name",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];
function createData(id, number, firstName, lastName) {
  return { id, number, firstName, lastName };
}

let rowsData = data.map((el) => {
  return createData(el.id, el.number || 0, el.firstName, el.lastName);
});

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 740,
  },
  rowTable: {
    textAlign: "center",
  },
});
async function getApi() {
  const data = await axios.get(
    `http://ws-old.parlament.ch/councillors?format=json`
  );
  console.log(data);
} 
getApi();
function Councillors() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sort, setSort] = useState({ up: true, name: "" });
  const [rows, setRows] = useState(rowsData);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSort = (name) => {
    setSort({ up: !sort.up, name });
    console.log(sort);
    let newData = [];
    if (sort.up && sort.name !== name) {
      newData = data.sort((a, b) => {
        if (a[`${name}`] < b[`${name}`]) {
          return 1;
        }
        if (a[`${name}`] > b[`${name}`]) {
          return -1;
        }
        return 0;
      });
      setRows(
        newData.map((el) => {
          return createData(el.id, el.number || 0, el.firstName, el.lastName);
        })
      );
    } else {
      newData = data.sort((a, b) => {
        if (a[`${name}`] > b[`${name}`]) {
          return 1;
        }
        if (a[`${name}`] < b[`${name}`]) {
          return -1;
        }
        return 0;
      });
      setRows(
        newData.map((el) => {
          return createData(el.id, el.number || 0, el.firstName, el.lastName);
        })
      );
    }
  };

  return (
    <div className="Tabel">
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    className={classes.rowTable}
                    style={{ minWidth: column.minWidth }}
                    onClick={() => {
                      handleSort(column.id);
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className={classes.rowTable}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Councillors;
