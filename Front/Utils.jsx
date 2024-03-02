import * as FileSystem from 'expo-file-system';

const JWT_CACHE_FILE = FileSystem.cacheDirectory+"auth.txt";

/**
 * Get the JWT token in cache
 * @param {*} onTokenReceived callback, first parameter is the got token, if no token then returns null as parameter value
 */
function getJwtToken(onTokenReceived) {
    FileSystem.readAsStringAsync(JWT_CACHE_FILE, {encoding: 'utf8'}).then((val) => {
        onTokenReceived(val)
    }).catch((err) => {
        onTokenReceived(null)
    })
}

export {
    JWT_CACHE_FILE,
    getJwtToken
}