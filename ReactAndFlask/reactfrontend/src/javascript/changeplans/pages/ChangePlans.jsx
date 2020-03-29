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
import { AssetCommand } from '../../assets/enums/AssetCommands.ts';
import EditIcon from '@material-ui/icons/Edit';

const changePlanPath = "changeplans/";

export default class ChangePlansView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showStatus:false,
            statusMessage:'',
            statusSeverity:'',

            changePlans: [],
            changePlanDetails: {},
        };

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    componentDidMount() {
        this.fetchAllChangePlans();
    }

    fetchAllChangePlans() {
        axios.post(
            getURL(changePlanPath, AssetCommand.CHANGE_PLAN_GET_PLANS),
            {
                'owner': this.props.username,
            }
            ).then(response => {
                var change_plans = response.data.change_plans;
                if (change_plans !== null) {
                    this.setState({ changePlans: change_plans });

                    change_plans.forEach(plan => {
                        axios.post(
                            getURL(changePlanPath, AssetCommand.CHANGE_PLAN_GET_ACTIONS),
                            {
                                'change_plan_id': plan.identifier,
                                'owner': this.props.username,
                            }
                            ).then(response => {
                                var details = this.state.changePlanDetails;
                                details[plan.identifier] = response.data.change_plan_actions;
                                console.log(details[plan.identifier].length);
                                this.setState({ changePlanDetails: details });
                            });
                    });
                }
        });
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
                        { this.state.changePlans.map(plan => {
                            return (<ExpansionPanel key={plan.identifier}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>{plan.name}<EditIcon /></Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                <Grid
                                    container
                                    spacing={3}
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                    style={{margin: "0px", maxWidth: "95vw"}}
                                >
                                    <Grid item xs={3}>
                                        <Button
                                        variant="contained"
                                        color="primary"
                                        style={{width: "100%"}}
                                        startIcon={<EditIcon />}
                                    >
                                        Rename
                                    </Button>
                                    </Grid>
                                    <Grid item xs={9}></Grid>
                                <Grid item xs={12}>
                                { this.state.changePlanDetails[plan.identifier] !== undefined ?
                                    this.state.changePlanDetails[plan.identifier].map(detail => {
                                        var diff = detail.diff;
                                        return (<TableContainer component={Paper}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow >
                                                                <TableCell>Field</TableCell>
                                                                <TableCell>Old</TableCell>
                                                                <TableCell>New</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                        {Object.keys(diff).map(key => (
                                                            <TableRow>
                                                                <TableCell>{key}</TableCell>
                                                                <TableCell>{diff[key][0]}</TableCell>
                                                                <TableCell>{diff[key][1]}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>);
                                    })
                                    : "This change plan has made no changes!" }
                                </Grid>
                                </Grid>

                                </ExpansionPanelDetails>
                            </ExpansionPanel>);
                        })
                        }
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
                </ErrorBoundray>
            </div>
        );
    }
}
