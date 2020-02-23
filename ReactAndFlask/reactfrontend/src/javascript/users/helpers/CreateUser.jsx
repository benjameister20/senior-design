import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import '../../../stylesheets/Models.css';

export default class CreateModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={6}>
                                <TextField id="standard-basic" variant="outlined" label="Username" name="username" onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="standard-basic" variant="outlined" label="Display Name" name="display_name" onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="standard-basic" variant="outlined" label="Password" name="password" type="password" onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="standard-basic" variant="outlined" label="Email" name="email" type="email" onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl
                                    style={{"minWidth": "200px"}}
                                    gutterbottom="true"
                                >
                                    <InputLabel id="privilege-select">Privilege</InputLabel>
                                    <Select
                                        id="privilege-select"
                                        onChange={this.props.updateModelCreator}>
                                        <MenuItem value="admin">Administrator</MenuItem>
                                        <MenuItem value="user">User</MenuItem>
                                    </Select>
                                </FormControl>
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
                                    onClick={this.props.createModel}
                                    style={{
                                        "width": "100%",
                                        "marginTop": "20px",
                                        "backgroundColor": "green",
                                        "color": "white"
                                    }}
                                >
                                    Create
                                </Button>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        );
    }
}
