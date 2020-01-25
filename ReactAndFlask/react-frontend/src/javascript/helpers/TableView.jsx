import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfiniteScroll from 'react-infinite-scroller';
import AddItemToBackendModal from "./AddItemToBackendModal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Input from '@material-ui/core/Input';

const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 650,
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    submit: {
        margin: theme.spacing(3, 2, 2),
    },
    root: {
        width: '100%',
      },
      heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
      },
  }));

  function getModalStyle() {
    return {
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
    };
  }

export default function TableView(props) {
        const classes = useStyles();
        const [modalStyle] = React.useState(getModalStyle);
        const [open, setOpen] = React.useState(false);
        const [openNew, setOpenNew] = React.useState(false);
        const [openNew2, setOpenNew2] = React.useState(false);

        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
          setOpen(false);
        };
        const handleOpenNew = () => {
          setOpenNew(true);
        };
        const handleCloseNew = () => {
          setOpenNew(false);
        };

        const handleOpenNew2 = () => {
          setOpenNew2(true);
        };
        const handleCloseNew2 = () => {
          setOpenNew2(false);
        };

        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleOpenNew}
                >
                    Create
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleOpenNew2}
                >
                    Import
                </Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={open}
                    onClose={handleClose}
                >
                    <div style={modalStyle} className={classes.paper}>
                    <h2 id="simple-modal-title">Text in a modal</h2>
                    <p id="simple-modal-description">
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </p>
                    </div>
                </Modal>

            <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openNew}
            onClose={handleCloseNew}
            >
                <div style={modalStyle} className={classes.paper}>
                    {props.map(input => (
                        <TextField id="standard-basic" label={input} />
                    ))}
                    <Button
                        onClick={handleCloseNew2}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Create
                    </Button>
                    </div>
            </Modal>
            <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openNew2}
            onClose={handleCloseNew2}
            >
                <div style={modalStyle} className={classes.paper}>
                    <Input
                    type='file'>
                    </Input>
                    <Button
                        onClick={handleCloseNew2}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Upload
                    </Button>
                  </div>
            </Modal>

        <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Filters</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {props.map(col => (
                    <TableCell>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/*rows.map(row => (
                  <TableRow key={row.name}  onClick={handleOpen}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))*/}
              </TableBody>
            </Table>
          </TableContainer>
          {/*<InfiniteScroll
                pageStart={0}
                loadMore={loadItems(items)}
                hasMore={true}
                loader={<div className="loader" key={0}>Loading ...</div>}
            >
                {items}
          </InfiniteScroll>*/}
        </div>
        );
      }
