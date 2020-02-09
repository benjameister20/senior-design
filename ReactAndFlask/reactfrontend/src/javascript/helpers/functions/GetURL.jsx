import * as Constants from '../../Constants';

export default function getURL(path, endpoint) {
    return Constants.serverEndpoint + path + endpoint;
}
