/// <reference lib="webworker" />

addEventListener('message', (dataIn) => {
  // console.log('传入进来的数据是：', dataIn);
  const city: string = dataIn.data['city'];
  const cityCodes: Array<object> = dataIn.data['cityCodes'];
  let idNeed;
  for (const one of cityCodes) {
    const name = one['name'];
    const id = one['id'];
    if (name === city) {
      idNeed = id;
      break;
    }
  }
  postMessage(idNeed);
});



