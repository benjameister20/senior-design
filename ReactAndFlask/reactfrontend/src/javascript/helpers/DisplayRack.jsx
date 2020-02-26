import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

export default class DisplayRack extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className={classes.root}>
                {this.props.assets}
                <Grid container spacing={3}>
                    <Grid item xs={20}>
                        <Paper>{this.props.rack}</Paper>
                    </Grid>

                    <Grid item xs={3}>
                        <Paper>xs=12</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>xs=12</Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper>xs=12</Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
