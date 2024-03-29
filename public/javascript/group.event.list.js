$(document).ready(async function () {
  await restoreToken();
  groupEventList();
});

function groupEventList() {
  $('.notification-box-list').empty();
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  axios({
    url: `/api/calendar/groups/${groupId}/events`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(function (res) {
      if (!res.data.role) {
        document.getElementById('createButton').innerHTML = '';
      }
      res.data.groupInfo.forEach((data) => {
        const getDate = data.start.split(' ')[0].split('-');
        if (res.data.role) {
          let temp_html = `      <!-- EVENT PREVIEW -->
          <div class="event-preview">
            <!-- EVENT PREVIEW COVER -->
            <figure class="event-preview-cover liquid">
              <img src="https://lounges3.s3.ap-northeast-2.amazonaws.com/1.png" alt="cover-33">
            </figure>
            <!-- /EVENT PREVIEW COVER -->
    
            <!-- EVENT PREVIEW INFO -->
            <div class="event-preview-info">
              <!-- EVENT PREVIEW INFO TOP -->
              <div class="event-preview-info-top">
                <!-- DATE STICKER -->
                <div class="date-sticker">
                  <!-- DATE STICKER DAY -->
                  <p class="date-sticker-day">${getDate[2]}</p>
                  <!-- /DATE STICKER DAY -->
          
                  <!-- DATE STICKER MONTH -->
                  <p class="date-sticker-month">${getDate[1]}</p>
                  <!-- /DATE STICKER MONTH -->
                </div>
                <!-- /DATE STICKER -->
          
                <!-- EVENT PREVIEW TITLE -->
                <p class="event-preview-title popup-event-information-trigger-1" onclick="popupdata('${data.id}')">${data.eventName}</p>
                <!-- /EVENT PREVIEW TITLE -->
          
                <!-- EVENT PREVIEW TIMESTAMP -->
                <p class="event-preview-timestamp"><span class="bold">${data.start} ~ ${data.end}</p>
                <!-- /EVENT PREVIEW TIMESTAMP -->
          
                <!-- EVENT PREVIEW TEXT -->
                <p class="event-preview-text">${data.eventContent}</p>
                <!-- /EVENT PREVIEW TEXT -->
              </div>
              <!-- /EVENT PREVIEW INFO TOP -->
    
              <!-- EVENT PREVIEW INFO BOTTOM -->
              <div class="event-preview-info-bottom">
                <!-- DECORATED TEXT -->
                <div class="decorated-text">
                  <!-- DECORATED TEXT ICON -->
                  <svg class="decorated-text-icon icon-pin">
                    <use xlink:href="#svg-pin"></use>
                  </svg>
                  <!-- /DECORATED TEXT ICON -->
          
                  <!-- DECORATED TEXT CONTENT -->
                  <p class="decorated-text-content">${data.location}</p>
                  <!-- /DECORATED TEXT CONTENT -->
                </div>
                <!-- /DECORATED TEXT -->
          
                <!-- BUTTON -->
                <p class="button white white-tertiary" onclick="deleteGroupEvent(${data.id},'${data.eventName}')">일정 삭제</p>
                <!-- /BUTTON -->
              </div>
              <!-- /EVENT PREVIEW INFO BOTTOM -->
            </div>
            <!-- /EVENT PREVIEW INFO -->
          </div>
          <!-- /EVENT PREVIEW -->`;
          $('#groupEventList').append(temp_html);
        } else {
          let temp_html = `      <!-- EVENT PREVIEW -->
        <div class="event-preview">
          <!-- EVENT PREVIEW COVER -->
          <figure class="event-preview-cover liquid">
            <img src="https://lounges3.s3.ap-northeast-2.amazonaws.com/1.png" alt="cover-33">
          </figure>
          <!-- /EVENT PREVIEW COVER -->
  
          <!-- EVENT PREVIEW INFO -->
          <div class="event-preview-info">
            <!-- EVENT PREVIEW INFO TOP -->
            <div class="event-preview-info-top">
              <!-- DATE STICKER -->
              <div class="date-sticker">
                <!-- DATE STICKER DAY -->
                <p class="date-sticker-day">${getDate[2]}</p>
                <!-- /DATE STICKER DAY -->
        
                <!-- DATE STICKER MONTH -->
                <p class="date-sticker-month">${getDate[1]}</p>
                <!-- /DATE STICKER MONTH -->
              </div>
              <!-- /DATE STICKER -->
        
              <!-- EVENT PREVIEW TITLE -->
              <p class="event-preview-title popup-event-information-trigger-1" onclick="popupdata('${data.id}')">${data.eventName}</p>
              <!-- /EVENT PREVIEW TITLE -->
        
              <!-- EVENT PREVIEW TIMESTAMP -->
              <p class="event-preview-timestamp"><span class="bold">${data.start} ~ ${data.end}</p>
              <!-- /EVENT PREVIEW TIMESTAMP -->
        
              <!-- EVENT PREVIEW TEXT -->
              <p class="event-preview-text">${data.eventContent}</p>
              <!-- /EVENT PREVIEW TEXT -->
            </div>
            <!-- /EVENT PREVIEW INFO TOP -->
  
            <!-- EVENT PREVIEW INFO BOTTOM -->
            <div class="event-preview-info-bottom">
              <!-- DECORATED TEXT -->
              <div class="decorated-text">
                <!-- DECORATED TEXT ICON -->
                <svg class="decorated-text-icon icon-pin">
                  <use xlink:href="#svg-pin"></use>
                </svg>
                <!-- /DECORATED TEXT ICON -->
        
                <!-- DECORATED TEXT CONTENT -->
                <p class="decorated-text-content">${data.location}</p>
                <!-- /DECORATED TEXT CONTENT -->
              </div>
              <!-- /DECORATED TEXT -->
        
            </div>
            <!-- /EVENT PREVIEW INFO BOTTOM -->
          </div>
          <!-- /EVENT PREVIEW INFO -->
        </div>
        <!-- /EVENT PREVIEW -->`;
          $('#groupEventList').append(temp_html);
        }
      });
      const js = `
      <script src="/js/global/global.hexagons.js"></script>
      <script src="/js/utils/liquidify.js"></script>
      <script src="/js/global/global.popups.js"></script>`;
      $('#groupeventjs').append(js);
    })
    .catch(async function (error) {
      document.getElementById('createButton').innerHTML = '';
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

function popupdata(eventId) {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  axios({
    url: `/api/calendar/groups/${groupId}/events/${eventId}`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(function (res) {
      let mapContainer = document.getElementById('leadMap'), // 지도를 표시할 div
        mapOption = {
          center: new kakao.maps.LatLng(res.data.lat, res.data.lng), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

      let map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      let imageSrc =
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbyHkUu%2Fbtr3HTKknNu%2FOBRWlegU786HzkWsizcWDK%2Fimg.png', // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(27, 69) };

      let markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption,
        ),
        markerPosition = new kakao.maps.LatLng(res.data.lat, res.data.lng);
      // 마커가 표시될 위치입니다

      // 마커를 생성합니다
      let marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);
      document.getElementById('uptitle').innerHTML = res.data.eventName;
      document.getElementById(
        'uptime',
      ).innerHTML = `${res.data.start}<br>${res.data.end}`;
      document.getElementById('upaddress').innerHTML = res.data.location;
      document.getElementById(
        'upxy',
      ).innerHTML = `위도 : ${res.data.lat}<br>경도 : ${res.data.lng}`;
      document.getElementById('updesc').innerHTML = res.data.eventContent;

      // $('#groupEventList').append(temp_html);

      // const js = `
      // <script src="/js/global/global.hexagons.js"></script>
      // <script src="/js/utils/liquidify.js"></script>
      // <script src="/js/global/global.popups.js"></script>`;
      // $('#groupeventjs').append(js);
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
