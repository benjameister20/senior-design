import React from 'react';

import { connect } from "react-redux"
import PropTypes from "prop-types";
import {
    Button,
    Grid,
    TextField,
    Typography,
    Card
} from '@material-ui/core';

import PrivilegePicker from "./functions/PrivilegePicker";
import { updateSearchText, searchUsers } from "../../store/actions/users/userActions";

class Filters extends React.Component {
    render() {
        return (
            <Card elevation={3} padding={3}>
                <Typography variant="h6">Search</Typography>
                <Grid
                    container
                    spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Grid item xs={6}>
                        <TextField
                            id={"username"}
                            inputProps={{ 'aria-label': 'search' }}
                            variant="outlined"
                            label="Username"
                            placeholder={"Username"}
                            name="username"
                            onChange={(event) => this.props.updateSearchText(event)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="display_name" variant="outlined" label="Display Name" name="display_name" onChange={(event) => this.props.updateSearchText(event)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="email"
                            variant="outlined"
                            label="Email"
                            name="email"
                            onChange={(event) => this.props.updateSearchText(event)}
                            style={{"width": "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PrivilegePicker
                            dcPrivileges={this.props.privileges}
                            loading={this.props.loading}
                            updatePrivilege={this.updateSelectedPrivileges}
                        />
                    </Grid>
                    <Grid
                        container
                        item
                        direction="column"
                        justify="center"
                        alignItems="center"
                        xs={12}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.props.searchUsers(this.props.filters)}
                            style={{"width": "100%", "marginTop": "20px"}}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        );
    }
}

Filters.propTypes = {
    searchUsers: PropTypes.func.isRequired,
    updateSearchText: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	filters: state.usersReducer.filters,
})

export default connect(mapStateToProps, { updateSearchText, searchUsers })(Filters);
