import React from 'react';

import axios from 'axios';

import {
    Button,
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Dialog,
    AppBar,
    Toolbar,
    Slide,
    IconButton,
} from "@material-ui/core/"
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
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

class DetailAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            networkNodes:null,
        };
    }

    render() {
        const { classes } = this.props;

        return (
        <span>
            <Dialog fullScreen open={this.props.open} onClose={this.props.close} TransitionComponent={Transition} padding={3}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.props.close} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Asset Details
                        </Typography>
                    </Toolbar>
                </AppBar>

                <ExpansionPanel>
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
                            close={this.closeCreate}
						    getAssetList={this.props.getAssetList}
                        />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="networks-header"
                    >
                        <Typography>Asset Network Management</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {this.props.hostname === "" || !this.state.networkNodes ?
                        <Typography>This asset is not currently connected to any other assets</Typography> :
                        <NetworkGraph
                            vals={this.state.networkNodes}
                            host={this.props.hostname}
                        />}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {/*<ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="power-header"
                    >
                        <Typography>Asset Power Management</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    </ExpansionPanelDetails>
                </ExpansionPanel>*/}
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                        >
                            Save edits
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                        >
                            Delete asset
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <Button
                            variant="contained"
                        >
                            Close without saving
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
        </span>
        );
    }
}


export default withStyles(useStyles)(DetailAsset);
