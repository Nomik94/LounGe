let selectedTags = [];
let selectedImages = [];

// 유저 쿠키
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

// 뉴스피드 리스트 불러와서 뿌려주기
async function newsfeedlist(data) {
  data.forEach((data) => {
    const creadteDate = new Date(data.createAt);
    const timeOptions = {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    };
    const creadteDateFormat = creadteDate.toLocaleDateString(
      'Ko-KR',
      timeOptions,
    );
    let temp_html = `
    <br>
    <div class="widget-box no-padding">
    <!-- WIDGET BOX SETTINGS -->
    <div class="widget-box-settings">
      <!-- POST SETTINGS WRAP -->
      <div class="post-settings-wrap">



        <!-- SIMPLE DROPDOWN -->
        <div class="simple-dropdown widget-box-post-settings-dropdown" style="width:60px">
          <!-- SIMPLE DROPDOWN LINK -->
          <p class="simple-dropdown-link" onclick="modifyNewsfeed(${
            data.id
          })">수정</p>
          <!-- /SIMPLE DROPDOWN LINK -->

          <!-- SIMPLE DROPDOWN LINK -->
          <p class="simple-dropdown-link" onclick="deleteNewsfeed(${
            data.id
          })">삭제</p>
          <!-- /SIMPLE DROPDOWN LINK -->

        </div>
        <!-- /SIMPLE DROPDOWN -->
      </div>
      <!-- /POST SETTINGS WRAP -->
    </div>
    <!-- /WIDGET BOX SETTINGS -->
    
    <!-- WIDGET BOX STATUS -->
    <div class="widget-box-status">
      <!-- WIDGET BOX STATUS CONTENT -->
      <div class="widget-box-status-content">
        <!-- USER STATUS -->
        <div class="user-status">
          <!-- USER STATUS AVATAR -->
          <a class="user-status-avatar" >
            <!-- USER AVATAR -->
            <div class="user-avatar small no-outline">
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="https://lounges3.s3.ap-northeast-2.amazonaws.com/${
                  data.userImage
                }"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
          
              <!-- USER AVATAR PROGRESS -->
              <div class="user-avatar-progress">
                <!-- HEXAGON -->
                <div class="hexagon-image-40-44" data-src="https://lounges3.s3.ap-northeast-2.amazonaws.com/${
                  data.userImage
                }"></div>
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
          <p class="user-status-title medium"><a class="bold" >${
            data.userName
          }</a>님의 뉴스피드</p>
          <!-- /USER STATUS TITLE -->

          <!-- USER STATUS TEXT -->
          <a href="/group/timeline?groupId=${
            data.groupId
          }"><p class="user-status-text middle">${data.groupName}</p></a>
          <!-- /USER STATUS TEXT -->
      
          <!-- USER STATUS TEXT -->
          <p class="user-status-text small">${creadteDateFormat}</p>
          <!-- /USER STATUS TEXT -->
        </div>
        <!-- /USER STATUS -->

        <!-- WIDGET BOX STATUS TEXT -->
        <p class="widget-box-status-text">${data.content}</p>
        <!-- /WIDGET BOX STATUS TEXT -->

        <div class="newsfeed-image">
        ${data.newsfeedImage
          .map(
            (image) => `
          <img class="popup-image" onclick="popupNewsfeed('${image}')" src="/newsfeedImage/${image}">
        `,
          )
          .join('')}
      </div>

        <!-- TAG LIST -->
          <div class="tag-list">
          ${data.tagsName
            .map(
              (tag) => `
          <a class="tag-item secondary" onclick="serchtag('${tag}')">${tag}</a>
          `,
            )
            .join('')}
          </div>
        <!-- /TAG LIST -->
      <br>

      </div>
      <!-- /WIDGET BOX STATUS CONTENT -->
    </div>
    <!-- /WIDGET BOX STATUS -->
  </div>`;
    $('#newsfeedbox').append(temp_html);
  });
  const asd = `
  <script src="/js/global/global.hexagons.js"></script>
  <script src="/js/utils/liquidify.js"></script>
  `;
  $('#ddd').append(asd);
}

// 뉴스피드 이미지 클릭시 이미지 팝업 띄워주기
function popupNewsfeed(src) {
  Swal.fire({
    imageUrl: `/newsfeedImage/${src}`,
  });
}

// 뉴스피드 삭제하기
async function deleteNewsfeed(newsfeedId) {
  await Swal.fire({
    title: '해당 뉴스피드를 지울까요?',
    text: '삭제된 뉴스피드는 복구되지 않습니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        method: 'Delete',
        url: `/api/newsfeed/newsfeed/${newsfeedId}`,
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(async (res) => {
          await Swal.fire({
            icon: 'success',
            title: '삭제되었습니다.',
            text: '태그 및 이미지도 삭제되었습니다.',
          });
          window.location.reload();
        })
        .catch(async (err) => {
          if (err.response.data.statusCode === 403) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'center-center',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            });
            await Toast.fire({
              icon: 'error',
              title: '뉴스피드 삭제 권한이 없습니다.',
            });
          } else if (err.response.data.statusCode === 401) {
            Swal.fire({
              icon: 'error',
              title: '로그인 정보가 없습니다.',
              text: '다시 로그인해 주세요.',
            });
          }
          Swal.fire({
            icon: 'error',
            text: `${err.response.data.message}`,
          });
        });
    }
  });
}

// 뉴스피드 목록 비우기
function clearnewsfeed() {
  $('#newsfeedbox').empty();
}

// 뉴스피드 수정하기
async function modifyNewsfeed(id) {
  let popupHtml =
    '<div id="popup" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px;">';
  popupHtml += '<h2>뉴스피드 수정하기</h2>';
  popupHtml += '<form>';
  popupHtml += '<label for="newsfeedcontent">내용:</label><br>';
  popupHtml +=
    '<textarea id="newsfeedcontent" name="newsfeedcontent" rows="4" cols="50"></textarea><br><br>';
  popupHtml += '<label for="tag">태그(태그는 ,로 구분합니다.)</label><br>';
  popupHtml += '<input type="text" id="tag" name="tag"><br><br>';
  popupHtml += '<label for="image">이미지(최대 5장):</label><br>';
  popupHtml +=
    '<input type="file" id="imageUpload" name="imageUpload" multiple>';
  popupHtml += '<input type="submit" value="수정">';
  popupHtml += '<button type="button" class="cancel">취소</button>';
  popupHtml += '</form>';
  popupHtml += '</div>';

  let popup = document.createElement('div');
  popup.innerHTML = popupHtml;
  document.body.appendChild(popup);

  popup.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const files = document.getElementById('imageUpload');
    selectedImages = files.files;

    const formData = new FormData();
    formData.append('content', newsfeedcontent.value);
    if (tag.value.length !== 0) {
      formData.append('newsfeedTags', tag.value);
    }
    if (selectedImages.length !== 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append('newsfeedImage', selectedImages[i]);
      }
    }
    if (!newsfeedcontent.value) {
      await Swal.fire({
        icon: 'error',
        title: '빈 내용은 작성할 수 없습니다!',
        text: '뭐라도 좋으니 내용을 입력해주세요 T^T',
      });
    } else if (selectedImages.length > 5) {
      await Swal.fire({
        icon: 'error',
        title: '사진은 최대 5장만 가능합니다.',
        text: '많은 추억을 저장하지 못해 죄송합니다 T^T',
      });
    }
    else {
      axios({
        url: `/api/newsfeed/newsfeed/${id}`,
        method: 'put',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
        data: formData,
      })
        .then(async (res) => {
          await Swal.fire({
            icon: 'success',
            title: '뉴스피드 수정 완료!',
            text: '잠시 후 새로고침 됩니다.',
          });
          window.location.reload();
        })
        .catch((err) => {
          if (err.response.data.statusCode === 400) {
            Swal.fire({
              icon: 'error',
              title: '사진은 최대 5장까지만 등록 가능합니다.',
              text: '죄송합니다.',
            });
          } else if (err.response.data.statusCode === 401) {
            Swal.fire({
              icon: 'error',
              title: '로그인 정보가 확인되지 않습니다.',
              text: '로그인 정보를 확인해 주세요.',
            });
          } else if (err.response.data.statusCode === 403) {
            Swal.fire({
              icon: 'error',
              title: '권한이 없습니다.',
            });
          }
          Swal.fire({
            icon: 'error',
            text: `${err.response.data.message}`,
          });
        });
    }
    document.body.removeChild(popup);
  });

  const cancelButton = popup.querySelector('.cancel');
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(popup);
  });
}

// 무한 스크롤 설정
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
