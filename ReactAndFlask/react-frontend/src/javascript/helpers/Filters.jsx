import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

export default class Filters extends React.Component {
    /*const classes = useStyles();*/
    constructor(props) {
        super(props);

        this.state = {
            searchText:"",
        };
    }

    searchItems() {
        this.props.onClick(this.state.searchText);
    }

    updateSearchText(event) {
        this.setState({ searchText: event.target.value})
    }

    render() {
        return (
            <div>
                <div>
                    <SearchIcon />
                </div>
                    <InputBase
                        placeholder="Search (blank does a search all)"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateSearchText.bind(this)}
                    />
                    <Button
                        onClick={this.searchItems.bind(this)}
                    >
                        Search
                    </Button>
            </div>
        );
    }
}
