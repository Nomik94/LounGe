$(document).ready(function () {
  getGroupList();
});

function getGroupList() {
  axios({
    url: '/api/groups',
    method: 'get',
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoic3NzZXMyQG5hdmVyLmNvbSIsImlhdCI6MTY3ODE1NzY4OCwiZXhwIjoxNjc4MTYxMjg4fQ.xg4seM60S75WLcFd9vpKbYcnaFiGxhrUAbPN3HPsmAw`,
    },
  })
    .then(function (res) {
      console.log(res.data);
      res.data.forEach((data) => {
        console.log(data.groupImage)
        let temp_html = `<!-- USER PREVIEW -->
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
                        <!-- /USER PREVIEW -->`;
        $('#groupList').append(temp_html);
      });
    })
    .error();
}
