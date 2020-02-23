import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

export default class ExportModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                <Paper elevation={3}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{"padding": "10px"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6">Export</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Download what is currently shown in the table.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={this.props.downloadTable}
                            variant="contained"
                            color="primary"
                            startIcon={<CloudDownloadIcon />}
                            style={{
                                width: "100%"
                            }}
                        >
                            Export
                        </Button>
                    </Grid>
                    <Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
                        <hr style={{width: "5vw"}} />
                        <Typography color="textSecondary">
                            Or
                        </Typography>
                        <hr style={{width: "5vw"}} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={this.props.showAll}
                            variant="contained"
                            color="default"
                            style={{
                                width: "100%"
                            }}
                        >
                            Show all models
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            </div>
        );
    }
}
