import { ModelInput } from '../../enums/modelInputs.ts'

export default function jsonToArr(json) {
    var models = json.data['models'];
    const items = [];

    for (const [index, val] of models.entries()) {
        const row = [];
        row.push(val[ModelInput.Vendor]);
        row.push(val[ModelInput.ModelNumber]);
        items.push(row);
    }
    return items;
}
