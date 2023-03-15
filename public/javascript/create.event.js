let today = new Date();

let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
localStorage.clear();

let dateString = year + '-' + month + '-' + day;
document.getElementById('event-startdate').value = dateString;
function checkDayEvent() {
  const allDay = document.getElementById('event-add-end-time').checked;
  if (allDay) {
    document.getElementById('event-enddate').disabled = true;
    document.getElementById('event-enddate').value =
      document.getElementById('event-startdate').value;
    document.getElementById('event-time-end').disabled = false;
  } else {
    document.getElementById('event-enddate').value =
      localStorage.getItem('end');
    document.getElementById('event-time-end').disabled = true;
    document.getElementById('event-enddate').disabled = false;
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

  const checkStartDate = validateDate(start);
  const checkEndDate = validateDate(end);

  if (!checkStartDate || !checkEndDate) {
    return Swal.fire({
      icon: 'error',
      text: `날짜는 YYYY-MM-DD와 같은 형식으로 입력해주세요.`,
    });
  }

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

function createGroupEvent() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

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

  const checkStartDate = validateDate(start);
  const checkEndDate = validateDate(end);

  if (!checkStartDate || !checkEndDate) {
    return Swal.fire({
      icon: 'error',
      text: `날짜는 YYYY-MM-DD와 같은 형식으로 입력해주세요.`,
    });
  }

  let latlng = [];
  if (latlngStr) {
    latlng = latlngStr.split(',');
  }
  const startStr = `${start} ${timeStart}`;
  const endStr = `${end} ${timeEnd}`;
  const lat = latlng[0];
  const lng = latlng[1];

  axios({
    url: `/api/calendar/groups/${groupId}`,
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

function validateDate(dateStr) {
  // YYYY-MM-DD 형식인지 확인
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  // 유효한 날짜인지 확인
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return false;

  return true;
}
