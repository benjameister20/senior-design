import React from 'react';

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';

import ErrorBoundary from "../../errors/ErrorBoundry";
import DatacenterView from "./DatacentersView";
import { Privilege } from '../../enums/privilegeTypes';

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
                    <DatacenterView disabled={!(this.props.privilege.admin || this.props.privilege.asset)} />
                </ErrorBoundary>
            </React.Fragment>
        );
}
  }


  export default withStyles(useStyles)(DatacenterManagerView);
