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

  showDetailedView(event) {
    this.props.showDetailedView(event.target.id);
  }

  render() {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow >
                {this.props.columns.map(col => (<TableCell><span id={col}>{col}</span></TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.vals.map((row, index)=> (
              <TableRow>
                {this.props.keys.map(key => (<TableCell scope="row"><span id={index} onClick={this.showDetailedView.bind(this)}>{row[key]}</span></TableCell>))}
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
