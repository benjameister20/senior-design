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
      test:"",
    };
  }

  sortByCol(event) {
    this.setState({test:event.target.id})
  }

  render() {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow >
                {this.props.columns.map(col => (<TableCell><span id={col} onClick={this.sortByCol.bind(this)}>{col}</span></TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.vals.map(row => (
              <TableRow>
                {row.map(val => (<TableCell scope="row">{val}</TableCell>))}
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
