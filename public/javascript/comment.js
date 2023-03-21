$(document).ready(async function () {
  await restoreToken();
  const newsfeedId = await JSON.parse(localStorage.getItem('newsfeedId'));
  getCommentList(newsfeedId);
});
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

async function getCommentList(newsfeedId) {
  axios({
    url: `/api/comment/${newsfeedId}`,
    method: 'get',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  }).then((res) => {
    const commentList = res.data;
    commentList.forEach((data) => {
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
            <p class='forum-post-action'>수정</p>
            <!-- /FORUM POST ACTION -->

            <!-- FORUM POST ACTION -->
            <p class='forum-post-action'>삭제</p>
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
    });
    const js = `<!-- global.hexagons -->
    <script src="/js/global/global.hexagons.js"></script>
    <script src="/js/utils/liquidify.js"></script>`;
    $('#commentjs').append(js);
  });
}
