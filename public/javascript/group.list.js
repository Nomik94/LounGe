$(document).ready(function () {
  getGroupList();
});

async function getGroupList() {
  axios({
    url: '/api/groups',
    method: 'get',
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoic3NzZXMyQG5hdmVyLmNvbSIsImlhdCI6MTY3ODE3MjUwMywiZXhwIjoxNjc4MTc2MTAzfQ.RsJOKh3MZwUe6UT7Z-j_hjka9l82Mjdng_ouDagOvoo`,
    },
  })
    .then(function (res) {
      res.data.forEach((data) => {
        let temp_html = `      <!-- USER PREVIEW -->
        <div class="user-preview">
          <!-- USER PREVIEW COVER -->
          <figure class="user-preview-cover liquid">
          <img src="/backgroundImage/${data.backgroundImage}" alt="backgroundImage-${data.id}">
          </figure>
          <!-- /USER PREVIEW COVER -->
      
          <!-- USER PREVIEW INFO -->
          <div class="user-preview-info">
            <!-- USER SHORT DESCRIPTION -->
            <div class="user-short-description">
              <!-- USER SHORT DESCRIPTION AVATAR -->
              <a class="user-short-description-avatar user-avatar medium no-stats" href="group-timeline.html">
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
                  <div class="hexagon-image-100-110" data-src="/groupImage/${data.groupImage}"></div>
                  <!-- /HEXAGON -->
                </div>
                <!-- /USER AVATAR CONTENT -->
              </a>
              <!-- /USER SHORT DESCRIPTION AVATAR -->
        
              <!-- USER SHORT DESCRIPTION TITLE -->
              <p class="user-short-description-title"><a href="group-timeline.html">${data.groupName}</a></p>
              <!-- /USER SHORT DESCRIPTION TITLE -->
        
              <!-- USER SHORT DESCRIPTION TEXT -->
              <p class="user-short-description-text">${data.description}</p>
              <!-- /USER SHORT DESCRIPTION TEXT -->
  
              <!-- USER SHORT DESCRIPTION TEXT -->
              <p class="user-short-description-text">Tag : ${data.tagGroups}</p>
              <!-- /USER SHORT DESCRIPTION TEXT -->
            </div>
            <!-- /USER SHORT DESCRIPTION -->
      
            <!-- USER STATS -->
            <div class="user-stats">
              <!-- USER STAT -->
              <div class="user-stat">
                <!-- USER STAT TITLE -->
                <p class="user-stat-title">23k</p>
                <!-- /USER STAT TITLE -->
        
                <!-- USER STAT TEXT -->
                <p class="user-stat-text">members</p>
                <!-- /USER STAT TEXT -->
              </div>
              <!-- /USER STAT -->
        
            </div>
            <!-- /USER STATS -->
      
            <!-- USER PREVIEW ACTIONS -->
            <div class="user-preview-actions">
              <!-- BUTTON -->
              <p class="button secondary full" onclick="joinGroup(${data.id},'${data.groupName}')">
                <!-- BUTTON ICON -->
                <svg class="button-icon icon-join-group">
                  <use xlink:href="#svg-join-group"></use>
                </svg>
                <!-- /BUTTON ICON -->
                소모임 가입하기
              </p>
              <!-- /BUTTON -->
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
    })
    .error();
}

function joinGroup(groupId, groupName) {
  Swal.fire({
    text: `${groupName}에 가입을 신청하시겠습니까?`,
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
        url: `/api/groups/join/${groupId}`,
        method: 'post',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoic3NzZXMyQG5hdmVyLmNvbSIsImlhdCI6MTY3ODE3MjUwMywiZXhwIjoxNjc4MTc2MTAzfQ.RsJOKh3MZwUe6UT7Z-j_hjka9l82Mjdng_ouDagOvoo`,
        },
      })
        .then(function (res) {
          Swal.fire({
            icon: 'success',
            text: `${groupName}에 가입 신청이 완료되었습니다.`,
          });
        })
        .error();
    }
  });
}
