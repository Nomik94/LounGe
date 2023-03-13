$(document).ready(async function(){
  await restoreToken()
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');

  readnewsfeedgrouptimeline(groupId)
});

// 유저 쿠키 가져오기
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

// 특정 그룹의 뉴스피드 가져오기
function readnewsfeedgrouptimeline(id) {
  axios({
    method: 'get',
    url: `/api/newsfeed/group/${id}`,
  })
  .then(async(res) => {
   await newsfeedlist(res.data);
  })
  .catch(async(err) => {
    console.log(err);
    await Swal.fire({
      icon: 'error',
      title: '알수없는 이유로 실행되지 않았습니다.',
      text: "관리자에게 문의해 주세요.",
    })
  })
}

// 뉴스피드 불러오기
function newsfeedlist(data) {

  data.reverse().forEach((data) => {
    const creadteDate = new Date(data.createAt) 
    // const updateDate = new Date(data.updateAt)
    const timeOptions = {
      hour12: false,
      hour: "2-digit", 
      minute: "2-digit"
    }
    const creadteDateFormat = creadteDate.toLocaleDateString("Ko-KR",timeOptions)
    // const updateDateFormat = updateDate.toLocaleDateString("Ko-KR",timeOptions)
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
          <p class="simple-dropdown-link popup-modi-newsfeed-trigger" onclick="modinewsfeed(${data.id})">수정</p>
          <!-- /SIMPLE DROPDOWN LINK -->

          <!-- SIMPLE DROPDOWN LINK -->
          <p class="simple-dropdown-link" onclick="deletenewsfeed(${data.id})">삭제</p>
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
          <a class="user-status-avatar" href="profile-timeline.html">
            <!-- USER AVATAR -->
            <div class="user-avatar small no-outline">
              <!-- USER AVATAR CONTENT -->
              <div class="user-avatar-content">
                <!-- HEXAGON -->
                <div class="hexagon-image-30-32" data-src="/userImage/${
                  data.userImage
                }"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->
          
              <!-- USER AVATAR PROGRESS -->
              <div class="user-avatar-progress">
                <!-- HEXAGON -->
                <div class="hexagon-image-40-44" data-src=/userImage/${
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
          <p class="user-status-title medium"><a class="bold" href="profile-timeline.html">${data.userName}</a>님의 뉴스피드</p>
          <!-- /USER STATUS TITLE -->
      
          <!-- USER STATUS TEXT -->
          <p class="user-status-text small">${creadteDateFormat}</p>
          <!-- /USER STATUS TEXT -->
        </div>
        <!-- /USER STATUS -->

        <!-- WIDGET BOX STATUS TEXT -->
        <p class="widget-box-status-text">${data.content}</p>
        <!-- /WIDGET BOX STATUS TEXT -->
        
        <div class="hexagon-image-90-110-container">
        ${data.newsfeedImage.map(image => `
          <div class="hexagon-image-90-110" data-src="/newsfeedImages/${image}"></div>
        `).join('')}
      </div>

        <!-- TAG LIST -->
          <div class="tag-list">
          ${data.tagsName.map(tag => `
          <a class="tag-item secondary" onclick="serchtag('${tag}')">${tag}</a>
          `).join("")}
          </div>
        <!-- /TAG LIST -->
      <br>

      </div>
      <!-- /WIDGET BOX STATUS CONTENT -->
    </div>
    <!-- /WIDGET BOX STATUS -->
  </div>`;
  $('#newsfeedbox').append(temp_html)
  });
  const asd = `
  <script src="/js/global/global.hexagons.js"></script>
  <script src="/js/utils/liquidify.js"></script>
 `;
  $('#ddd').append(asd);
}

// 뉴스피드 목록 비우기
function clearnewsfeed(){
  $('#newsfeedbox').empty();
}

// 특정 그룹에서 뉴스피드 태그로 검색하기
function serchtag(tag) {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');

  const test = tag
    axios({
      method: 'Get',
      url: `/api/newsfeed/tag/${groupId}`,
      params: {
        tag:test
      },
    })
    .then(async (res) => {
      clearnewsfeed();
      newsfeedlist(res.data);
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: '알수없는 이유로 실행되지 않았습니다.',
        text: "관리자에게 문의해 주세요.",
      })
    })

}

// 뉴스피드 삭제하기
async function deletenewsfeed(newsfeedId) {
  await Swal.fire({
    title: '해당 뉴스피드를 지울까요?',
    text: "삭제된 뉴스피드는 복구되지 않습니다.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
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
          text: '태그 및 이미지도 삭제되었습니다.'
        })
        window.location.reload()
      })
      .catch(async (err) => {
        if(err.response.data.statusCode === 403) {
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
        }
        if(err.response.data.statusCode !== 403) {

          Swal.fire({
            icon: 'error',
            title: '알수없는 이유로 실행되지 않았습니다.',
            text: "관리자에게 문의해 주세요.",
          })
        }
      })
    }
  })
}

let selectedTags = [];
let selectedImages =[];

// 뉴스피드 작성하기
async function postnewsfeed() {
  const content = document.getElementById("quick-post-text").value;
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');
  const formData = new FormData();
  if(selectedTags.length !== 0) {
    formData.append('newsfeedTags', selectedTags)
  }
  formData.append('content', content)
    for(let i = 0; i < selectedImages.length; i++) {
      formData.append('newsfeedImages',selectedImages[i])
    }
    if (!content) {
      await Swal.fire({
        icon: 'error',
        title: '빈 내용은 작성할 수 없습니다!',
        text: '뭐라도 좋으니 내용을 입력해주세요 T^T',
      });
    } else{
      axios({
        url: `/api/newsfeed/newsfeed/${groupId}`,
        method: 'post',
        headers : {
          Authorization: `${getCookie('accessToken')}`,
        },
        data: formData
      })
      .then(async (res) => {
        await Swal.fire({
          icon: 'success',
          title: '뉴스피드 작성 완료!',
          text: '잠시 후 새로고침 됩니다.',
        });
        window.location.reload()
      })
      .catch((err) => {
        console.log(err);
        if(err.response.data.statusCode === 400) {
          Swal.fire({
            icon: 'error',
            title: '사진은 최대 5장까지만 등록 가능합니다.',
            text: "죄송합니다.",
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '알수없는 이유로 실행되지 않았습니다.',
            text: "관리자에게 문의해 주세요.",
          })
        }
      })
    }
}

// 뉴스피드 작성할때 태그 입력
async function getTags() {
  const tags = await Swal.fire({
    title: '태그는 최대 3개까지 가능합니다.',
    html:
      '<input id="swal-input1" class="swal2-input">' +
      '<input id="swal-input2" class="swal2-input">' +
      '<input id="swal-input3" class="swal2-input">' ,
    focusConfirm: false,
    preConfirm: () => {
      const values = [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3').value
      ]
      return values.filter(value => value !== '');
    }
  });
   let tagHtml = `
   </div>
   <svg class="quick-post-footer-action-icon icon-tags">
   <use xlink:href="#svg-tags"></use>
    </svg>
   <div class="tag-list">
    ${tags.value.map(tag => `
    <a class="tag-item secondary">${tag}</a>
   `).join("")}
   `
   selectedTags = tags.value;
   $('#tag_box').empty();
   $('#tag_box').append(tagHtml)
}

// 뉴스피드 작성할때 이미지 입력
async function getImages() {
  const imageSelcet = document.createElement("input");
  imageSelcet.type = "file";
  imageSelcet.multiple = true;
  imageSelcet.accept = "image/*";
  imageSelcet.onchange = function(event) {
    
  const files = event.target.files;
  selectedImages = files

  if(files.length === 1){
    let imageHtml = `
    <svg class="quick-post-footer-action-icon icon-camera">
    <use xlink:href="#svg-camera"></use>
    </svg>
    ${files[0].name}
    `
    $('#image_box').empty();
    $('#image_box').append(imageHtml)
  } else if(files.length !== 1) {
    let imageHtml = `
    <svg class="quick-post-footer-action-icon icon-camera">
    <use xlink:href="#svg-camera"></use>
    </svg>
    ${files[0].name} 외 ${files.length - 1}장
    `
    $('#image_box').empty();
    $('#image_box').append(imageHtml)
  }
  };
  imageSelcet.click();


}

// 뉴스피드 수정하기
async function modinewsfeed(id){
  // await Swal.mixin({
  //   input: 'file',
  //   confirmButtonText: '다음',
  //   showCancelButton: true,
  //   progressSteps: ['1', '2']
  // }).queue([
  //   {
  //     title: '이미지 선택',
  //     text: '업로드할 이미지를 선택해주세요'
  //   },
  //   {
  //     title: '글 내용 입력',
  //     text: '작성할 글 내용을 입력해주세요'
  //   }
  // ]).then((result) => {
  //   if (result.value) {
  //     const file = result.value[0];
  //     const text = result.value[1];
  //     // 파일 업로드와 글 작성 처리
  //   }
  // })
  let popupHtml = '<div id="popup" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px;">';
  popupHtml += '<h2>뉴스피드 수정하기</h2>';
  popupHtml += '<form>';
  popupHtml += '<label for="newsfeedcontent">내용:</label><br>';
  popupHtml += '<textarea id="newsfeedcontent" name="newsfeedcontent" rows="4" cols="50"></textarea><br><br>';
  popupHtml += '<label for="tag">태그(태그는 ,로 구분합니다.)</label><br>';
  popupHtml += '<input type="text" id="tag" name="tag"><br><br>';
  popupHtml += '<label for="image">이미지(최대 5장):</label><br>';
  popupHtml += '<input type="file" id="imageUpload" name="imageUpload" multiple>';
  popupHtml += '<input type="submit" value="수정">';
  popupHtml += '<button type="button" class="cancel">취소</button>'
  popupHtml += '</form>';
  popupHtml += '</div>';

  let popup = document.createElement('div');
  popup.innerHTML = popupHtml;
  document.body.appendChild(popup);

  popup.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();

    
  const files = document.getElementById('imageUpload');
  selectedImages = files.files
  console.log("이미지 파일 길이",selectedImages.length);

  const formData = new FormData();
  formData.append('content', newsfeedcontent.value)
  if(tag.value.length !== 0) {
    formData.append('newsfeedTags', tag.value)
  }
  if(selectedImages.length !==0) {
    for(let i = 0; i < selectedImages.length; i++) {
      formData.append('newsfeedImages',selectedImages[i])
    }
  }
    if (!newsfeedcontent.value) {
      await Swal.fire({
        icon: 'error',
        title: '빈 내용은 작성할 수 없습니다!',
        text: '뭐라도 좋으니 내용을 입력해주세요 T^T',
      });
    } else{
      axios({
        url: `/api/newsfeed/newsfeed/${id}`,
        method: 'put',
        headers : {
          Authorization: `${getCookie('accessToken')}`,
        },
        data: formData
      })
      .then(async (res) => {
        await Swal.fire({
          icon: 'success',
          title: '뉴스피드 수정 완료!',
          text: '잠시 후 새로고침 됩니다.',
        });
        window.location.reload()
      })
      .catch((err) => {
        console.log(err);
        if(err.response.data.statusCode === 400) {
          Swal.fire({
            icon: 'error',
            title: '사진은 최대 5장까지만 등록 가능합니다.',
            text: "죄송합니다.",
          });
        } else if (err.response.data.statusCode === 403){
          Swal.fire({
            icon: 'error',
            title: '로그인 정보가 일치하지 않습니다.',
            text: "로그인 정보를 확인해 주세요.",
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: '알수없는 이유로 실행되지 않았습니다.',
            text: "관리자에게 문의해 주세요.",
          })
        }
      })
    }
    document.body.removeChild(popup);
  });

  const cancelButton = popup.querySelector('.cancel')
  cancelButton.addEventListener('click',() => {
   document.body.removeChild(popup)
  })
}