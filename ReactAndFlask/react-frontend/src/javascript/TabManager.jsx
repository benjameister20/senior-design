import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ModelsView from './pages/ModelsView';
import UsersView from './pages/UsersView';
import InstancesView from './pages/InstancesView';
import RacksView from './pages/RacksView';
import StatisticsView from './pages/StatisticsView';
import Button from '@material-ui/core/Button';
import Logout from './helpers/Logout';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    flexGrow: 1,
  },
  button:{
    flexGrow: 1,
  }
}));

export default function TabManager() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab className={classes.tab} label="Models" {...a11yProps(0)} />
          <Tab className={classes.tab} label="Instances" {...a11yProps(1)} />
          <Tab className={classes.tab} label="Racks" {...a11yProps(2)} />
          <Tab className={classes.tab} label="Statistics" {...a11yProps(2)} />
          <Tab className={classes.tab} label="Users" {...a11yProps(2)}  />
          <Button
           className={classes.button}
           variant="contained"
           color="secondary"
           onClick={Logout()}
           >
              Logout
          </Button>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ModelsView />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InstancesView />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RacksView />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <StatisticsView />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <UsersView />
      </TabPanel>
    </div>
  );
}