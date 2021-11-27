/// <reference lib="webworker" />
addEventListener('message', (dataIn) => {
  const userLongitude = dataIn.data['userLongitude'];
  const userLatitude = dataIn.data['userLatitude'];
  const bankLocationsData = dataIn.data['bankLocationsData'];

  const bankLocationsDataList = [];
  for (const value of bankLocationsData) {
    const location = value['location'];
    const one = location.split(',');
    const lng = Number(one[0]);
    const lat = Number(one[1]);

    const diffLng = Math.abs(userLongitude - lng) * 1000000;
    const diffLat = Math.abs(userLatitude - lat) * 1000000;

    const distance = diffLng * diffLng + diffLat * diffLat;
    const theBankLocation = {
      address: value['address'],
      idDetail: value['idDetail'],
      location: value['location'],
      name: value['name'],
      parentAlias: value['parentAlias'],
      parentName: value['parentName'],
      photoOne: value['photoOne'],
      photoTwo: value['photoTwo'],
      photoThree: value['photoThree'],
      tel: value['tel'],
      distance: distance
    };
    bankLocationsDataList.push(theBankLocation);
  }
  bankLocationsDataList.sort((a, b) => {
    return a.distance - b.distance;
  });
  postMessage(bankLocationsDataList);
});
