export default function jsonToArr(incomingJSON) {
    var json = {};
    try {
        json = JSON.parse(incomingJSON);
    } catch (e) {
        json = incomingJSON;
    }

    if (Object.entries(json).length === 0 && json.constructor === Object) {
        return [];
    }

    const items = [];

    Object.keys(json).map((key) => {
        const row = [];
        row.push(key);
        row.push(json[key]);
        items.push(row);

        return key;
    });
    return items;
}
