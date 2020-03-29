import React from 'react';

import axios from 'axios';

import {
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Dialog,
    AppBar,
    Toolbar,
    Slide,
    IconButton,
    Grid,
} from "@material-ui/core/"
import { Alert, AlertTitle } from "@material-ui/lab";
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';

import { Typography } from '@material-ui/core';
import NetworkGraph from "./NetworkGraph";
import EditAsset from "./EditAsset";

function createInputs(name, label, showTooltip, description) {
    return {label, name, showTooltip, description};
}

const useStyles = theme => ({
      appBar: {
        position: 'relative',
      },
      title: {
        marginLeft: theme.spacing(2),
        flex: 1,
      },
      button: {
          marginLeft:theme.spacing(3),
      }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

class DetailAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            networkNodes: null,
            detailsExpanded: true,
        };
    }

    closeDetailView = () => {
        this.props.close();
        this.props.fetchAllAssets();
    }

    toggleDetails = () => {
        this.setState({ detailsExpanded: !this.state.detailsExpanded });
    }

    render() {
        const { classes } = this.props;

        return (
        <span>
            <Dialog fullScreen open={this.props.open} TransitionComponent={Transition} padding={3}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.closeDetailView} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Asset Details
                        </Typography>
                    </Toolbar>
                </AppBar>

                {this.props.changePlanActive ?
					<Alert severity="info">
						<AlertTitle>Change Plan Mode</AlertTitle>
						You are currently in change plan mode! Changes made are being logged in the plan and not actually made in the system.
					</Alert> : null}

                <ExpansionPanel expanded={this.state.detailsExpanded} onChange={this.toggleDetails}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="fields-header"
                    >
                    <Typography>Asset General Details</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <EditAsset
                            defaultValues={this.props.asset}
                            disabled={this.props.disabled}
                            close={this.props.close}
                            getAssetList={this.props.getAssetList}
                            privilege={this.props.privilege}
                            changePlanActive={this.props.changePlanActive}
                            changePlanID={this.props.changePlanID}
                            changePlanStep={this.props.changePlanStep}
                            incrementChangePlanStep={this.props.incrementChangePlanStep}
                            username={this.props.username}
                            fetchAllAssets={this.props.fetchAllAssets}
                        />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {this.props.asset.hostname !== undefined && this.props.asset.hostname !== "" ?
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="networks-header"
                    >
                        <Typography>Asset Network Management</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                                <NetworkGraph
                                    vals={this.state.networkNodes}
                                    host={this.props.asset.hostname}
                                    assetNum={this.props.asset.asset_number}
                                />
                    </ExpansionPanelDetails>
                </ExpansionPanel>:null}
            </Dialog>
        </span>
        );
    }
}


export default withStyles(useStyles)(DetailAsset);
