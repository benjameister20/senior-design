import React from 'react';

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";
import { DatacenterCommand } from "../enums/DatacenterCommands.ts";
import RacksView from "./RacksView";
import ErrorBoundary from "../../errors/ErrorBoundry";

const useStyles = theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    progress: {
        display: 'flex',
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
        justify:"center",
        alignItems:"center",
      },
  });

function ShowDatacenters(props) {
    try {
        console.log(props);
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
                            <Typography className={props.classes.heading}>{datacenter.name}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <RacksView
                                privilege={props.privilege}
                                datacenter={datacenter.name}
                            />
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {this.showCreate()} }
                                >
                                    Edit Datecenter
                                </Button>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))
            }</div>
            );
        }
    } catch (exception) {
        console.log("Error occured in displaying the datacneters. Stack trace for error below...");
        console.log(exception);
        return <Typography>Could not load any datacenters at this time</Typography>
    }
}

class DatacenterView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            datacentersList:[],
            loadingDCList:true,
        };
    }

    getDatacenters = () => {
        axios.get(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.GET_ALL_DATACENTERS)).then(
            response => {
                this.setState({ datacentersList: response.data.datacenters, loadingDCList:false });
            }
        );
    }

    componentDidMount() {
        this.getDatacenters();
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <ErrorBoundary>
                    {this.state.loadingDCList ?
                    <div className={classes.progress}><CircularProgress /></div> :
                    <ShowDatacenters classes={classes} datacentersList={this.state.datacentersList} privilege={this.props.privilege} />}
                </ErrorBoundary>
            </React.Fragment>
        );
}
  }


  export default withStyles(useStyles)(DatacenterView);
