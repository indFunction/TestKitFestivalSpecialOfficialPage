const gateElement = document.getElementById('gate');

const screenElements = [
    'home',
    'promotion',
    'introduction',
    'booth',
    'schedule',
    'access',
    'parking',
    'sns',
    'idc'
];

const menuData = [
    {
        name: 'ホーム',
        id: 'home',
        link: '/index.html'
    },
    {
        name: 'プロモーション',
        id: 'promotion',
        link: '/pages/promotion.html'
    },
    {
        name: 'ご挨拶',
        id: 'introduction',
        link: '/pages/introduction.html'
    },
    {
        name: '企画',
        id: 'booth',
        link: '/pages/booth.html'
    },
    {
        name: 'スケジュール',
        id: 'schedule',
        link: '/pages/schedule.html'
    },
    {
        name: 'アクセス',
        id: 'access',
        link: '/pages/access.html'
    },
    {
        name: '駐車場混雑状況',
        id: 'parking',
        link: '/pages/parking.html'
    },
    {
        name: '各種SNSリンク',
        id: 'sns',
        link: '/pages/sns.html'
    },
    {
        name: '感染症対策について',
        id: 'idc',
        link: '/pages/idc.html'
    }
];

gateElement.innerHTML = `
    <div class="body">
        <div class="leftDoor"></div>
        <div class="rightDoor">
            <div class="copyright">
                Copyright 2022
                <a href="https://www.kanazawa-it.ac.jp/" target="_blank" rel="noreferrer">金沢工業大学</a> / 
                <a href="https://www2.kanazawa-it.ac.jp/shikkobu/" target="_blank" rel="noreferrer">学友会</a> / 
                <a href="https://www2.kanazawa-it.ac.jp/kitfes/" target="_blank" rel="noreferrer">工大祭実行委員会</a>
            </div>
            <div class="buttonList"></div>
        </div>
    </div>
    <div class="button">
        <div id="help" class="isHide">
            <div class="acrylicPlate">MENU<span class="arrow"></span></div>
        </div>
        <button class="retroButton function" onClick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
`;

const helpElement = document.getElementById('help');

const gateButtonListElement = gateElement.getElementsByClassName('buttonList')[0];

menuData.map((item, index) => {
    const linkElement = item.link ? 'a' : 'div';
    const linkHref = isRoot ?
        '.' + item.link :
        item.link == '/index.html' ? '..' + item.link : item.link.replace('/pages', '.');

    const isHere = isRoot ? item.link == '/index.html' : location.pathname == baseUrl + item.link;

    gateButtonListElement.insertAdjacentHTML(
        'beforeend',
        `
            <${linkElement} class="item${isHere ? ' here': ''}${item.link ? ' function': ''}"${item.link ? ` href="${linkHref}"` : ''}>
                <div class="label acrylicPlate${item.link ? '': ' blank'}">${item.name}</div>
                <div class="retroButton${item.link ? ' function': ''}">${menuData.length - index}</div>
            </${linkElement}>
        `
    );
});

function toggleMenu() {
    gateElement.classList.toggle('isClose');
    helpElement.classList.add('isHide');
}

function toggleHelp() {
    if (document.documentElement.scrollTop <= window.innerHeight || gateElement.classList.contains('isClose')) {
        helpElement.classList.add('isHide');
    } else {
        helpElement.classList.remove('isHide');
    }
}

function setContent(id) {
    screenElements.map((item) => {
        const screenElement = document.getElementById(item);

        if (item != id) {
            screenElement.classList.add('hide');
        } else {
            screenElement.classList.remove('hide');
        }
    });

    document.documentElement.scrollTop = document.getElementById(id).getBoundingClientRect().top;

    gateElement.classList.remove('isClose');
}

if (isRoot) setInterval(toggleHelp, 100);
