import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';


const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(3),
        flexGrow: 1,
      },
  }));

export default class Filters extends React.Component {
    /*const classes = useStyles();*/
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                {this.props.filters.map(filter => (
                    <FormControl>
                    <InputLabel>{filter}</InputLabel>
                    <Select className={{ padding: 3, flexGrow: 1,}}>
                        <MenuItem value={10}>{filter} 1</MenuItem>
                        <MenuItem value={20}>{filter} 2</MenuItem>
                        <MenuItem value={30}>{filter} 3</MenuItem>
                    </Select>
            </FormControl>
                ))}</div>
        );
    }
}
