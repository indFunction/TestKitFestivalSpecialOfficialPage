const minecraftElement = document.getElementById('minecraft');
const daylightCycleElements = minecraftElement.getElementsByClassName('daylightCycle');

let nowDate;

function setDaylightCycle() {
    nowDate = new Date();

    const dayPer = (nowDate.getHours() * 60 + nowDate.getMinutes()) / 1440;

    for (let i = 0; i < daylightCycleElements.length; i++) daylightCycleElements[i].style.animationDelay = `${dayPer * -1200}s`;
}

setDaylightCycle();
