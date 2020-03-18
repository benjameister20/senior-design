import React from 'react';
import { connect } from "react-redux"

import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import FilterUser from '../helpers/FilterUser';
import CreateUser from '../helpers/CreateUser';
import UsersTable from '../helpers/UsersTable';
import StatusDisplay from '../../helpers/StatusDisplay';
import { Privilege } from '../../enums/privilegeTypes.ts'

class UsersView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div>
                <Grid
                    container
                    spacing={5}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{margin: "0px", maxWidth: "95vw"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h4">Users</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={6}>
                        {(this.props.privilege === Privilege.ADMIN) ?
                        (<div>
                            <CreateUser />
                        </div>) : null}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={6}>
                        {/*<FilterUser />
                    </Grid>
                    <Grid item xs={12}>
                        <UsersTable />*/}
                    </Grid>
                </Grid>
                <StatusDisplay />
            </div>
        );
    }
}

export default connect(null, {})(UsersView);
