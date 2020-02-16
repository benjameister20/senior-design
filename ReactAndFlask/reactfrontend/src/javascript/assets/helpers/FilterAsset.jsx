import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

export default class FilterAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filters:{},
        };
    }

    updateSearchText(event) {
        if (this.state.filters.hasOwnProperty(event.target.id)) {
            this.state.filters[event.target.id] = event.target.value;
            this.forceUpdate();
        } else {
            var value = (event.target.value == null) ? '' : event.target.value;
            this.state.filters[event.target.id] = event.target.value;
            this.forceUpdate();
        }
        this.search();
    }

    search = () => {
        this.props.search(this.state.filters);
    }

    render() {
        return (
            <div>
                {this.props.filters.map((filter, index) => (
                    <div>
                        <SearchIcon />
                        <InputBase
                            placeholder={filter+" filter"}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={this.updateSearchText.bind(this)}
                            id={filter}
                        />
                    </div>
                ))
                }
                Click the search button to populate table. Searching with empty filters searches over all values. Click on row values to see detailed view.
            </div>
        );
    }
}
