import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';

export default class ModelsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        popoverAnchor: null,
        networkPorts: ''
    };
  }

  showDetailedView(index) {
    this.props.showDetailedView(index);
  }

  clickInfo = (event, ports) => {
      this.setState({ popoverAnchor: event.target, networkPorts: ports });
  }

  handlePopoverClose = () => {
      this.setState({ popoverAnchor: null });
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
                  if (key === "Display Color") {
                    return (
                      <TableCell
                        scope="row"
                        align="center"
                        style={{
                          backgroundColor: row[key]
                        }}
                      >
                      </TableCell>
                    )
                  }

                  if (key === "Network Ports") {
                    return (
                      <TableCell
                        scope="row"
                        align="center"
                      >
                        {row[key] === null ? "" : row[key].length}
                        {row[key] == null ? null : <InfoIcon style={{"margin": "5px"}} onClick={(e) => {this.clickInfo(e, row[key].join(", "))}} />}
                      </TableCell>
                    )
                  }

                  return (<TableCell scope="row" align="center">{row[key]}</TableCell>)
                })}
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Popover
            id={Boolean(this.state.popoverAnchor) ? 'simple-popover': undefined}
            open={Boolean(this.state.popoverAnchor)}
            anchorEl={this.state.popoverAnchor}
            onClose={this.handlePopoverClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Typography
                style={{
                    padding: "20px"
                }}
            >
                Network Ports: {this.state.networkPorts}
            </Typography>
        </Popover>
      </div>
    );
  }
}
