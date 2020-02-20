export default function createAssetJSON(model, hostname, rack, rackU, owner, comment, datacenter_id, tags, network_connections, power_connections, asset_number) {
    return {
        "model":model,
        "hostname":hostname,
        "rack":rack,
        "rackU":rackU,
        "owner":owner,
        "comment":comment,
        "datacenter_id":datacenter_id,
        "tags":tags,
        "network_connections":network_connections,
        "power_connections":power_connections,
        'asset_number':asset_number,
    }
}
