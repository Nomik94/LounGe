let page = 1;
$(document).ready(async function () {
  await restoreToken();

  getGroupList(page);
});
history.pushState(null, null, `/groups/joinRequest?page=${page}`);

async function limitscroll() {
  if (window.location.href.split('?')[1].split('=')[0] !== 'page') return;
  page++;
  history.pushState(null, null, `/groups/joinRequest?page=${page}`);
  getGroupList(page);
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

async function getGroupList(page) {
  axios({
    url: `/api/groups/joined/requests/${page}`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(function (res) {
      if (res.data.length < 9) {
        document.getElementById('loader').innerHTML = '';
      }
      groupList(res.data);
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

async function groupList(list) {
  list.forEach((data) => {
    let temp_html = `      <!-- USER PREVIEW -->
    <div class="user-preview">
      <!-- USER PREVIEW COVER -->
      <figure class="user-preview-cover liquid">
      <img src="https://lounges3.s3.ap-northeast-2.amazonaws.com/${
        data.backgroundImage
      }" alt="backgroundImage-${data.id}">
      </figure>
      <!-- /USER PREVIEW COVER -->

      <!-- USER PREVIEW INFO -->
      <div class="user-preview-info">
        <!-- USER SHORT DESCRIPTION -->
        <div class="user-short-description">
          <!-- USER SHORT DESCRIPTION AVATAR -->
          <a class="user-short-description-avatar user-avatar medium no-stats" href="/group/timeline?groupId=${
            data.id
          }">
            <!-- USER AVATAR BORDER -->
            <div class="user-avatar-border">
              <!-- HEXAGON -->
              <div class="hexagon-120-130"></div>
              <!-- /HEXAGON -->
            </div>
            <!-- /USER AVATAR BORDER -->
  
            <!-- USER AVATAR CONTENT -->
            <div class="user-avatar-content">
              <!-- HEXAGON -->
              <div class="hexagon-image-100-110" data-src="https://lounges3.s3.ap-northeast-2.amazonaws.com/${
                data.groupImage
              }"></div>
              <!-- /HEXAGON -->
            </div>
            <!-- /USER AVATAR CONTENT -->
          </a>
          <!-- /USER SHORT DESCRIPTION AVATAR -->
    
          <!-- USER SHORT DESCRIPTION TITLE -->
          <p class="user-short-description-title"><a href="/group/timeline?groupId=${
            data.id
          }">${data.groupName}</a></p>
          <!-- /USER SHORT DESCRIPTION TITLE -->
    
          <!-- USER SHORT DESCRIPTION TEXT -->
          <p class="user-short-description-text">${data.description}</p>
          <!-- /USER SHORT DESCRIPTION TEXT -->
          
        </div>
        <!-- /USER SHORT DESCRIPTION -->
  
        <!-- USER STATS -->
        <div class="user-stats" style="height: 100px;">

        <!-- TAG LIST -->
          <div class="tag-list">
            ${data.tagGroups
              .map(
                (tag) =>
                  `<a class="tag-item secondary">${tag}</a>`,
              )
              .join('')}
          </div>
        <!-- /TAG LIST -->
        </div>
        <!-- /USER STATS -->
  
        <!-- USER PREVIEW ACTIONS -->
        <div class="user-preview-actions">
        </div>
        <!-- /USER PREVIEW ACTIONS -->
      </div>
      <!-- /USER PREVIEW INFO -->
    </div>
    <!-- /USER PREVIEW -->`;
    $('#groupList').append(temp_html);
  });
  const js = `<!-- global.hexagons -->
  <script src="/js/global/global.hexagons.js"></script><script src="/js/utils/liquidify.js"></script>`;
  $('#groupjs').append(js);
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