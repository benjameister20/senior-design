import React from 'react';
import TableView from '../helpers/TableView';

const columns = [
    "Vendor",
    "Model Number",
    "Height (U)",
    "Display Color",
    "Ethernet Ports",
    "Power Ports",
    "CPU",
    "Memory",
    "Storage",
    "Comments",
]

export default function ModelsView(props) {
    return (TableView(columns));
}
