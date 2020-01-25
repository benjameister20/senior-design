import React from 'react';
import TableView from '../helpers/TableView';

const columns = [
    "Username",
    "Display Name",
    "Email",
]

export default function UsersView(props) {
    return (TableView(columns));
}
