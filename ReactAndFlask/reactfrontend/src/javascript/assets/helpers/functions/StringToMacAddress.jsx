/**
 * For MAC addresses, the system should accept a six-byte hexadecimal value
 * with any byte seperator punctuation (including colon, dash, underscore, and
 * no seperator at all). Upon accepting the value, it should be formatted into a
 * lower-case colon-delimited canonical form.
 *
 * @param {string} val
 */

export default function stringToMac(val) {
    // A  A  :  A  A  :  A  A  :  A  A  :  A  A  :  A  A
    // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16

    var returnVal = "";

    returnVal = val.replace(/[^0-9A-Fa-f]*/g, "").toLowerCase();

    if (returnVal.length > 12) {
        returnVal = returnVal.substring(0, 12);
    }

    if (returnVal.length === 1 || returnVal.length === 2) {
        return returnVal;
    }

    if (returnVal.length === 3 || returnVal.length === 4) {
        return returnVal.substring(0, 2) + ":" + returnVal.substring(2);
    }

    if (returnVal.length === 5 || returnVal.length === 6) {
        return returnVal.substring(0, 2) + ":" + returnVal.substring(2, 4) + ":" + returnVal.substring(4);
    }

    if (returnVal.length === 7 || returnVal.length === 8) {
        return returnVal.substring(0, 2)
        + ":" + returnVal.substring(2, 4)
        + ":" + returnVal.substring(4, 6)
        + ":" + returnVal.substring(6);
    }

    if (returnVal.length === 9 || returnVal.length === 10) {
        return returnVal.substring(0, 2)
        + ":" + returnVal.substring(2, 4)
        + ":" + returnVal.substring(4, 6)
        + ":" + returnVal.substring(6, 8)
        + ":" + returnVal.substring(8);
    }

    if (returnVal.length === 11 || returnVal.length === 12) {
        return returnVal.substring(0, 2)
        + ":" + returnVal.substring(2, 4)
        + ":" + returnVal.substring(4, 6)
        + ":" + returnVal.substring(6, 8)
        + ":" + returnVal.substring(8, 10)
        + ":" + returnVal.substring(10,12);
    }

    return returnVal;
}
