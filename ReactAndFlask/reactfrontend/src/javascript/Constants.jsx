/**
 * Constants file
 */

export const localServerEndpoint = 'http://localhost:4010/';
export const testServerEndpoint = ' https://parseltongue-finishinge-lfw68m.herokuapp.com/';
export const devServerEndpoint = 'https://parseltongue-dev.herokuapp.com/';
export const prodServerEndpoint = 'https://parseltongue-prod.herokuapp.com/';

export const serverEndpoint = localServerEndpoint;


export const RackX = [
    'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T',
    'W', 'X', 'Y', 'Z',
]

export const ASSETS_MAIN_PATH = 'instances/';
export const MODELS_MAIN_PATH = "models/";
export const USERS_MAIN_PATH = "users/";
export const RACKS_MAIN_PATH = "racks/";

export const CLIENT_ID = "ParselTonguesUserAuth";
export const CLIENT_SECRET = "LpUwB*eiK4Iw#1gaCu5jYp1u5uRF3ERsdmuNUGoKYNzn7rHm7b";
export const SCOPE = "basic";

export const SHIBBOLETH_LOGIN =
    "https://oauth.oit.duke.edu/oauth/authorize.php?"
     + "client_id=" + encodeURIComponent(CLIENT_ID)
     + "&client_secret=" + encodeURIComponent(CLIENT_SECRET)
     + "&redirect_uri=" + encodeURIComponent('http://localhost:3000/')
     + "&response_type=token"
     + "&state=1129"
     + "&scope=" + encodeURIComponent(SCOPE);
