import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import '../../../stylesheets/Models.css';
import StatusDisplay from '../../helpers/StatusDisplay';

export default class CreateAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
        <div>
            <ExpansionPanel class="create-expansion-tab">
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails class="create-expansion-tab">
                        <StatusDisplay
                            open={this.props.statusOpen}
                            severity={this.props.statusSeverity}
                            closeStatus={this.props.statusClose}
                            message={this.props.statusMessage}
                        />
                    <div>
                    {this.props.inputs.map((input, index) => (
                        (index===0 && this.props.useAutocomplete) ? <Autocomplete
                            id="combo-box-demo"
                            options={this.props.options}
                            includeInputInList
                            freeSolo
                            renderInput={params => (
                            <TextField {...params} label={input} name={input} onChange={this.props.updateModelCreator} onBlur={this.props.updateModelCreator} variant="outlined" fullWidth />
                            )}
                        /> :
                        <TextField id="standard-basic" variant="outlined" label={input} name={input} onChange={this.props.updateModelCreator}/>
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.createModel}
                    >
                        Create
                    </Button>
                </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        </div>
        );
    }
}
