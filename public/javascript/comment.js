let page = 1;
$(document).ready(async function () {
  await restoreToken();
  const newsfeedId = await JSON.parse(localStorage.getItem('newsfeedId'));
  getCommentList(newsfeedId, page);
  const createButton = `<!-- BUTTON -->
  <p class='button secondary' onclick="createContent(${newsfeedId})">댓글 달기</p>
  <!-- /BUTTON -->`;
  $('#createButton').append(createButton);
});

async function limitscroll() {
  page++;
  const newsfeedId = await JSON.parse(localStorage.getItem('newsfeedId'));
  getCommentList(newsfeedId, page);
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

async function createContent(newsfeedId) {
  const content = document.getElementById('forum-post-text').value;
  if (!content) {
    await Swal.fire({
      icon: 'error',
      text: `내용을 입력해주세요.`,
    });
  } else {
    axios({
      url: `/api/comment/${newsfeedId}`,
      method: 'post',
      headers: {
        Authorization: `${getCookie('accessToken')}`,
      },
      data: { content },
    })
      .then(async (res) => {
        await Swal.fire({
          icon: 'success',
          text: `댓글이 생성되었습니다.`,
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

async function modifyComment(newsfeedId, commentId) {
  const content = document.getElementById('commentContent').value;
  if (!content) {
    await Swal.fire({
      icon: 'error',
      text: `내용을 입력해주세요.`,
    });
  } else {
    axios({
      url: `/api/comment/${newsfeedId}/${commentId}`,
      method: 'put',
      headers: {
        Authorization: `${getCookie('accessToken')}`,
      },
      data: { content },
    })
      .then(async (res) => {
        await Swal.fire({
          icon: 'success',
          text: `댓글이 수정되었습니다.`,
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

async function deleteComment(newsfeedId, commentId) {
  await Swal.fire({
    text: `댓글을 삭제하시겠습니까?`,
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
        url: `/api/comment/${newsfeedId}/${commentId}`,
        method: 'delete',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(async (res) => {
          await Swal.fire({
            icon: 'success',
            text: `댓글이 삭제되었습니다.`,
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

async function getCommentList(newsfeedId, page) {
  axios({
    url: `/api/comment/${newsfeedId}/${page}`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  }).then(async (res) => {
    if (res.data.comment.length < 9) {
      document.getElementById('loader').innerHTML = '';
    }
    const comment = res.data.comment;
    const userId = res.data.user.id;
    await getComment(comment, userId, newsfeedId);
  });
}

async function getComment(data, userId, newsfeedId) {
  console.log(data);
  data.forEach((data) => {
    console.log(data.user.id);
    const createDate = new Date(data.createdAt);
    const timeOptions = {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    };
    const createDateFormat = createDate.toLocaleDateString(
      'Ko-KR',
      timeOptions,
    );
    if (userId === data.user.id) {
      let temp_html = `   <!-- FORUM POST -->
      <div class='forum-post' >
        <!-- FORUM POST META -->
        <div class='forum-post-meta'>
          <!-- FORUM POST TIMESTAMP -->
          <p class='forum-post-timestamp'>${createDateFormat}</p>
          <!-- /FORUM POST TIMESTAMP -->

          <!-- FORUM POST ACTIONS -->
          <div class='forum-post-actions'>
            <!-- FORUM POST ACTION -->
            <p class='forum-post-action popup-manage-group-trigger-1' onclick="modifyCommentButton(${newsfeedId},${data.id})">수정</p>
            <!-- /FORUM POST ACTION -->

            <!-- FORUM POST ACTION -->
            <p class='forum-post-action' onclick="deleteComment(${newsfeedId},${data.id})">삭제</p>
            <!-- /FORUM POST ACTION -->
          </div>
          <!-- /FORUM POST ACTIONS -->
        </div>
        <!-- /FORUM POST META -->

        <!-- FORUM POST CONTENT -->
        <div class='forum-post-content'>
          <!-- FORUM POST USER -->
          <div class='forum-post-user'>
            <!-- USER AVATAR -->
            <a
              class='user-avatar no-outline'
            >
              <!-- USER AVATAR CONTENT -->
              <div class='user-avatar-content'>
                <!-- HEXAGON -->
                <div
                  class='hexagon-image-68-74'
                  data-src='https://lounges3.s3.ap-northeast-2.amazonaws.com/${data.user.image}'
                ></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->

              <!-- USER AVATAR PROGRESS -->
              <div class='user-avatar-progress'>
                <!-- HEXAGON -->
                <div class='hexagon-progress-84-92'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS -->

              <!-- USER AVATAR PROGRESS BORDER -->
              <div class='user-avatar-progress-border'>
                <!-- HEXAGON -->
                <div class='hexagon-border-84-92'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS BORDER -->
            </a>
            <!-- /USER AVATAR -->

            <!-- USER AVATAR -->
            <a
              class='user-avatar small no-outline'
            >
              <!-- USER AVATAR CONTENT -->
              <div class='user-avatar-content'>
                <!-- HEXAGON -->
                <div
                  class='hexagon-image-30-32'
                  data-src='https://lounges3.s3.ap-northeast-2.amazonaws.com/${data.user.image}'
                ></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->

              <!-- USER AVATAR PROGRESS -->
              <div class='user-avatar-progress'>
                <!-- HEXAGON -->
                <div class='hexagon-progress-40-44'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS -->

              <!-- USER AVATAR PROGRESS BORDER -->
              <div class='user-avatar-progress-border'>
                <!-- HEXAGON -->
                <div class='hexagon-border-40-44'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS BORDER -->
            </a>
            <!-- /USER AVATAR -->

            <!-- FORUM POST USER TITLE -->
            <p class='forum-post-user-title'>
              ${data.user.username}
            </p>
            <!-- /FORUM POST USER TITLE -->
          </div>
          <!-- /FORUM POST USER -->

          <!-- FORUM POST INFO -->
          <div class='forum-post-info'>
            <!-- FORUM POST PARAGRAPH -->
            <p class='forum-post-paragraph'>
              ${data.content}
            </p>
            <!-- /FORUM POST PARAGRAPH -->
          </div>
          <!-- /FORUM POST INFO -->
        </div>
        <!-- /FORUM POST CONTENT -->
      </div>
      <!-- /FORUM POST -->`;
      $('#commentList').append(temp_html);
    } else {
      let temp_html = `   <!-- FORUM POST -->
      <div class='forum-post' >
        <!-- FORUM POST META -->
        <div class='forum-post-meta'>
          <!-- FORUM POST TIMESTAMP -->
          <p class='forum-post-timestamp'>${createDateFormat}</p>
          <!-- /FORUM POST TIMESTAMP -->

          <!-- FORUM POST ACTIONS -->
          <div class='forum-post-actions'>
            
          </div>
          <!-- /FORUM POST ACTIONS -->
        </div>
        <!-- /FORUM POST META -->

        <!-- FORUM POST CONTENT -->
        <div class='forum-post-content'>
          <!-- FORUM POST USER -->
          <div class='forum-post-user'>
            <!-- USER AVATAR -->
            <a
              class='user-avatar no-outline'
            >
              <!-- USER AVATAR CONTENT -->
              <div class='user-avatar-content'>
                <!-- HEXAGON -->
                <div
                  class='hexagon-image-68-74'
                  data-src='https://lounges3.s3.ap-northeast-2.amazonaws.com/${data.user.image}'
                ></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->

              <!-- USER AVATAR PROGRESS -->
              <div class='user-avatar-progress'>
                <!-- HEXAGON -->
                <div class='hexagon-progress-84-92'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS -->

              <!-- USER AVATAR PROGRESS BORDER -->
              <div class='user-avatar-progress-border'>
                <!-- HEXAGON -->
                <div class='hexagon-border-84-92'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS BORDER -->
            </a>
            <!-- /USER AVATAR -->

            <!-- USER AVATAR -->
            <a
              class='user-avatar small no-outline'
            >
              <!-- USER AVATAR CONTENT -->
              <div class='user-avatar-content'>
                <!-- HEXAGON -->
                <div
                  class='hexagon-image-30-32'
                  data-src='https://lounges3.s3.ap-northeast-2.amazonaws.com/${data.user.image}'
                ></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->

              <!-- USER AVATAR PROGRESS -->
              <div class='user-avatar-progress'>
                <!-- HEXAGON -->
                <div class='hexagon-progress-40-44'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS -->

              <!-- USER AVATAR PROGRESS BORDER -->
              <div class='user-avatar-progress-border'>
                <!-- HEXAGON -->
                <div class='hexagon-border-40-44'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS BORDER -->
            </a>
            <!-- /USER AVATAR -->

            <!-- FORUM POST USER TITLE -->
            <p class='forum-post-user-title'>
              ${data.user.username}
            </p>
            <!-- /FORUM POST USER TITLE -->
          </div>
          <!-- /FORUM POST USER -->

          <!-- FORUM POST INFO -->
          <div class='forum-post-info'>
            <!-- FORUM POST PARAGRAPH -->
            <p class='forum-post-paragraph'>
              ${data.content}
            </p>
            <!-- /FORUM POST PARAGRAPH -->
          </div>
          <!-- /FORUM POST INFO -->
        </div>
        <!-- /FORUM POST CONTENT -->
      </div>
      <!-- /FORUM POST -->`;
      $('#commentList').append(temp_html);
    }
  });

  const js = `<!-- global.hexagons -->
    <script src="/js/global/global.hexagons.js"></script>
    <script src="/js/utils/liquidify.js"></script>
    <!-- global.accordions -->
    <script src="/js/global/global.accordions.js"></script>
    <!-- global.popups -->
    <script src="/js/global/global.popups.js"></script>`;
  $('#commentjs').append(js);
}

async function modifyCommentButton(newsfeedId, commentId) {
  document
    .getElementById('modifyButton')
    .setAttribute('onClick', `modifyComment(${newsfeedId},${commentId})`);
}
