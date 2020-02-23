import React from "react";

import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

import RacksView from "../../pages/RacksView";

export default function ShowDatacenters(props) {
    try {
        if (props.datacentersList.length == 0) {
            return <Typography>There are currently no datacenters being managed.</Typography>
        } else {
            return (<div>{
                props.datacentersList.map(datacenter => (
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={datacenter.abbreviation}
                            id={datacenter.abbreviation}
                        >
                            <Typography className={props.classes.heading}>{datacenter.name + "/" + datacenter.abbreviation}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    <RacksView
                                        privilege={props.privilege}
                                        datacenter={datacenter.name}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(event) => {props.editDatacenter(event, datacenter.name, datacenter.abbreviation)} }
                                    >
                                        Edit Datecenter
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(event) => {props.openConfirmationBox(event, datacenter.name)} }
                                    >
                                        Delete Datecenter
                                    </Button>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))
            }</div>
            );
        }
    } catch (exception) {
        return <Typography>Could not load any datacenters at this time</Typography>
    }
}
