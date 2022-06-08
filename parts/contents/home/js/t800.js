const t800Element = document.getElementById('t800');

const t800Items = [
    {
        name: '前夜祭',
        date: ['2022.10.14 FRI', '17:00 - 19:00']
    },
    {
        name: '１日目',
        date: ['2022.10.15 SAT', '10:00 - 19:00']
    },
    {
        name: '２日目',
        date: ['2022.10.16 SUN', '10:00 - 19:00']
    }
];

const useRandomString = '-.0123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let oldScrollY;
let newScrollY;
let scrollDiff;

function generateRandomString(charset, length) {
    let res = '';

    for (let i = 0; i < length; i++) res += charset.substr(Math.random() * (charset.length - 1), 1);

    return res;
}

function glitchText(text, per) {
    const textArray = text.split('');

    return textArray.map((char) => (
        char != ' ' && Math.floor(Math.random() < (per / 100)) ? generateRandomString(useRandomString, 1) : char
    )).join('');
}

function glitchT800Text() {
    t800Element.innerHTML = '';

    t800Items.map((item) => {
        const glitchDateText = item.date.map((date) => '<span>' + glitchText(date, scrollDiff < 5 ? 0 : scrollDiff) + '</span> ').join('');

        t800Element.insertAdjacentHTML(
            'beforeend',
            `
                <div>
                    <div class="name">${item.name}</div>
                    <div class="date">${glitchDateText}</div>
                </div>
            `
        );
    });
}

setInterval(() => {
    oldScrollY = newScrollY;
    newScrollY = document.documentElement.scrollTop || document.body.scrollTop;
    scrollDiff = Math.abs(newScrollY - oldScrollY);

    glitchT800Text();
}, 100);
