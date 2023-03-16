$(document).ready(function () {
  const accessToken = getCookie('accessToken');

  if (accessToken) {
    getUserImageAndUsername();
  }
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

function getUserImageAndUsername() {
  const accessToken = getCookie('accessToken');

  axios({
    url: '/api/user/select',
    method: 'get',
    headers: {
      Authorization: `${accessToken}`,
    },
  }).then((res) => {
    let fullSideBar_html = `  <!-- HEXAGON -->
    <div class="hexagon-image-30-32" data-src="/userImage/${res.data.image}"></div> <!--유저 이미지 뿌려주기-->
    <!-- /HEXAGON -->`;
    let buttonSideBar_html = `<!-- HEXAGON -->
    <div class="hexagon-image-82-90" data-src="/userImage/${res.data.image}"></div><!--유저 이미지 뿌려주기-->
    <!-- /HEXAGON -->`;
    let mobileSideBar_html = `  <!-- USER AVATAR -->
    <a class="user-avatar small no-outline">
      <!-- USER AVATAR CONTENT -->
      <div class="user-avatar-content" id="mobileSideBar">
        <!-- HEXAGON -->
        <div class="hexagon-image-30-32" data-src="/userImage/${res.data.image}"></div> <!--유저 이미지 뿌려주기-->
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
  
    </a>
    <!-- /USER AVATAR -->

    <!-- NAVIGATION WIDGET INFO TITLE -->
    <p class="navigation-widget-info-title">${res.data.username}</p> <!-- 유저 이름 -->
    <!-- /NAVIGATION WIDGET INFO TITLE -->

    <!-- NAVIGATION WIDGET INFO TEXT -->
    <p class="navigation-widget-info-text">LounGe</p>
    <!-- /NAVIGATION WIDGET INFO TEXT -->`;
    let dropDownBar_html = `<!-- USER STATUS AVATAR -->
    <a class="user-status-avatar" href="/profile/info">
      <!-- USER AVATAR -->
      <div class="user-avatar small no-outline">
        <!-- USER AVATAR CONTENT -->
        <div class="user-avatar-content" >
          <!-- HEXAGON -->
<div class="hexagon-image-30-32" data-src="/userImage/${res.data.image}"></div><!-- 유저 이미지 뿌리기-->
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
      <p class="user-status-title"><span class="bold">${res.data.username}</span></p>
      <!-- /USER STATUS TITLE -->
  
      <!-- USER STATUS TEXT -->
      <p class="user-status-text small"><a href="/profile/info">LounGe</a></p>
      <!-- /USER STATUS TEXT -->`;
    $('#fullSideBar').append(fullSideBar_html);
    $('#buttonSideBar').append(buttonSideBar_html);
    $('#mobileSideBar').append(mobileSideBar_html);
    $('#dropDownBar').append(dropDownBar_html);
  });
}
