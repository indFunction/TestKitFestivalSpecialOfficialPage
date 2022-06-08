const messageElement = document.getElementById('introduction');

messageElement.getElementsByClassName('display')[0].insertAdjacentHTML(
    'afterbegin',
    '<canvas id="matrix"></canvas>'
);

const matrixElement = document.getElementById('matrix');
const matrixElementTexture = matrixElement.getContext('2d');

matrixElement.width = messageElement.clientWidth;
matrixElement.height = messageElement.clientHeight;

const useMatrixString = ('ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ').split('');
const fontSize = 12;

let drops = [];

function setMatrixWallpaper() {
    for (let x = 0; x < matrixElement.width / fontSize; x++) drops[x] = 1;
}

function drawMatrixWallpaper() {
    matrixElementTexture.fillStyle = '#0001';
    matrixElementTexture.fillRect(0, 0, matrixElement.width, matrixElement.height);
    matrixElementTexture.fillStyle = '#0F0';
    matrixElementTexture.font = fontSize + 'px arial';

    for (let i = 0; i < drops.length; i++) {
        const string = useMatrixString[Math.floor(Math.random() * useMatrixString.length)];

        matrixElementTexture.fillText(string, i * fontSize, drops[i] * fontSize);

        if (/* drops[i] * fontSize > matrixElement.height && */Math.random() > 0.975) drops[i] = 0;

        drops[i]++;
    }
}

setMatrixWallpaper();

setInterval(() => drawMatrixWallpaper(), 50);
