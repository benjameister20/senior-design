import React from 'react';

import { fade, withStyles, SvgIcon, Collapse, Grid, Typography } from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import PropTypes from 'prop-types';

import "../stylesheets/RackStyles.css";

import ErrorBoundray from '../../errors/ErrorBoundry';
import { useSpring, animated } from 'react-spring/web.cjs';

function MinusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles(theme => ({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 12,
      paddingLeft: 12,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  }))(props => <TreeItem {...props} TransitionComponent={TransitionComponent} />);


const useStyles = theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
  });

class RacksView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            firstRack: 'A1',
            secondRack: 'A1',

            showStatus: false,
            statusMessage: '',
            statusSeverity: 'info',

            showConfirmationBox: false,

            racksList: [],
            racks: {}
        };
    }

    handleFormat = (event, newFormats) => {
        if (newFormats.length) {
            this.setState({formats: newFormats});
        }
    };

    closeShowStatus = () => {
        this.setState({ showStatus: false })
    }

    closeConfirmationBox = () => {
        this.setState({ showConfirmationBox: false });
    }

    sortRacks = (rack1, rack2) => {
      var num1 = parseInt(rack1.substr(1));
      var num2 = parseInt(rack2.substr(1));

      return num1 > num2;
    }

    deleteRack = (value) => {
      console.log(value);
    }

    render() {
        const { classes } = this.props;
        return (
            <ErrorBoundray>
                <Grid
                    container
                    spacing={5}
                    direction="row"
                    justify="center"
                    alignItems="center"f
                    style={{margin: "0px", maxWidth: "95vw"}}
                >

                    <Grid item xs={12}>
                        <Typography variant="h5">Racks</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TreeView
                            className={classes.root}
                            defaultExpanded={['1']}
                            defaultCollapseIcon={<MinusSquare />}
                            defaultExpandIcon={<PlusSquare />}
                        >
                            {Object.keys(this.props.racks).sort().map(key => {
                                return (<StyledTreeItem nodeId={key} label={key}>
                                        {this.props.racks[key].sort(this.sortRacks).map(value => {
                                            return (<StyledTreeItem nodeId={value} label={value} />);
                                        })}
                                    </StyledTreeItem>);
                            })}
                        </TreeView>
                    </Grid>
                </Grid>
            </ErrorBoundray>
        );
    }
}

export default withStyles(useStyles)(RacksView);
