const boothElement = document.getElementById('unreal');

getJson('../../../data/booth/booth-main.json')
    .then((data) => setCards(data, 0))
        .then(getJson('../../../data/booth/booth-pro.json')
            .then((data) => setCards(data, 0)));

getJson('../../../data/booth/booth-outdoor.json').then((data) => setCards(data, 1));

getJson('../../../data/booth/booth-indoor.json').then((data) => setCards(data, 2));

function setCards(cardData, section) {
    const displayElements = boothElement.getElementsByClassName('display');

    cardData.map((item) => {
        if (item.type == 'category') {
            displayElements[section].getElementsByClassName('cards')[0].insertAdjacentHTML(
                'beforeend',
                `
                    <div class="card category">
                        <div>
                            <div class="title">${item.title}</div>
                            <div class="icon">${item.icon}</div>
                            <div class="description">${item.description}</div>
                        </div>
                    </div>
                `
            );
        }

        if (item.type == 'map') {
            displayElements[section].getElementsByClassName('cards')[0].insertAdjacentHTML(
                'beforeend',
                `
                    <div class="card map">
                        <div>
                            <div class="image">
                                <img src="${item.image}" alt="地図" />
                                <a href="${item.image}"></a>
                            </div>
                        </div>
                    </div>
                `
            );
        }

        if (item.type == 'item') {
            displayElements[section].getElementsByClassName('cards')[0].insertAdjacentHTML(
                'beforeend',
                `
                    <div class="card item">
                        <div>
                            <div class="title">${item.title}</div>
                            <div class="id">${item.id}</div>
                            <div class="organizer">${item.organizer}</div>
                            <div class="location">${item.location}</div>
                            <div class="description">
                            ${item.image ? `
                                <div class="image">
                                    <img src="${item.image}" alt="${item.id}" />
                                    <a href="${item.image}"></a>
                                </div>
                            ` : ''}
                                <div class="text">${item.description}</div>
                            </div>
                        </div>
                    </div>
                `
            );
        }
    });

    if (displayElements.length % 2 == 1) {
        displayElements[section].getElementsByClassName('cards')[0].insertAdjacentHTML(
            'beforeend',
            `
                <div class="card dummy"></div>
            `
        );
    }
}
