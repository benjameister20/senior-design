import React from 'react';
import { connect } from "react-redux"

import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import FilterUser from '../helpers/FilterUser';
import CreateUser from '../helpers/CreateUser';
import UsersTable from '../helpers/UsersTable';
import StatusDisplay from '../../helpers/StatusDisplay';
import { Privilege } from '../../enums/privilegeTypes.ts'

import { closeStatus } from "../../store/actions/users/userActions";

class UsersView extends React.Component {
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
                        {(this.props.privilege === Privilege.ADMIN) ? <CreateUser /> : null}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={6}>
                        {/*<FilterUser />
                    </Grid>
                    <Grid item xs={12}>
                        <UsersTable />*/}
                    </Grid>
                </Grid>
                <StatusDisplay
                    close={this.props.closeStatus}
                    open={this.props.statusOpen}
                    message={this.props.statusMessage}
                    severity={this.props.statusSeverity}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
	statusOpen: state.usersReducer.statusOpen,
    statusSeverity: state.usersReducer.statusSeverity,
    statusMessage: state.usersReducer.statusMessage,
})

export default connect(mapStateToProps, { closeStatus })(UsersView);
