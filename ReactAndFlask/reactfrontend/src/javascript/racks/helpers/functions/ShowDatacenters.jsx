import React from "react";

import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Grid, Paper, TextField } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import RacksView from "../../pages/RacksView";

export default function ShowDatacenters(props) {
    const [rackType, setRackType] = React.useState('single');
    const [rack1, setRack1] = React.useState('A1');
    const [rack2, setRack2] = React.useState('A1');

    const handleRackType = (event, newType) => {
        setRackType(newType);
      };

      const updateRack = (event) => {
        setRack1(event.target.value);
        setRack2(event.target.value);
      }

      const updateStart = (event) => {
        setRack1(event.target.value);
      }

      const updateEnd = (event) => {
        setRack2(event.target.value);
      }

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
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <Paper elevation={3}>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="center"
                                        style={{"padding": "10px"}}
                                    >
                                        <Grid item xs={12}>
                                            <Typography variant="h6">
                                                Manage
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                style={{ width: "100%" }}
                                                onClick={(event) => {props.editDatacenter(event, datacenter.name, datacenter.abbreviation)} }
                                            >
                                                Edit
                                            </Button>
                                        </Grid>
                                        <Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
                                            <hr style={{width: "5vw"}} />
                                            <Typography color="textSecondary">
                                                Or
                                            </Typography>
                                            <hr style={{width: "5vw"}} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                style={{ width: "100%" }}
                                                onClick={(event) => {props.openConfirmationBox(event, datacenter.name)} }
                                            >
                                                Delete
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={3}>
                                <Paper elevation={3}>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="center"
                                        style={{"padding": "10px"}}
                                    >
                                        <Grid item xs={12}>
                                            <Typography variant="h6">
                                                Create Racks
                                            </Typography>
                                        </Grid>
                                        <Grid container item direction="row" justify="center" xs={12}>
                                            <ToggleButtonGroup
                                                value={rackType}
                                                exclusive
                                                onChange={handleRackType}
                                                aria-label="rack type"
                                            >
                                                <ToggleButton value="single" aria-label="single-rack">
                                                    Single
                                                </ToggleButton>
                                                <ToggleButton value="range" aria-label="range-rack">
                                                    Range
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>

                                        {rackType === "single" ? <Grid item xs={12}>
                                            <TextField id="standard-basic" variant="outlined" label="Rack" name="rack1" onChange={updateRack}/>
                                        </Grid> : <Grid container item spacing={3} direciton="row" justify="center"><Grid item xs={6}>
                                            <TextField id="standard-basic" variant="outlined" label="Start Rack" name="rack1" onChange={updateStart}/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField id="standard-basic" variant="outlined" label="End Rack" name="rack2" onChange={updateEnd}/>
                                        </Grid></Grid> }

                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", backgroundColor: "green", color: "white" }}
                                                onClick={(event) => {props.openConfirmationBox(event, datacenter.name)} }
                                            >
                                                Create
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    </Paper>
                                </Grid>


                                <Grid item xs={12}>
                                    <RacksView
                                        privilege={props.privilege}
                                        datacenter={datacenter.name}
                                    />
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
