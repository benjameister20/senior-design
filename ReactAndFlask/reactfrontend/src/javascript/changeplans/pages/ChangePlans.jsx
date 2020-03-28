import React from 'react';
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import getURL from '../../helpers/functions/GetURL';
import * as Constants from "../../Constants";
import StatusDisplay from '../../helpers/StatusDisplay';
import ErrorBoundray from '../../errors/ErrorBoundry';
import { Select, MenuItem, InputLabel, Grid, Paper, Typography, Button } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

const changePlanMainPath = 'changeplan/';


export default class ChangePlansView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showStatus:false,
            statusMessage:'',
            statusSeverity:'',
        };

        //axios.defaults.headers.common['token'] = this.props.token;
        //axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    componentDidMount() {

    }

    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    render() {
        return (
            <div>
                <ErrorBoundray >
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                <Grid
                    container
                    spacing={5}
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{margin: "0px", maxWidth: "95vw"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Change Plans
                        </Typography>
                    </Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={2}>
                        <Typography>
                            Saved changed plans
                        </Typography>
                    </Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Change Plan #1</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            10 assets edited
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
                </ErrorBoundray>
            </div>
        );
    }
}
