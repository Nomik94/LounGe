let page = 1

$(document).ready(async function () {
  await restoreToken();
  leaderGroupList(page);
});
async function limitscroll() {
  page++;
  leaderGroupList(page);
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
function createGroup() {
  const groupName = document.getElementById('groupName').value;
  const groupDescription = document.getElementById('groupDescription').value;
  const groupTags = document.getElementById('groupTags').value;
  const groupImage = document.getElementById('groupImage').files[0];
  const backgroundImage = document.getElementById('backgroundImage').files[0];

  const formData = new FormData();
  formData.append('groupName', groupName);
  formData.append('description', groupDescription);
  formData.append('tag', groupTags);
  formData.append('groupImage', groupImage);
  formData.append('backgroundImage', backgroundImage);

  axios({
    url: `/api/groups`,
    method: 'post',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
    data: formData,
  })
    .then(async function (res) {
      await Swal.fire({
        icon: 'success',
        text: `그룹이 생성되었습니다.`,
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

function leaderGroupList(page) {
  axios({
    url: `/api/groups/created/list/${page}`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(function (res) {
      res.data.forEach((data) => {
        let temp_html = `          <!-- USER PREVIEW -->
        <div class="user-preview small fixed-height-medium">
          <!-- USER PREVIEW COVER -->
          <figure class="user-preview-cover liquid">
            <img src="https://lounges3.s3.ap-northeast-2.amazonaws.com/${data.backgroundImage}" alt="${data.backgroundImage}">
          </figure>
          <!-- /USER PREVIEW COVER -->

          <!-- USER PREVIEW INFO -->
          <div class="user-preview-info">
            <!-- USER SHORT DESCRIPTION -->
            <div class="user-short-description small">
              <!-- USER SHORT DESCRIPTION AVATAR -->
              <a class="user-short-description-avatar user-avatar no-stats" href="/group/timeline?groupId=${data.id}">
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
                  <div class="hexagon-image-84-92" data-src="https://lounges3.s3.ap-northeast-2.amazonaws.com/${data.groupImage}"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->
              </a>
              <!-- /USER SHORT DESCRIPTION AVATAR -->
        
              <!-- USER SHORT DESCRIPTION TITLE -->
              <p class="user-short-description-title small"><a href="/group/timeline?groupId=${data.id}">${data.groupName}</a></p>
              <!-- /USER SHORT DESCRIPTION TITLE -->
        
              <!-- USER SHORT DESCRIPTION TEXT -->
              <p class="user-short-description-text regular">${data.description}</p>
              <!-- /USER SHORT DESCRIPTION TEXT -->
            </div>
            <!-- /USER SHORT DESCRIPTION -->

            <!-- BUTTON -->
            <p class="button white full" onclick="window.location.href='/group/management/members?groupId=${data.id}'">그룹 관리</p>
            <!-- /BUTTON -->
          </div>
          <!-- /USER PREVIEW INFO -->
        </div>
        <!-- /USER PREVIEW -->`;
        $('.leader').append(temp_html);
      });
      const js = `
      <script src="/js/global/global.hexagons.js"></script>
      <script src="/js/utils/liquidify.js"></script>`;
      $('#groupjs').append(js);
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
