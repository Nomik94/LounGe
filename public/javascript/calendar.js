(async function () {
  await restoreToken();
  $(function () {
    // calendar element 취득
    let calendarEl = $('#calendar')[0];
    // full-calendar 생성하기
    let calendar = new FullCalendar.Calendar(calendarEl, {
      height: '700px', // calendar 높이 설정
      expandRows: true, // 화면에 맞게 높이 재설정
      slotMinTime: '00:00', // Day 캘린더에서 시작 시간
      slotMaxTime: '23:59', // Day 캘린더에서 종료 시간
      headers: {},
      // 해더에 표시할 툴바
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek',
      },
      initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면(기본 설정: 달)
      /** initialDate: '2021-07-15', // 초기 날짜 설정 (설정하지 않으면 오늘 날짜가 보인다.)**/
      navLinks: true, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
      editable: false, // 수정 가능?
      selectable: true, // 달력 일자 드래그 설정가능
      nowIndicator: true, // 현재 시간 마크
      dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
      locale: 'ko', // 한국어 설정
      timeZone: 'UTC', // 시간설정 'local' 가능!
      eventAdd: function (obj) {
        // 이벤트가 추가되면 발생하는 이벤트
        const title = obj.event.title;
        const start = obj.event.startStr;
        const end = obj.event.endStr;
      },
      eventChange: function (obj) {
        // 이벤트가 수정되면 발생하는 이벤트
      },
      eventRemove: function (obj) {
        // 이벤트가 삭제되면 발생하는 이벤트
      },
      select: function (arg) {
        document.getElementById('event-name').value = '';
        document.getElementById('event-description').value = '';
        document.getElementById('event-add-end-time').checked = false;
        document.getElementById('event-startdate').value = '';
        document.getElementById('event-enddate').value = '';
        document.getElementById('event-time-start').value = '00:00';
        document.getElementById('event-time-end').value = '00:00';
        document.getElementById('event-location').value = '';
        document.getElementById('event-latlng').value = '';
        localStorage.clear();

        const createEventButton = document.getElementById('createEventButton');
        createEventButton.click();
        const start = arg.startStr;
        const end = arg.endStr;
        localStorage.setItem('start', arg.startStr);
        localStorage.setItem('end', arg.endStr);

        document.getElementById('event-startdate').value = start;
        document.getElementById('event-enddate').value = end;

        // 캘린더에서 드래그로 이벤트를 생성할 수 있다.
        calendar.unselect();
      },
      // 이벤트
      events: function (info, success, fail) {
        axios({
          url: `/api/calendar/events`,
          method: 'get',
          headers: {
            Authorization: `${getCookie('accessToken')}`,
          },
          data: {},
        })
          .then(async function (res) {
            listRender(res.data);
            const events = [];
            res.data.forEach((event) => {
              events.push({
                title: `${event.eventName}`,
                start: `${event.start}`,
                end: `${event.end}`,
                color: `${event.color}`,
              });
            });
            success(events);
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
      },
    });
    // 캘린더 랜더링
    calendar.render();
  });
})();

function listRender(data) {
  data.forEach((event) => {
    const getDate = event.start.split(' ')[0].split('-');
    let temp_html;
    if (event.where === 'group') {
      temp_html = `      <!-- EVENT PREVIEW -->
    <div class="event-preview">
      <!-- EVENT PREVIEW COVER -->
      <figure class="event-preview-cover liquid">
        <img src="/backgroundImage/${event.backgroundImage}" alt="cover-33">
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
          <p class="event-preview-title popup-event-information-trigger-1" onclick="popupdata('${event.where}','${event.id}','${event.tableId}')">${event.name}</p>
          <!-- /EVENT PREVIEW TITLE -->
          <br>
          <!-- EVENT PREVIEW TITLE -->
          <p class="event-preview-title popup-event-information-trigger-1" onclick="popupdata('${event.where}','${event.id}','${event.tableId}')">${event.eventName}</p>
          <!-- /EVENT PREVIEW TITLE -->
    
          <!-- EVENT PREVIEW TIMESTAMP -->
          <p class="event-preview-timestamp"><span class="bold">${event.start} ~ ${event.end}</p>
          <!-- /EVENT PREVIEW TIMESTAMP -->
    
          <!-- EVENT PREVIEW TEXT -->
          <p class="event-preview-text">${event.eventContent}</p>
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
            <p class="decorated-text-content">${event.location}</p>
            <!-- /DECORATED TEXT CONTENT -->
          </div>
          <!-- /DECORATED TEXT -->

        </div>
        <!-- /EVENT PREVIEW INFO BOTTOM -->
      </div>
      <!-- /EVENT PREVIEW INFO -->
    </div>
    <!-- /EVENT PREVIEW -->`;
    } else {
      temp_html = `      <!-- EVENT PREVIEW -->
      <div class="event-preview">
        <!-- EVENT PREVIEW COVER -->
        <figure class="event-preview-cover liquid">
          <img src="/backgroundImage/${event.backgroundImage}" alt="cover-33">
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
            <p class="event-preview-title popup-event-information-trigger-1" onclick="popupdata('${event.where}','${event.id}','${event.tableId}')">${event.name}</p>
            <!-- /EVENT PREVIEW TITLE -->
            <br>
            <!-- EVENT PREVIEW TITLE -->
            <p class="event-preview-title popup-event-information-trigger-1" onclick="popupdata('${event.where}','${event.id}','${event.tableId}')">${event.eventName}</p>
            <!-- /EVENT PREVIEW TITLE -->
      
            <!-- EVENT PREVIEW TIMESTAMP -->
            <p class="event-preview-timestamp"><span class="bold">${event.start} ~ ${event.end}</p>
            <!-- /EVENT PREVIEW TIMESTAMP -->
      
            <!-- EVENT PREVIEW TEXT -->
            <p class="event-preview-text">${event.eventContent}</p>
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
              <p class="decorated-text-content">${event.location}</p>
              <!-- /DECORATED TEXT CONTENT -->
            </div>
            <!-- /DECORATED TEXT -->
      
            <!-- BUTTON -->
            <p class="button white white-tertiary" onclick="deleteUserEvent(${event.id},'${event.eventName}')">일정 삭제</p>
            <!-- /BUTTON -->
          </div>
          <!-- /EVENT PREVIEW INFO BOTTOM -->
        </div>
        <!-- /EVENT PREVIEW INFO -->
      </div>
      <!-- /EVENT PREVIEW -->`;
    }

    $('#eventList').append(temp_html);
  });

  let calendarjs = `<script src="/js/global/global.hexagons.js"></script>
  <script src="/js/utils/liquidify.js"></script>
  <script src="/js/global/global.popups.js"></script>`;
  $('#calendarjs').append(calendarjs);
}

async function popupdata(where, eventId, tableId) {
  let url = `/api/calendar/groups/${tableId}/events/${eventId}`;
  if (where === 'user') {
    url = `/api/calendar/users/${tableId}/events/${eventId}`;
  }

  axios({
    url: url,
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
      document.getElementById(
        'imgurl',
      ).style.backgroundImage = `url("/backgroundImage/1.png")`;
      document.getElementById('backImg').src = `/backgroundImage/1.png`;
      if (Object.keys(res.data).includes('group')) {
        document.getElementById(
          'imgurl',
        ).style.backgroundImage = `url("/backgroundImage/${res.data.group.backgroundImage}")`;
        document.getElementById(
          'backImg',
        ).src = `/backgroundImage/${res.data.group.backgroundImage}`;
      }
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
