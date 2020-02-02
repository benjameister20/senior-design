import { ModelInput } from '../../enums/modelInputs.ts'

export default function jsonToArr(json) {
    const items = [];

    Object.keys(json).forEach(function(key) {
        const row = [];
        row.push(key);
        row.push(json[key]);
        items.push(row);
    });
    return items;
}
