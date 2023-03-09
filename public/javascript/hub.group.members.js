$(document).ready(function () {
  managementMemberList();
});

function managementMemberList() {
  $('.notification-box-list').empty()
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  const accessToken = document.cookie
    .split(';')
    .filter((token) => token.includes('accessToken'))[0]
    .split('=')[1];

  axios({
    url: `/api/groups/${groupId}/members/list`,
    method: 'get',
    headers: {
      Authorization: `${accessToken}`,
    },
  })
    .then(function (res) {
      $('#groupTitle').empty()
      $('#groupTitle').append(`${res.data.group.groupName}`)
  
      res.data.members.forEach((data) => {
        if(data.userRole === '회원'){
          let temp_html = `          <!-- 멤버 리스트 추방 -->
        <div class="notification-box">
          <!-- USER STATUS -->
          <div class="user-status request">
            <!-- USER STATUS AVATAR -->
            <a class="user-status-avatar">
              <!-- USER AVATAR -->
              <div class="user-avatar small no-outline">
                <!-- USER AVATAR CONTENT -->
                <div class="user-avatar-content">
                  <!-- HEXAGON -->
                  <div class="hexagon-image-30-32" data-src="/userImage/${data.userImage}"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->
            
                <!-- USER AVATAR PROGRESS -->
                <div class="user-avatar-progress">
                  <!-- HEXAGON -->
                  <div class="hexagon-progress-40-44"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS -->
            
                <!-- USER AVATAR PROGRESS BORDER -->
                <div class="user-avatar-progress-border">
                  <!-- HEXAGON -->
                  <div class="hexagon-border-40-44"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS BORDER -->  
              </div>
              <!-- /USER AVATAR -->
            </a>
            <!-- /USER STATUS AVATAR -->

            <!-- USER STATUS TITLE -->
            <p class="user-status-title"><a class="bold">${data.userName}</a></p>
            <!-- /USER STATUS TITLE -->
            <!-- USER STATUS TEXT -->
            <p class="user-status-text small-space">${data.userEmail}</p>
            <!-- /USER STATUS TEXT -->

            <!-- ACTION REQUEST LIST -->
            <div class="action-request-list">
            <!-- ACTION REQUEST -->
              <p class="action-request accept with-text">
                <!-- ACTION REQUEST ICON -->
                <svg class="action-request-icon icon-add-friend">
                  <use xlink:href="#svg-add-friend"></use>
                </svg>
                <!-- /ACTION REQUEST ICON -->
                
                <!-- ACTION REQUEST TEXT -->
                <span class="action-request-text">양도</span>
                <!-- /ACTION REQUEST TEXT -->
              </p>
              <!-- /ACTION REQUEST -->
              <!-- ACTION REQUEST -->
              <div class="action-request decline with-text">
                <!-- ACTION REQUEST ICON -->
                <svg class="action-request-icon icon-remove-friend">
                  <use xlink:href="#svg-remove-friend"></use>
                </svg>
                <!-- /ACTION REQUEST ICON -->
                <!-- ACTION REQUEST TEXT -->
                <span class="action-request-text">추방</span>
                <!-- /ACTION REQUEST TEXT -->
              </div>
              <!-- /ACTION REQUEST -->
            </div>
            <!-- ACTION REQUEST LIST -->
          </div>
          <!-- /USER STATUS -->
        </div>
        <!-- /NOTIFICATION BOX -->`
        $('.notification-box-list').append(temp_html);
        }
      })
      const js = `
      <script src="/js/global/global.hexagons.js"></script>
      <script src="/js/utils/liquidify.js"></script>`;
      $('#managementjs').append(js);
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
        icon: 'false',
        text: `${error.response.data.message}`,
      });
    });
}

function managementApplyList() {
  $('.notification-box-list').empty()
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  const accessToken = document.cookie
    .split(';')
    .filter((token) => token.includes('accessToken'))[0]
    .split('=')[1];

  axios({
    url: `/api/groups/${groupId}/applicant/list`,
    method: 'get',
    headers: {
      Authorization: `${accessToken}`,
    },
  })
    .then(function (res) {
      console.log(res.data);
      res.data.forEach((data) => {
        let temp_html = `          <!-- 가입 신청자 수락 거절 -->
        <div class="notification-box" id="deletebox${data.userId}">
          <!-- USER STATUS -->
          <div class="user-status request">
            <!-- USER STATUS AVATAR -->
            <a class="user-status-avatar">
              <!-- USER AVATAR -->
              <div class="user-avatar small no-outline">
                <!-- USER AVATAR CONTENT -->
                <div class="user-avatar-content">
                  <!-- HEXAGON -->
                  <div class="hexagon-image-30-32" data-src="/userImage/${data.userImage}"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->
            
                <!-- USER AVATAR PROGRESS -->
                <div class="user-avatar-progress">
                  <!-- HEXAGON -->
                  <div class="hexagon-progress-40-44"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS -->
            
                <!-- USER AVATAR PROGRESS BORDER -->
                <div class="user-avatar-progress-border">
                  <!-- HEXAGON -->
                  <div class="hexagon-border-40-44"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR PROGRESS BORDER -->
              </div>
              <!-- /USER AVATAR -->
            </a>
            <!-- /USER STATUS AVATAR -->

            <!-- USER STATUS TITLE -->
            <p class="user-status-title"><a class="bold">${data.userName}</a></p>
            <!-- /USER STATUS TITLE -->

            <!-- USER STATUS TEXT -->
            <p class="user-status-text small-space">${data.userEmail}</p>
            <!-- /USER STATUS TEXT -->

                          <!-- ACTION REQUEST LIST -->
            <div class="action-request-list">
              <!-- ACTION REQUEST -->
              <p class="action-request accept with-text" onclick="applyJoin(${groupId}, ${data.userId},'${data.userName}')">
                <!-- ACTION REQUEST ICON -->
                <svg class="action-request-icon icon-add-friend">
                  <use xlink:href="#svg-add-friend"></use>
                </svg>
                <!-- /ACTION REQUEST ICON -->
                
                <!-- ACTION REQUEST TEXT -->
                <span class="action-request-text" >수락</span>
                <!-- /ACTION REQUEST TEXT -->
              </p>
              <!-- /ACTION REQUEST -->

              <!-- ACTION REQUEST -->
              <div class="action-request decline with-text">
                <!-- ACTION REQUEST ICON -->
                <svg class="action-request-icon icon-remove-friend">
                  <use xlink:href="#svg-remove-friend"></use>
                </svg>
                <!-- /ACTION REQUEST ICON -->
                <!-- ACTION REQUEST TEXT -->
                <span class="action-request-text">거절</span>
                <!-- /ACTION REQUEST TEXT -->
              </div>
              <!-- /ACTION REQUEST -->
            </div>
            <!-- ACTION REQUEST LIST -->
          </div>
          <!-- /USER STATUS -->
        </div>
        <!-- /NOTIFICATION BOX -->`
        $('.notification-box-list').append(temp_html);
      })
      const js = `
      <script src="/js/global/global.hexagons.js"></script>
      <script src="/js/utils/liquidify.js"></script>`;
      $('#managementjs').append(js);
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
        icon: 'false',
        text: `${error.response.data.message}`,
      });
    });
}

function applyJoin(groupId, memberId, userName){
  console.log(groupId);
  console.log(memberId);
  console.log(userName);
  Swal.fire({
    text: `${userName}의 가입신청을 수락하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
    reverseButtons: false, // 버튼 순서 거꾸로
  }).then((result) => {
    if (result.isConfirmed) {
      const accessToken = document.cookie.split(';').filter((token)=> token.includes('accessToken'))[0].split('=')[1]

      axios({
        url: `/api/groups/${groupId}/members/${memberId}`,
        method: 'put',
        headers: {
          Authorization: `${accessToken}`,
        },
      })
        .then(function (res) {
          $(`#deletebox${memberId}`).empty()
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
            icon: 'false',
            text: `${error.response.data.message}`,
          });
        });
    }
  });
}