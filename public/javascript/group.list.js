$(document).ready(function () {
  getGroupList();
});

function getGroupList() {
  axios({
    url: '/api/groups',
    method: 'get',
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoic3NzZXMxQG5hdmVyLmNvbSIsImlhdCI6MTY3ODE1NTM5OCwiZXhwIjoxNjc4MTU4OTk4fQ.GevlGJuWZ7i9kAceQzj98IB3vvSnRNbHce00K-PZ8vw`,
    },
  })
    .then(function (res) {
      console.log(res.data);
      res.data.forEach((data) => {
        let temp_html = `      <!-- USER PREVIEW -->
      <div class="user-preview">
        <!-- USER PREVIEW COVER -->
        <figure class="user-preview-cover liquid">
          <img src="/backgroundImage/${data.backgroundImage}" alt="backgroundImage">
        </figure>
        <!-- /USER PREVIEW COVER -->
    
        <!-- USER PREVIEW INFO -->
        <div class="user-preview-info">
          <!-- TAG STICKER -->
          <div class="tag-sticker">
            <!-- TAG STICKER ICON -->
            <svg class="tag-sticker-icon icon-private">
              <use xlink:href="#svg-private"></use>
            </svg>
            <!-- /TAG STICKER ICON -->
          </div>
          <!-- /TAG STICKER -->
    
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
                <!-- HEXAGON 그룹이미지 -->
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
            <p class="user-short-description-text">${data.groupImage}</p>
            <!-- /USER SHORT DESCRIPTION TEXT -->
          </div>
          <!-- /USER SHORT DESCRIPTION -->
    
          <!-- USER STATS -->
          <div class="user-stats">
            <!-- USER STAT -->
            <div class="user-stat">
              <!-- USER STAT TITLE -->
              <p class="user-stat-title">멤버수</p>
              <!-- /USER STAT TITLE -->
      
              <!-- USER STAT TEXT -->
              <p class="user-stat-text">members</p>
              <!-- /USER STAT TEXT -->
            </div>
            <!-- /USER STAT -->
      
            <!-- USER STAT -->
            <div class="user-stat">
              <!-- USER STAT TITLE -->
              <p class="user-stat-title">게시물수</p>
              <!-- /USER STAT TITLE -->
      
              <!-- USER STAT TEXT -->
              <p class="user-stat-text">posts</p>
              <!-- /USER STAT TEXT -->
            </div>
            <!-- /USER STAT -->

          </div>
          <!-- /USER STATS -->
    
          <!-- USER AVATAR LIST -->
          <div class="user-avatar-list medium reverse centered">
            <!-- USER AVATAR -->
            <div class="user-avatar smaller no-stats">
              <!-- USER AVATAR BORDER -->
              <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-34-36"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR BORDER -->
          
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="img/avatar/07.jpg"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
            </div>
            <!-- /USER AVATAR -->
            
            <!-- USER AVATAR -->
            <div class="user-avatar smaller no-stats">
              <!-- USER AVATAR BORDER -->
              <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-34-36"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR BORDER -->
          
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="img/avatar/13.jpg"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
            </div>
            <!-- /USER AVATAR -->
    
            <!-- USER AVATAR -->
            <div class="user-avatar smaller no-stats">
              <!-- USER AVATAR BORDER -->
              <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-34-36"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR BORDER -->
          
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="img/avatar/08.jpg"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
            </div>
            <!-- /USER AVATAR -->
    
            <!-- USER AVATAR -->
            <div class="user-avatar smaller no-stats">
              <!-- USER AVATAR BORDER -->
              <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-34-36"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR BORDER -->
          
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="img/avatar/16.jpg"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
            </div>
            <!-- /USER AVATAR -->
    
            <!-- USER AVATAR -->
            <div class="user-avatar smaller no-stats">
              <!-- USER AVATAR BORDER -->
              <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-34-36"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR BORDER -->
          
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="img/avatar/23.jpg"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
            </div>
            <!-- /USER AVATAR -->
    
            <!-- USER AVATAR -->
            <a class="user-avatar smaller no-stats" href="group-members.html">
              <!-- USER AVATAR BORDER -->
              <div class="user-avatar-border">
                <!-- HEXAGON -->
                <div class="hexagon-34-36"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR BORDER -->
          
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="img/avatar/11.jpg"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
          
              <!-- USER AVATAR OVERLAY -->
              <div class="user-avatar-overlay">
                <!-- HEXAGON -->
                <div class="hexagon-overlay-30-32"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR OVERLAY -->
          
              <!-- USER AVATAR OVERLAY CONTENT -->
              <div class="user-avatar-overlay-content">
                <!-- USER AVATAR OVERLAY CONTENT TEXT -->
                <p class="user-avatar-overlay-content-text">+260</p>
                <!-- /USER AVATAR OVERLAY CONTENT TEXT -->
              </div>
              <!-- /USER AVATAR OVERLAY CONTENT -->
            </a>
            <!-- /USER AVATAR -->
          </div>
          <!-- /USER AVATAR LIST -->
    
          <!-- USER PREVIEW ACTIONS -->
          <div class="user-preview-actions">
            <!-- BUTTON -->
            <p class="button secondary full">
              <!-- BUTTON ICON -->
              <svg class="button-icon icon-join-group">
                <use xlink:href="#svg-join-group"></use>
              </svg>
              <!-- /BUTTON ICON -->
              소모임 가입하기!
            </p>
            <!-- /BUTTON -->
          </div>
          <!-- /USER PREVIEW ACTIONS -->
        </div>
        <!-- /USER PREVIEW INFO -->
      </div>
      <!-- /USER PREVIEW -->`
      })
    })
    .error();
}
