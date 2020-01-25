import React from 'react';
import TableView from '../helpers/TableView';

const columns = [
    "Model",
    "Hostname",
    "Rack",
    "Rack U",
    "Owner",
    "Comments",
]

export default function InstancesView(props) {
    return (TableView(columns));
}
