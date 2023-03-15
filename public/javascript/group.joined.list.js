let page = 1
$(document).ready(async function () {
  await restoreToken();
  joinedGroupList(page);
});

async function limitscroll() {
  page++;
  joinedGroupList(page);
}

function debounce(callback, limit = 500) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, limit);
  };
}

document.addEventListener(
  'scroll',
  debounce((e) => {
    const { clientHeight, scrollTop, scrollHeight } = e.target.scrollingElement;
    if (clientHeight + scrollTop >= scrollHeight) {
      limitscroll();
    }
  }, 500),
);

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

function joinedGroupList(page) {
  axios({
    url: `/api/groups/joined/list/${page}`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(function (res) {
      res.data.forEach((group) => {
        let temp_html = `          <!-- USER PREVIEW -->
        <div class="user-preview small">
          <!-- USER PREVIEW COVER -->
          <figure class="user-preview-cover liquid">
            <img src="/backgroundImage/${group.backgroundImage}" alt="${group.backgroundImage}">
          </figure>
          <!-- /USER PREVIEW COVER -->
      
          <!-- USER PREVIEW INFO -->
          <div class="user-preview-info">
      
            <!-- USER SHORT DESCRIPTION -->
            <div class="user-short-description small">
              <!-- USER SHORT DESCRIPTION AVATAR -->
              <a class="user-short-description-avatar user-avatar no-stats">
                <!-- USER AVATAR BORDER -->
                <div class="user-avatar-border">
                  <!-- HEXAGON -->
                  <div class="hexagon-100-108"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR BORDER -->
            
                <!-- USER AVATAR CONTENT -->
                <div class="user-avatar-content">
                  <!-- HEXAGON -->
                  <div class="hexagon-image-84-92" data-src="/groupImage/${group.groupImage}"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->
              </a>
              <!-- /USER SHORT DESCRIPTION AVATAR -->
        
              <!-- USER SHORT DESCRIPTION TITLE -->
              <p class="user-short-description-title"><a href="/group/timeline?groupId=${group.groupId}">${group.groupName}</a></p>
              <!-- /USER SHORT DESCRIPTION TITLE -->
        
              <!-- USER SHORT DESCRIPTION TEXT -->
              <p class="user-short-description-text">${group.description}</p>
              <!-- /USER SHORT DESCRIPTION TEXT -->
            </div>
            <!-- /USER SHORT DESCRIPTION -->
      
            <!-- USER PREVIEW ACTIONS -->
            <div class="user-preview-actions">
              <!-- BUTTON -->
              <p class="button white white-tertiary" onclick="withdrawalGroup(${group.groupId}, '${group.groupName}')">
                <!-- BUTTON ICON -->
                <svg class="button-icon icon-leave-group">
                  <use xlink:href="#svg-leave-group"></use>
                </svg>
                그룹 탈퇴
                <!-- /BUTTON ICON -->
              </p>
              <!-- /BUTTON -->
            </div>
            <!-- /USER PREVIEW ACTIONS -->
          </div>
          <!-- /USER PREVIEW INFO -->
      
          <!-- USER PREVIEW FOOTER -->
          <div class="user-preview-footer padded">
            <!-- USER PREVIEW AUTHOR -->
            <div class="user-preview-author">
              <!-- USER PREVIEW AUTHOR IMAGE -->
              <a class="user-preview-author-image user-avatar micro no-border">
                <!-- USER AVATAR CONTENT -->
                <div class="user-avatar-content">
                  <!-- HEXAGON -->
                  <div class="hexagon-image-18-20" data-src="/userImage/${group.leaderImage}"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->
              </a>
              <!-- /USER PREVIEW AUTHOR IMAGE -->
      
              <!-- USER PREVIEW AUTHOR TITLE -->
              <p class="user-preview-author-title">그룹장</p>
              <!-- /USER PREVIEW AUTHOR TITLE -->
      
              <!-- USER PREVIEW AUTHOR TEXT -->
              <p class="user-preview-author-text"><a href="profile-timeline.html">${group.leader}</a></p>
              <!-- /USER PREVIEW AUTHOR TEXT -->
            </div>
            <!-- /USER PREVIEW AUTHOR -->
          </div>
          <!-- /USER PREVIEW FOOTER -->
        </div>
        <!-- /USER PREVIEW -->`;
        $('.joinedlist').append(temp_html);
      });
      const js = `<!-- global.hexagons -->
      <script src="/js/global/global.hexagons.js"></script><script src="/js/utils/liquidify.js"></script>`;
      $('#script').append(js);
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

function withdrawalGroup(groupId, groupName) {
  Swal.fire({
    text: `${groupName}을 탈퇴하시겠습니까?`,
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
        url: `/api/groups/${groupId}/withdraw`,
        method: 'delete',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(function (res) {
          Swal.fire({
            icon: 'success',
            text: `${groupName}을 탈퇴하였습니다.`,
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
  });
}
