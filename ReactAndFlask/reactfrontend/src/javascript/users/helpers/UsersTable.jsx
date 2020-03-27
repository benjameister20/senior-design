import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { Privilege } from '../../enums/privilegeTypes';
import SaveIcon from '@material-ui/icons/Save';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';

import PrivilegePicker from "./functions/PrivilegePicker";

const useStyles = theme => ({
	root: {
		flexGrow: 1,
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: "100%",
		margin: "0 auto",
		overflow: "scroll"
	},
	grid: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: "50%"
	},
	progress: {
		display: 'flex',
		'& > * + *': {
			marginLeft: theme.spacing(2),
		},
	},
});

class UsersTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			canEdit: false,
			showDeleteModal: false,
			username: '',

			originalUsername:"",
			username: "",
			display_name: "",
			password: "",
			email: "",
			selectedPrivileges:{
				"Model":false,
				"Asset":false,
				"Datacenters":[],
				"Power":false,
				"Audit":false,
				"Admin":false,
			},
			password:"",
		};
	}

	showDetailedView(index) {
		this.props.showDetailedView(index);
	}

	beginEditing = (event, row) => {
		this.setState({ canEdit: true });
		console.log(row);
		this.setState({
			originalUsername:row.Username,
			username:row.Username,
			display_name:row["Display Name"],
			email:row.Email,
			selectedPrivileges:row.Privilege,
			password:row.password,
		});
	}

	endEditing = () => {
		this.setState({ canEdit: false });
		this.props.save(
			this.state.originalUsername,
			this.state.username,
			this.state.password,
			this.state.display_name,
			this.state.email,
			this.state.selectedPrivileges
		);
	}

	showDeleteModal = (row) => {
		this.setState({ showDeleteModal: true, username: row["Username"] });
	}

	closeDeleteModal = () => {
		this.setState({ showDeleteModal: false, username: "" });
	}

	delete = () => {
		this.props.delete(this.state.username);
		this.closeDeleteModal();
	}

	updateSelectedPrivileges = (event, values) => {
        var privs = {
            "Model":false,
            "Asset":false,
            "Datacenters":this.state.selectedPrivileges["Datacenters"],
            "Power":false,
            "Audit":false,
            "Admin":false,
        };
        values.map(priv => { privs[priv.value] = true; });
        this.setState({ selectedPrivileges: privs });
    }

    updateDCPrivilege = (event, values) => {
        var privs = this.state.selectedPrivileges;
        privs["Datacenters"] = values;
        this.setState({ selectedPrivileges: privs });
    }

	render() {
		const { classes } = this.props;

		return (
			<div>
				<TableContainer component={Paper}>
					<Table style={{ minWidth: 1000 }} aria-label="simple table">
						<TableHead>
							<TableRow >
								{this.props.columns.map(col => {
									if (col === "Privilege") {
										return (this.state.canEdit ? <TableCell align="center"><span id={col} style={{ fontWeight: "bold" }}>{col}</span></TableCell>:null)
									} else {
										return <TableCell align="center"><span id={col} style={{ fontWeight: "bold" }}>{col}</span></TableCell>
									}
									})
								}
							</TableRow>
						</TableHead>
						<TableBody>
							{this.props.vals.map((row, index) => (
								<TableRow id={index}>
									{this.props.privilege.Admin ? <TableCell scope="row" align="center">
										{row["Username"] !== "admin" ? <div><Button>
											{this.state.canEdit ? <SaveIcon onClick={this.endEditing} /> : <EditIcon onClick={(e) => { this.beginEditing(e, row) }} />}
										</Button>
											<Button>
												<DeleteIcon onClick={() => this.showDeleteModal(row)} />
											</Button></div> : null}
									</TableCell> : null}
									{this.props.keys.map(key => {
										if (key === "Privilege") {
											return (this.state.canEdit && row["Username"] !== "admin" ? <TableCell scope="row" align="center">
												<PrivilegePicker
													dcPrivileges={this.props.privileges}
													loading={this.props.loading}
													updatePrivilege={this.updateSelectedPrivileges}
													updateDCPrivilege={this.updateDCPrivilege}
													defaultPrivileges={row.Privilege}
												/>
											</TableCell> : null);
										}

										return (<TableCell scope="row" align="center">{row[key]}</TableCell>)
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className={classes.modal}
					open={this.state.showDeleteModal}
					onClose={this.closeDeleteModal}
					closeAfterTransition
				>
					<Fade in={this.state.showDeleteModal}>
						<Backdrop
							open={this.state.showDeleteModal}
						>
							<div className={classes.grid}>
								<Grid
									container
									spacing={1}
									direction="row"
									justify="flex-start"
									alignItems="center"
								>
									<Grid item xs={12}>
										<Typography variant="h5">Are you sure?</Typography>
									</Grid>
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<Typography variant="body1">
											Doing this will remove the user permanently.
                                </Typography>
									</Grid>

									<Grid item xs={3}>
										<Button
											variant="contained"
											color="secondary"
											onClick={this.delete}
											style={{ width: "100%" }}
										>
											Yes
                                </Button>
									</Grid>
									<Grid item xs={3}>
										<Button
											variant="contained"
											color="primary"
											onClick={this.closeDeleteModal}
											style={{ width: "100%" }}
										>
											No
                                </Button>
									</Grid>
								</Grid>
							</div>
						</Backdrop>

					</Fade>
				</Modal>

			</div>
		);
	}
}

export default withStyles(useStyles)(UsersTable);
