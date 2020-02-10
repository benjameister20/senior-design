import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { palette } from '@material-ui/system';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default class DetailModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmationBox:false,
        };

        this.closeModal = this.closeModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    confirmDelete() {
        this.setState({ showConfirmationBox: true });
    }

    closeModal() {
        this.setState({showConfirmationBox:false,});
    }

    deleteItem() {
        this.setState({ showConfirmationBox: false });
        this.props.delete();
    }

    render() {
        return (
        <div>
            {!this.props.showDetailedView ? null:
            <ExpansionPanel >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    {
                this.props.loading ? <CircularProgress /> :
                <div>
                    {this.props.inputs.map(input => (
                        <TextField name={input} disabled={this.props.disabled} id="standard-basic" label={input} onChange={this.props.updateModelEdited} defaultValue={this.props.defaultValues[input]}/>
                    ))}
                    {this.props.disabled ? null:
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.props.edit}
                            disabled={this.state.showConfirmationBox}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.confirmDelete}
                            disabled={this.state.showConfirmationBox}
                        >
                            Delete
                        </Button>
                    </div>}
                    {this.state.showConfirmationBox ? <div>
                        Are you sure you wish to delete?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.deleteItem}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.closeModal}
                        >
                            No
                        </Button>
                    </div>:null}
                </div>}
                    </ExpansionPanelDetails>
                </ExpansionPanel>}
        </div>
        );
    }
}
