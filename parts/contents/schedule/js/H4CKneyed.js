const scheduleElement = document.getElementById('H4CKneyed');
const headElements = scheduleElement.getElementsByClassName('head');
const contentElements = scheduleElement.getElementsByClassName('content');

const blockLengthPerHour = 360;

const timeLength = [
    [
        {
            start: [16, 0],
            end: [19, 0]
        },
        {
            start: [16, 0],
            end: [19, 0]
        },
        {
            start: [0, 0],
            end: [0, 0]
        }
    ],
    [
        {
            start: [10, 0],
            end: [19, 0]
        },
        {
            start: [10, 0],
            end: [19, 0]
        },
        {
            start: [10, 0],
            end: [18, 0]
        }
    ],
    [
        {
            start: [10, 0],
            end: [19, 0]
        },
        {
            start: [10, 0],
            end: [19, 0]
        },
        {
            start: [10, 0],
            end: [18, 0]
        }
    ]
];

let timeBuffer = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

function setTimeBuffer() {
    for (let i = 0; i < timeBuffer.length; i++) {
        for (let j = 0; j < timeBuffer.length; j++) {
            timeBuffer[i][j] = convTimeToValue(timeLength[i][j].start);
        }
    }
}

setTimeBuffer();

function convTimeToValue(array) {
    return array[0] * 60 + array[1];
}

function convValueToTime(val) {
    const timeHours = Math.floor(val / 60);
    const timeMinutes = val - timeHours * 60;

    return [timeHours, timeMinutes];
}

function checkTime(start, end, y, x) {
    const timeLengthPoint = convTimeToValue(timeLength[y][x].end);
    const timeBufferPoint = timeBuffer[y][x];

    return !(start < timeBufferPoint || end > timeLengthPoint);
}

getJson('../../../data/schedule/schedule-day0-special.json').then((data) => setBlocks(data, 0, 0));
getJson('../../../data/schedule/schedule-day0-casual.json').then((data) => setBlocks(data, 0, 1));
getJson('../../../data/schedule/schedule-day0-hall.json').then((data) => setBlocks(data, 0, 2));
getJson('../../../data/schedule/schedule-day1-special.json').then((data) => setBlocks(data, 1, 0));
getJson('../../../data/schedule/schedule-day1-casual.json').then((data) => setBlocks(data, 1, 1));
getJson('../../../data/schedule/schedule-day1-hall.json').then((data) => setBlocks(data, 1, 2));
getJson('../../../data/schedule/schedule-day2-special.json').then((data) => setBlocks(data, 2, 0));
getJson('../../../data/schedule/schedule-day2-casual.json').then((data) => setBlocks(data, 2, 1));
getJson('../../../data/schedule/schedule-day2-hall.json').then((data) => setBlocks(data, 2, 2));

function setBlocks(blockData, section, location) {
    const setDateNumber = (val) => String(val).padStart(2, '0');

    blockData.map((item) => {
        item.section = section;
        item.location = location;

        const timeStart = convTimeToValue(item.start);
        const timeEnd = convTimeToValue(item.end);

        if (!checkTime(timeStart, timeEnd, section, location)) {
            console.log(':(');

            return;
        }

        item.date = `${setDateNumber(item.start[0])}:${setDateNumber(item.start[1])} - ${setDateNumber(item.end[0])}:${setDateNumber(item.end[1])}`;

        if (timeStart > timeBuffer[section][location]) {
            setBlank(contentElements, item, (timeStart - timeBuffer[section][location]) / 60);

            timeBuffer[section][location] = timeStart;
        }

        setBlock(contentElements, item, (timeEnd - timeStart) / 60);

        timeBuffer[section][location] += timeEnd - timeStart;
    });
}

function setBlock(elements, item, height) {
    elements[item.section].getElementsByClassName('blocks')[item.location].insertAdjacentHTML(
        'beforeend',
        `
            <div class="item block" style="height: ${height * blockLengthPerHour}px" originalHeight="${height * blockLengthPerHour}">
                <div>
                    <div class="title">${item.title}</div>
                    <div class="data">
                        <div class="id">${item.id}</div>
                        <div class="date">${item.date}</div>
                    </div>
                    <div class="organizer">${item.organizer}</div>
                    <div class="description">
                    ${item.image ? `
                        <div class="image">
                            <img src="${item.image}" alt="${item.id}" />
                            <a href="${item.image}"></a>
                        </div>` : ''}
                        <div class="text">${item.description}</div>
                    </div>
                </div>
            </div>
        `
    );
}

function setBlank(elements, item, height) {
    elements[item.section].getElementsByClassName('blocks')[item.location].insertAdjacentHTML(
        'beforeend',
        `
            <div class="item blank" style="height: ${height * blockLengthPerHour}px" originalHeight="${height * blockLengthPerHour}"></div>
        `
    );
}

function toggleDescription(section) {
    const itemElements = contentElements[section].getElementsByClassName('item');
    const isHide = !contentElements[section].classList.contains('isHide');

    if (isHide) {
        contentElements[section].classList.add('isHide');
        headElements[section].classList.add('isHide');
    } else {
        contentElements[section].classList.remove('isHide');
        headElements[section].classList.remove('isHide');
    }

    for (let i = 0; i < itemElements.length; i++) {
        const originalHeight = itemElements[i].getAttribute('originalHeight');

        itemElements[i].style.height = `${originalHeight * (isHide ? 0.5 : 1)}px`;
    }
}

function toggleColumn(section, column) {
    const blocksElements = contentElements[section].getElementsByClassName('blocks');

    for (let i = 0; i < blocksElements.length; i++) {
        if (i == column) {
            blocksElements[i].classList.remove('isHide');
        } else {
            blocksElements[i].classList.add('isHide');
        }
    }
}
