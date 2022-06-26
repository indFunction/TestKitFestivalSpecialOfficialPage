const baseUrl = ''; // '/kitfes'
const isRoot = location.pathname == baseUrl + '/' || location.pathname == baseUrl + '/index.html' ? true : false;

const getJson = (filePath) => fetch(filePath).then((resp) => resp.json());

function loadImages(filePaths) {
    async function load(src) {
        const img = new Image();
        img.src = src;
        await img.decode();

        return img;
    }

    return Promise.all(filePaths.map((src) => load(src)));
}
