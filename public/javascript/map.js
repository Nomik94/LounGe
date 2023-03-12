function createEventMap() {
  let mapContainer = document.getElementById('createMap'), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      level: 1, // 지도의 확대 레벨
    };
  // 지도를 생성합니다
  let map = new kakao.maps.Map(mapContainer, mapOption);

  // 주소-좌표 변환 객체를 생성합니다
  let geocoder = new kakao.maps.services.Geocoder();

  let marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
    infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

  // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
  searchAddrFromCoords(map.getCenter(), displayCenterInfo);

  if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도

      let locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

      // 마커와 인포윈도우를 표시합니다
      displayMarker(locPosition, message);
    });
  } else {
    // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

    let locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
      message = 'geolocation을 사용할수 없어요..';

    displayMarker(locPosition, message);
  }

  function displayMarker(locPosition, message) {
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);
  }

  // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
  kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        let detailAddr = !!result[0].road_address
          ? '<div>도로명주소 : ' +
            result[0].road_address.address_name +
            '</div>'
          : '';
        detailAddr +=
          '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

        let content = '<div class="bAddr">' + detailAddr + '</div>';

        // 마커를 클릭한 위치에 표시합니다
        marker.setPosition(mouseEvent.latLng);
        marker.setMap(map);

        // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
        infowindow.setContent(content);
        infowindow.open(map, marker);

        // 클릭한 위도, 경도 정보를 가져옵니다
        let latlng = mouseEvent.latLng;

        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlng);
        const lat = latlng.getLat();
        const lng = latlng.getLng();
        document.getElementById('event-latlng').value = `${lat},${lng}`;
        document.getElementById('event-location').value = !!result[0]
          .road_address
          ? result[0].road_address.address_name
          : result[0].address.address_name;
      }
    });
  });

  // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
  kakao.maps.event.addListener(map, 'idle', function () {
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
  });

  function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
  }

  function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
  function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
    }
  }
}

function checkDayEvent() {
  const allDay = document.getElementById('event-add-end-time').checked;
  if (allDay) {
    document.getElementById('event-enddate').value =
      localStorage.getItem('start');
    document.getElementById('event-time-end').disabled = false;
  } else {
    document.getElementById('event-enddate').value =
      localStorage.getItem('end');
    document.getElementById('event-time-end').disabled = true;
    document.getElementById('event-time-end').value = '00:00';
  }
}

function createUserEvent() {
  const eventName = document.getElementById('event-name').value || undefined;
  const eventContent =
    document.getElementById('event-description').value || undefined;
  const allDay = document.getElementById('event-add-end-time').checked;
  const start = document.getElementById('event-startdate').value || undefined;
  const end = document.getElementById('event-enddate').value || undefined;
  const timeStart =
    document.getElementById('event-time-start').value || undefined;
  const timeEnd = document.getElementById('event-time-end').value || undefined;
  const location = document.getElementById('event-location').value || undefined;
  const latlngStr = document.getElementById('event-latlng').value || undefined;

  let latlng = [];
  if (latlngStr) {
    latlng = latlngStr.split(',');
  }
  const startStr = `${start} ${timeStart}`;
  const endStr = `${end} ${timeEnd}`;
  const lat = latlng[0];
  const lng = latlng[1];

  axios({
    url: `/api/calendar/users`,
    method: 'post',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
    data: {
      eventName,
      eventContent,
      start: startStr,
      end: endStr,
      location,
      lat,
      lng,
    },
  })
    .then(async function (res) {
      await Swal.fire({
        icon: 'success',
        text: `${eventName} 일정이 추가되었습니다.`,
      });
      window.location.reload();
    })
    .catch(async function (error) {
      if (error.response.data.statusCode === 401) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'center-center',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        await Toast.fire({
          icon: 'error',
          title: '로그인이 필요합니다.<br> 로그인 페이지로 이동합니다.',
        });
        window.location.replace('/');
      }
      Swal.fire({
        icon: 'error',
        text: `${error.response.data.message}`,
      });
    });
}
