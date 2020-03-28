import React from 'react';

import {
    Grid,
    Typography,
 } from '@material-ui/core/';

import { Privilege } from '../../enums/privilegeTypes.ts'
import TableAsset from '../helpers/TableAssets';
import ErrorBoundary from '../../errors/ErrorBoundry';

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
                        <Grid item xs={12}>
                            <TableAsset
                                privilege={this.props.privilege}
                                username={this.props.username}
                            />
                        </Grid>
                    </Grid>
                </ErrorBoundary>
            </div>
        );
    }
}
