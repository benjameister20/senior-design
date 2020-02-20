import React from 'react';

import Grid from '@material-ui/core/Grid';

import { Privilege } from '../../enums/privilegeTypes.ts'
import ImpExpAsset from '../helpers/ImpExpAsset';
import CreateAsset from '../helpers/CreateAsset';
import StatusDisplay from '../../helpers/StatusDisplay';
import TableAsset from '../helpers/TableAssets';
import ErrorBoundary from '../../errors/ErrorBoundry';
import "../stylesheets/AssetStyles.css";

export default class AssetsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statusSeverity:'',
            statusMessage:'',
            showStatus:false,
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                    <StatusDisplay
                        open={this.state.showStatus}
                        severity={this.state.statusSeverity}
                        closeStatus={this.closeShowStatus}
                        message={this.state.statusMessage}
                    />
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            {(this.props.privilege === Privilege.ADMIN) ? <CreateAsset search={this.search} />:null}
                        </Grid>
                        <Grid item xs={6}>
                            {(this.props.privilege === Privilege.ADMIN) ? <ImpExpAsset downloadTable={this.downloadTable} />:null}
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
