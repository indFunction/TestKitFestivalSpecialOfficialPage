getJson(
    'https://script.google.com/macros/s/AKfycbynoFMcP14XJ3CWIrd2kIYjptTGpejwsktUe8modedNIPVufB_39p9N1_lRnj2N2Xo5/exec'
).then(setParkingData); // サンプルデータ：'../media/random/parkingTestData.json'

function setParkingData(parkingData) {
    const mapData = [
        '../media/map/parking_1-2.png',
        '../media/map/parking_2-1.png',
        '../media/map/parking_2-2.png',
        '../media/map/parking_2-3.png',
        '../media/map/parking_2-4.png',
        '../media/map/parking_3.png'
    ];

    const message = [
        '使用できません',
        '空いています',
        '混んでいます',
        '埋まっています'
    ];

    const color = [
        '#888',
        '#080',
        '#880',
        '#800'
    ];

    const updateElement = document.getElementById('parkingUpdate');
    const commentElement = document.getElementById('parkingComment');
    const informationElement = document.getElementById('parkingInformation');

    updateElement.innerHTML = `<b>更新日時：</b><code>${parkingData.update}</code>`;
    commentElement.innerHTML = `<b>お知らせ：</b>${parkingData.comment}`;
    informationElement.innerHTML = parkingData.information.map((item) => {
        return `
            <tr style="color: ${color[item.status]}">
                <th>${item.place}</th>
                <th>${message[item.status]}</th>
            </tr>
        `;
    }).join('\n');

    setParkingMap(parkingData, mapData, color);

    setTimeout(() => setParkingMap(parkingData, mapData, color), 1000);
}

async function setParkingMap(parkingData, mapData, color) {
    const mapElement = document.getElementById('parkingMap');

    const mapCanvas = document.createElement('canvas');
    const mapCanvasTexture = mapCanvas.getContext('2d');

    const mapImages = await loadImages(mapData);

    const imageWidth = mapImages[0].naturalWidth;
    const imageHeight = mapImages[0].naturalHeight;

    mapCanvas.width = imageWidth;
    mapCanvas.height = imageHeight;

    mapCanvasTexture.drawImage(mapImages[0], 0, 0, imageWidth, imageHeight);

    parkingData.information.map((item, index) => {
        const mapPart = setOverColor(mapImages[index + 1], color[item.status], imageWidth, imageHeight);

        mapCanvasTexture.drawImage(mapPart, 0, 0, imageWidth, imageHeight);
    });

    mapCanvasTexture.drawImage(mapImages[mapData.length - 1], 0, 0, imageWidth, imageHeight);

    const mapResultImage = mapCanvasTexture.canvas.toDataURL();

    mapElement.href = mapResultImage;
    mapElement.getElementsByClassName('picture')[0].src = mapResultImage;
}

function setOverColor(image, color, imageWidth, imageHeight) {
    const bufferCanvas = document.createElement('canvas');
    const bufferCanvasTexture = bufferCanvas.getContext('2d');

    bufferCanvas.width = imageWidth;
    bufferCanvas.height = imageHeight;

    bufferCanvasTexture.drawImage(image, 0, 0, imageWidth, imageHeight);
    bufferCanvasTexture.globalCompositeOperation = 'source-atop';
    bufferCanvasTexture.fillStyle = color;
    bufferCanvasTexture.fillRect(0, 0, imageWidth, imageHeight);

    const createImage = (context) => {
        const image = new Image;
        image.src = context.canvas.toDataURL();

        return image;
    };

    return createImage(bufferCanvasTexture);
}
