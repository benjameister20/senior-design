import React from "react";
import Graph from "react-graph-vis";
import axios from "axios";

import { Typography } from '@material-ui/core';

import { AssetCommand } from "../enums/AssetCommands.ts";
import getURL from "../../helpers/functions/GetURL"
import * as Constants from "../../Constants";

// nodes: [
//     { id: 1, label: "Node 1", title: "node 1 tootip text" },
//     { id: 2, label: "Node 2", title: "node 2 tootip text" },
//     { id: 3, label: "Node 3", title: "node 3 tootip text" },
//     { id: 4, label: "Node 4", title: "node 4 tootip text" },
//     { id: 5, label: "Node 5", title: "node 5 tootip text" }
//   ],
//   edges: [
//     { from: 1, to: 2 },
//     { from: 1, to: 3 },
//     { from: 2, to: 4 },
//     { from: 2, to: 5 },
//     { from: 5, to: 2 }
//   ]
//
// vals: {
//      "host1": [ "host2", "host4" ],
//      "host3": ["host5", "host7", "host9", "host11"]
// }

function getGraph(primaryHosts, host) {
    if (host==="") {
        return {};
    }

    var hostnameMapping = {};
    const hostID = 0;

    var nodes = [];
    nodes.push({
        id:hostID,
        label:"" + host,
        color:"#F5F5DC"
    });

    hostnameMapping[host] = hostID;

    var edges = [];
    var primaryHostID = 1;

    try {
        console.log("nodes and edges");
        Object.entries(primaryHosts).map(([primaryHost, secondaryHosts]) => {
            if (hostnameMapping[primaryHost] !== undefined) {
                edges.push({ from: hostID, to:hostnameMapping[primaryHost] });
            } else {
                nodes.push({
                    id:primaryHostID,
                    label:"" + primaryHost,
                    color:"#F0FFFF"
                });
                edges.push({ from: hostID, to: primaryHostID });
                hostnameMapping[primaryHost] = primaryHostID;
            }
            console.log("nodes and edges");
            var secondaryHostID = primaryHostID + 1;
            secondaryHosts.map(secondaryHost => {
                if (hostnameMapping[secondaryHost] !== undefined) {
                    edges.push({ from: primaryHostID, to: hostnameMapping[secondaryHost]});
                } else {
                    nodes.push({
                        id:secondaryHostID,
                        label:"" + secondaryHost,
                        color:"#7FFFD4"
                    });
                    edges.push({ from: primaryHostID, to: secondaryHostID });
                    hostnameMapping[secondaryHost] = secondaryHostID;
                    secondaryHostID++;
                }

            });
            console.log("nodes and edges");
            primaryHostID = secondaryHostID + 1;
        });

        console.log("nodes and edges");
        console.log(nodes);
        console.log(edges);
        return { nodes:nodes, edges:edges };

    } catch (Exception) {
        console.log("in here")
        console.log(Exception);
        return { nodes:[], edges:[] }
    }
}

class NetworkGraph extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            graph:{
                nodes:[],
                edges:[],
            },
        };
    }

    componentDidMount() {
        axios.post(
            getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.GET_NETWORK_NEIGHBORHOOD), {
                "asset_number":this.props.assetNum,
            }).then(response => {
                this.setState({ graph:getGraph(response.data, this.props.host) });
        });
    }

    render() {
          const options = {
            layout: {
              hierarchical: false
            },
            edges: {
              color: "#000000"
            },
            height: "500px",
            interaction:{
                dragNodes:false,
                dragView: false,
            }
          };

          const events = {
            select: function(event) {
              var { nodes, edges } = event;
            }
          };

        return (
            <span>
                {this.state.graph.edges.length===0 ? <Typography>This asset is not currently connected to any other assets</Typography>:
                <Graph
                    graph={this.state.graph}
                    options={options}
                    events={events}
                    getNetwork={network => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                    }}
                />}
            </span>
        );
    }
}

const rootElement = document.getElementById("root");


export default NetworkGraph;
