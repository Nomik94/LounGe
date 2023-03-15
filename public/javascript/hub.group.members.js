$(document).ready(async function () {
  await restoreToken();
  managementMemberList();
});

function managementMemberList() {
  $('.notification-box-list').empty();
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  axios({
    url: `/api/groups/${groupId}/members/list`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(function (res) {
      $('#groupTitle').empty();
      $('#groupTitle').append(`${res.data.group.groupName}`);
      document.getElementById(
        'popupButton',
      ).innerHTML = `<p class="button secondary full popup-manage-group-trigger-1" onclick="modifyGroup('${res.data.group.groupImage}','${res.data.group.backgroundImage}')">그룹 수정하기</p>`;
      document.getElementById(
        'avatarImg',
      ).innerHTML = `<div class="hexagon-image-84-92" data-src="/groupImage/${res.data.group.groupImage}"></div>`;
      document.getElementById(
        'backImg',
      ).innerHTML = `<img src="/backgroundImage/${res.data.group.backgroundImage}" alt="backgroundImg">`;
      document.getElementById(
        'groupName',
      ).value = `${res.data.group.groupName}`;
      document.getElementById(
        'groupDescription',
      ).value = `${res.data.group.description}`;
      document.getElementById('groupTags').value = `${res.data.tags.join(',')}`;

      res.data.members.forEach((data) => {
        if (data.userRole === '회원') {
          let temp_html = `          <!-- 멤버 리스트 추방 -->
        <div class="notification-box" id="kickdeletebox${data.userId}">
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
            <p class="user-status-text small-space">${data.userRole}</p>
            <!-- /USER STATUS TEXT -->

            <!-- ACTION REQUEST LIST -->
            <div class="action-request-list">
            <!-- ACTION REQUEST -->
              <p class="action-request accept with-text" onclick="groupTransfer(${groupId}, ${data.userId},'${data.userName}')">
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
              <div class="action-request decline with-text" onclick="kickOutGroup(${groupId}, ${data.userId},'${data.userName}')">
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
        <!-- /NOTIFICATION BOX -->`;
          $('.notification-box-list').append(temp_html);
        }
      });
      const js = `
      <script src="/js/global/global.hexagons.js"></script>
      <script src="/js/utils/liquidify.js"></script>
      <script src="/js/global/global.popups.js"></script>
      `;
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
        icon: 'error',
        text: `${error.response.data.message}`,
      });
    });
}

function managementApplyList() {
  $('.notification-box-list').empty();
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  axios({
    url: `/api/groups/${groupId}/applicant/list`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(function (res) {
      res.data.forEach((data) => {
        let temp_html = `          <!-- 가입 신청자 수락 거절 -->
        <div class="notification-box" id="acceptdeletebox${data.userId}">
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
              <div class="action-request decline with-text" onclick="rejectGroup(${groupId},${data.userId},'${data.userName}')">
                <!-- ACTION REQUEST ICON -->
                <svg class="action-request-icon icon-remove-friend">
                  <use xlink:href="#svg-remove-friend"></use>
                </svg>
                <!-- /ACTION REQUEST ICON -->
                <!-- ACTION REQUEST TEXT -->
                <span class="action-request-text" >거절</span>
                <!-- /ACTION REQUEST TEXT -->
              </div>
              <!-- /ACTION REQUEST -->
            </div>
            <!-- ACTION REQUEST LIST -->
          </div>
          <!-- /USER STATUS -->
        </div>
        <!-- /NOTIFICATION BOX -->`;
        $('.notification-box-list').append(temp_html);
      });
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
        icon: 'error',
        text: `${error.response.data.message}`,
      });
    });
}

function applyJoin(groupId, memberId, userName) {
  Swal.fire({
    text: `${userName}님의 가입신청을 수락하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
    reverseButtons: false, // 버튼 순서 거꾸로
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        url: `/api/groups/${groupId}/members/${memberId}`,
        method: 'put',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(function (res) {
          managementApplyList();
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
  });
}

function groupTransfer(groupId, memberId, userName) {
  Swal.fire({
    text: `${userName}님께 그룹을 양도하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
    reverseButtons: false, // 버튼 순서 거꾸로
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        url: `/api/groups/${groupId}/leaders/transfer/${memberId}`,
        method: 'put',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(function (res) {
          managementMemberList();
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
  });
}

function kickOutGroup(groupId, memberId, userName) {
  Swal.fire({
    text: `${userName}님을 그룹에서 추방하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
    reverseButtons: false, // 버튼 순서 거꾸로
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        url: `/api/groups/${groupId}/kickout/${memberId}`,
        method: 'delete',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(function (res) {
          managementMemberList();
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
  });
}

function deleteGroup() {
  $('.notification-box-list').empty();
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  Swal.fire({
    text: `정말로 그룹을 삭제하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
    reverseButtons: false, // 버튼 순서 거꾸로
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        url: `/api/groups/${groupId}`,
        method: 'delete',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(function (res) {
          window.location.replace('/group/management');
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
  });
}

async function modifyGroup(groupImg, backImg) {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let groupId = param.get('groupId');

  const groupName = document.getElementById('groupName').value;
  const groupDescription = document.getElementById('groupDescription').value;
  const groupTags = document.getElementById('groupTags').value;
  let groupImage = document.getElementById('groupImage').files[0];
  let backgroundImage = document.getElementById('backgroundImage').files[0];
  if (!groupImage) {
    groupImage = groupImg;
  }

  if (!backgroundImage) {
    backgroundImage = backImg;
  }

  const formData = new FormData();
  formData.append('groupName', groupName);
  formData.append('description', groupDescription);
  formData.append('tag', groupTags);
  formData.append('groupImage', groupImage);
  formData.append('backgroundImage', backgroundImage);
  if (!groupName || !groupDescription) {
    await Swal.fire({
      icon: 'error',
      text: `정보를 모두 입력해주세요.`,
    });
  } else {
    axios({
      url: `/api/groups/${groupId}`,
      method: 'put',
      headers: {
        Authorization: `${getCookie('accessToken')}`,
      },
      data: formData,
    })
      .then(async function (res) {
        await Swal.fire({
          icon: 'success',
          text: `그룹이 수정되었습니다.`,
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
}

function rejectGroup(groupId, memberId, userName) {
  Swal.fire({
    text: `${userName}님의 가입신청을 거절하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
    reverseButtons: false, // 버튼 순서 거꾸로
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        url: `/api/groups/${groupId}/reject/${memberId}`,
        method: 'delete',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(function (res) {
          managementApplyList()
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
  });
}

function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
