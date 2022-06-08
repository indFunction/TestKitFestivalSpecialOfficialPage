const genisysElement = document.getElementById('genisys');

const counterItems = [
    'Days',
    'Hours',
    'Minutes',
    'Seconds'
];

function setGenisysElement(daysDigits) {
    genisysElement.innerHTML = `
        <div class="title">GATE</div>
        <div class="counter"></div>
    `;

    counterItems.map((item, index) => {
        const spanElement = ('<span>0</span>').repeat(index == 0 ? daysDigits : 2);

        genisysElement.getElementsByClassName('counter')[0].insertAdjacentHTML(
            'beforeend',
            `
                <div>
                    <div class="item">${item}</div>
                    <div id="flip${item}" class="flip${index == 0 ? ` digit${daysDigits}` : ''}">
                        <div class="before bottom">${spanElement}</div>
                        <div class="after top">${spanElement}</div>
                        <div class="after bottom">${spanElement}</div>
                        <div class="before top">${spanElement}</div>
                    </div>
                </div>
            `
        );
    });
}

setGenisysElement(2);

const flipDaysElement = document.getElementById('flipDays');
const flipHoursElement = document.getElementById('flipHours');
const flipMinutesElement = document.getElementById('flipMinutes');
const flipSecondsElement = document.getElementById('flipSeconds');

let addMoveClassElements = [];

const setDate = new Date('2022-10-15T01:00:00.000Z'); // 日本時刻はUTC+9なので、設定したい時刻から9時間を減算する
const maxDate = 864000000;

let nowDate;
let newDate;
let oldDate;

function calcUnixDateDiff(dateA, dateB) {
    return Math.floor((dateA.getTime() - dateB.getTime()) / 1000);
}

function getUnixDate(date, allowNegative) {
    let days = parseInt(date / 86400);
    let hours = parseInt((date - days * 86400) / 3600);
    let minutes = parseInt((date - days * 86400 - hours * 3600) / 60);
    let seconds = parseInt((date - days * 86400 - hours * 3600 - minutes * 60));

    const fixNegative = (val) => val >= 0 ? val : 0;

    if (!allowNegative) {
        days = fixNegative(days);
        hours = fixNegative(hours);
        minutes = fixNegative(minutes);
        seconds = fixNegative(seconds);
    }

    return [days, hours, minutes, seconds];
}

function setCounterElements(isUnixTime, mode, force) {
    const returnDateIndex = function (date) {
        this.date = date;
    };

    returnDateIndex.prototype = {
        getSomething: function (type, index) {
            let res;

            switch (type) {
                case 0: res = this.getDate(index); break;
                case 1: res = this.getHours(index); break;
                case 2: res = this.getMinutes(index); break;
                case 3: res = this.getSeconds(index); break;
            }

            return res;
        },
        getUnix: function (index) {
            return this.date.toString().padStart(2, '0').substr(index, 1);
        },
        getDate: function (index) {
            return this.date.getDate().toString().padStart(2, '0').substr(index, 1);
        },
        getHours: function (index) {
            return this.date.getHours().toString().padStart(2, '0').substr(index, 1);
        },
        getMinutes: function (index) {
            return this.date.getMinutes().toString().padStart(2, '0').substr(index, 1);
        },
        getSeconds: function (index) {
            return this.date.getSeconds().toString().padStart(2, '0').substr(index, 1);
        }
    };

    const setDateElements = (element, type) => {
        const beforeElements = element.getElementsByClassName('before');
        const afterElements = element.getElementsByClassName('after');

        const daysDigits = parseInt(Math.log10(newDate[0]) + 1) || 2;

        element.className = type == 0 ? `flip digit${daysDigits}` : 'flip digit2';

        for (let i = 0; i < beforeElements.length; i++) {
            if (force || mode == 0 || mode == 1) {
                beforeElements[i].innerHTML = '';

                for (let j = 0; j < (isUnixTime && type == 0 ? daysDigits : 2); j++) {
                    const span = isUnixTime ? new returnDateIndex(newDate[type]).getUnix(j) : new returnDateIndex(newDate).getSomething(type, j);

                    beforeElements[i].insertAdjacentHTML(
                        'beforeend',
                        `<span>${span}</span>`
                    );
                }
            }

            if (force || mode == 0 || mode == 2) {
                afterElements[i].innerHTML = '';

                for (let j = 0; j < (isUnixTime && type == 0 ? daysDigits : 2); j++) {
                    const span = isUnixTime ? new returnDateIndex(newDate[type]).getUnix(j) : new returnDateIndex(newDate).getSomething(type, j);

                    afterElements[i].insertAdjacentHTML(
                        'beforeend',
                        `<span>${span}</span>`
                    );
                }
            }

            addMoveClassElements.push(beforeElements[i]);
            addMoveClassElements.push(afterElements[i]);
        }
    };

    if (
        force ||
        (isUnixTime && newDate[0] != oldDate[0]) ||
        (!isUnixTime && newDate.getDate() != oldDate.getDate())
    ) setDateElements(flipDaysElement, 0);

    if (
        force ||
        (isUnixTime && newDate[1] != oldDate[1]) ||
        (!isUnixTime && newDate.getHours() != oldDate.getHours())
    ) setDateElements(flipHoursElement, 1);

    if (
        force ||
        (isUnixTime && newDate[2] != oldDate[2]) ||
        (!isUnixTime && newDate.getMinutes() != oldDate.getMinutes())
    ) setDateElements(flipMinutesElement, 2);

    if (
        force ||
        (isUnixTime && newDate[3] != oldDate[3]) ||
        (!isUnixTime && newDate.getSeconds() != oldDate.getSeconds())
    ) setDateElements(flipSecondsElement, 3);
}

function setCounter(isUnixTime, force) {
    nowDate = isUnixTime ? calcUnixDateDiff(setDate, new Date()) + 1 : undefined;

    const getNewDate = (deny) => {
        if (deny) return;

        if (isUnixTime) {
            newDate = nowDate < maxDate ? getUnixDate(nowDate, false) : getUnixDate(maxDate - 1, false);
        } else {
            newDate = new Date();
        }
    }

    const getOldDate = (deny) => {
        if (deny) return;

        if (isUnixTime) {
            oldDate = nowDate < maxDate ? getUnixDate(nowDate, false) : getUnixDate(maxDate - 1, false);
        } else {
            oldDate = new Date();

            oldDate.setSeconds(oldDate.getSeconds() - 1);
        }
    }

    getNewDate();
    getOldDate(isUnixTime);

    setCounterElements(isUnixTime, 2, force);

    for (let i = 0; i < addMoveClassElements.length; i++) addMoveClassElements[i].classList.add('move');

    setTimeout(() => {
        setCounterElements(isUnixTime, 1, force);

        for (let i = 0; i < addMoveClassElements.length; i++) addMoveClassElements[i].classList.remove('move');

        addMoveClassElements = [];

        getOldDate(!isUnixTime);

        if (nowDate && nowDate < 1) clearInterval(counterInterval);
    }, 500);
}

setCounter(true, true);

let counterInterval = setInterval(() => setCounter(true, false), 1000);

// 装飾から機能までを半日で作ってやったぜぇ。ワイルドだろぉ？
