import { ModelInput } from '../../enums/modelInputs.ts'

export default function jsonToArr(incomingJSON) {
    try {
        JSON.parse(incomingJSON);
        var json = incomingJSON;
    } catch (e) {
        var json = incomingJSON;
    }

    if (Object.entries(json).length === 0 && json.constructor === Object) {
        return [];
    }

    const items = [];

    Object.keys(json).map(function(key) {
        const row = [];
        row.push(key);
        row.push(json[key]);
        items.push(row);
    });
    return items;
}
