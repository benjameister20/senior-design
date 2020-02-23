import React from 'react';

import {
    Grid,
    Typography,
 } from '@material-ui/core/';

import { Privilege } from '../../enums/privilegeTypes.ts'
import ExportAsset from '../helpers/ExportAsset';
import TableAsset from '../helpers/TableAssets';
import ErrorBoundary from '../../errors/ErrorBoundry';
import AddAsset from "../helpers/AddAsset";
import FilterAsset from "../helpers/FilterAsset";

export default class AssetsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statusSeverity:'',
            statusMessage:'',
            showStatus:false,
        };
    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                    <Grid
                        container
                        spacing={5}
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        style={{margin: "0px", maxWidth: "95vw"}}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                Assets
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            {(this.props.privilege == Privilege.ADMIN) ? <AddAsset /> : null}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <FilterAsset />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            {(this.props.privilege === Privilege.ADMIN) ? <ExportAsset downloadTable={this.downloadTable} />:null}
                        </Grid>
                        <Grid item xs={12}>
                            <TableAsset />
                        </Grid>
                    </Grid>
                </ErrorBoundary>
            </div>
        );
    }
}
