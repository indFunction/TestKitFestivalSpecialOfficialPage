const baseUrl = ''; // '/kitfes'
const isRoot = location.pathname == baseUrl + '/' || location.pathname == baseUrl + '/index.html' ? true : false;

const getJson = (filePath) => fetch(filePath).then((resp) => resp.json());
