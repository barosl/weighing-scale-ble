function log(msg) {
  const tsEl = document.createElement('td');
  tsEl.textContent = new Date().toISOString();

  const textEl = document.createElement('td');
  textEl.textContent = msg;

  const rowEl = document.createElement('tr');
  rowEl.appendChild(tsEl);
  rowEl.appendChild(textEl);

  document.querySelector('#output').appendChild(rowEl);
}

async function onSearch() {
  const dev = await navigator.bluetooth.requestDevice({
    filters: [
      { namePrefix: 'YUNMAI' },
    ],
    optionalServices: [
      0xffe5,
      0xffe0,
    ],
  });
  const server = await dev.gatt.connect();
  const service = await server.getPrimaryService(0xffe0);
  const ch = await service.getCharacteristic(0xffe4);
  await ch.startNotifications();
  ch.addEventListener('characteristicvaluechanged', ev => {
    const v = ev.target.value;
    const respType = v.getUint8(3);
    if (respType === 2) {
      const weight = v.getUint16(13) / 100;
      log(`Weight: ${weight}`);
    }
  });
}

async function main() {
  document.querySelector('#search').addEventListener('click', onSearch);
}

main();
