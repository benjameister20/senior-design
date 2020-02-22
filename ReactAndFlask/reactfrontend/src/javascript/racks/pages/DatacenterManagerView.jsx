import React from 'react';

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';

import ErrorBoundary from "../../errors/ErrorBoundry";
import DatacenterView from "./DatacentersView";
import CreateDatacenter from "../helpers/CreateDatacenter";
import { Privilege } from '../../enums/privilegeTypes.ts';

const useStyles = theme => ({

  });

class DatacenterManagerView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <ErrorBoundary>
                    <Paper>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                {this.props.privilege === Privilege.ADMIN ? <CreateDatacenter /> : null }
                            </Grid>
                            <Grid item xs={12}>
                                <DatacenterView privilege={this.props.privilege} />
                            </Grid>
                        </Grid>
                    </Paper>
                </ErrorBoundary>
            </React.Fragment>
        );
}
  }


  export default withStyles(useStyles)(DatacenterManagerView);
