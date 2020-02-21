import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class TableView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  showDetailedView(index) {
    this.props.showDetailedView(index);
  }

  render() {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table style={{minWidth: 1000}} aria-label="simple table">
            <TableHead>
              <TableRow >
                {this.props.columns.map(col => (<TableCell align="center"><span id={col} style={{fontWeight: "bold"}}>{col}</span></TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.vals.map((row, index)=> (
              <TableRow id={index} onClick={() => this.showDetailedView(index)}>
                {this.props.keys.map(key => {
                  return (<TableCell scope="row" align="center">{row[key]}</TableCell>)
                })}
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
