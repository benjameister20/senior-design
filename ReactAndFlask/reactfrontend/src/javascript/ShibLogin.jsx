import React from 'react';
import Grid from '@material-ui/core/Grid';
import StatusDisplay from './helpers/StatusDisplay';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import logo from '../images/logo.png';



export default class ShibLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username:'',
            password:'',
            statusMessage:'',
            showStatus:false,
            statusSeverity:'info',
        };
    }

    render() {
        return (
            <Grid
                container
                spacing={5}
                direction="column"
                justify="flex-start"
                alignItems="center"
                onKeyDown={(e) => this.onKeyPressed(e)}
                style={{
                    "minHeight": "102vh",
                    "background": "#56ab2f",
                    "background": "-webkit-linear-gradient(to top, #a8e063, #56ab2f)",
                    "background": "linear-gradient(to top, #a8e063, #56ab2f)",
                }}
            >
                <Grid item xs={12}>
                    <img src={logo} style={{height: "200px", "marginTop": "50px"}} />
                </Grid>
                <Grid item xs={12}>
                    <Card
                        style={
                            {
                                minWidth: '20vw',
                            }
                        }
                    >
                        <CardContent>
                            <Grid
                                container
                                spacing={1}
                                direction="column"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid container item alignItems="flex-start" xs={12}>
                                    <Typography
                                        variant="h6"
                                        color="textPrimary"
                                        fontWeight="fontWeightBold"
                                        gutterBottom
                                    >
                                        Please wait while we log you in...
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <StatusDisplay
                        open={this.state.showStatus}
                        severity={this.state.statusSeverity}
                        closeStatus={this.closeShowStatus}
                        message={this.state.statusMessage}
                    />
                </Grid>
            </Grid>

        );
    }
}
