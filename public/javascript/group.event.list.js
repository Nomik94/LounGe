$(document).ready(function () {
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
      console.log(res.data);
      res.data.forEach((data) => {
        const getDate = data.start.split(' ')[0].split('-')
        console.log(getDate[0])
        let temp_html = `      <!-- EVENT PREVIEW -->
        <div class="event-preview">
          <!-- EVENT PREVIEW COVER -->
          <figure class="event-preview-cover liquid">
            <img src="/backgroundImage/1.png" alt="cover-33">
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
              <p class="event-preview-title popup-event-information-trigger">${data.eventName}</p>
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
              <p class="button white white-tertiary">일정 삭제</p>
              <!-- /BUTTON -->
            </div>
            <!-- /EVENT PREVIEW INFO BOTTOM -->
          </div>
          <!-- /EVENT PREVIEW INFO -->
        </div>
        <!-- /EVENT PREVIEW -->`;
        $('#groupEventList').append(temp_html);
      });
      const js = `
      <script src="/js/global/global.hexagons.js"></script>
      <script src="/js/utils/liquidify.js"></script>`;
      $('#groupeventjs').append(js);
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
