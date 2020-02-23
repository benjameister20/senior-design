import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { Privilege } from '../../enums/privilegeTypes';
import SaveIcon from '@material-ui/icons/Save';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default class UsersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        canEdit: false
    };
  }

  showDetailedView(index) {
    this.props.showDetailedView(index);
  }

  beginEditing = () => {
    this.setState({ canEdit: true });
  }

  endEditing = () => {
    this.setState({ canEdit: false });
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
              <TableRow id={index}>
                  { this.props.privilege === Privilege.ADMIN ? <TableCell scope="row" align="center">
                      <Button>
                        { this.state.canEdit ? <SaveIcon onClick={this.endEditing} /> : <EditIcon onClick={this.beginEditing} /> }
                      </Button>
                      <Button>
                        <DeleteIcon />
                      </Button>
                  </TableCell> : null }
                {this.props.keys.map(key => {
                    if (key === "Privilege") {
                    return (this.state.canEdit ? <TableCell scope="row" align="center">
                        <Select
                            id="privilege-select"
                            defaultValue={row[key]}
                        >
                            <MenuItem value="admin">Administrator</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                        </Select>
                    </TableCell> : <TableCell scope="row" align="center">{row[key] === 'admin' ? 'Administrator' : 'User'}</TableCell>);
                    }

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
