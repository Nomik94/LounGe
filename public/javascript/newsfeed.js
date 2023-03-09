// $(document).ready(function(){
//   readnewsfeedmy()
// });

function getImages() {
  const imageSelcet = document.createElement("input");
  imageSelcet.type = "file";
  imageSelcet.multiple = true;
  imageSelcet.accept = "image/*";

  imageSelcet.onchange = function(event) {
    
  const files = event.target.files;
  console.log(files);
  };
  imageSelcet.click();
}

async function getTags() {

  const { value: formValues } = await Swal.fire({
    title: '태그는 최대 5글자까지 가능합니다.',
    html:
      '<input id="swal-input1" class="swal2-input">' +
      '<input id="swal-input2" class="swal2-input">' +
      '<input id="swal-input3" class="swal2-input">' +
      '<input id="swal-input4" class="swal2-input">' +
      '<input id="swal-input5" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3').value,
        document.getElementById('swal-input4').value,
        document.getElementById('swal-input5').value
      ]
    }
  })
  // if (formValues) {
  //   Swal.fire(JSON.stringify(formValues))
  // }
  function removeEmptyIndexes(arr) {
    return arr.filter(elem => elem !== '');
  }
  const Tags = removeEmptyIndexes(formValues)
}

async function postnewsfeed() {

  // const content = document.getElementById("quick-post-text").value
  // const Tags = await getTags()
  // const images = await getImages()

  const content = document.getElementById("quick-post-text").value
  const tag = ["첫번째",'두번째']

  axios({
    method: 'post',
    url: '/api/newsfeed/newsfeed/1',
    headers: {
      Authorization: `${document.cookie.split('=')[1]}`
    },
    data: {
      content: content,
      tag: tag,
      groupId: 1
    },
  }).then((res) => {
    console.log(res.data);
  });

  
}

async function readnewsfeedmy() {
  const accessToken = document.cookie.split(';').filter((token)=> token.includes('accessToken'))[0].split('=')[1]

  axios({
    method: 'get',
    url: '/api/newsfeed/newsfeed',
    headers: {
      Authorization: `${accessToken}` // 엑세스 토큰
    }
  })
  .then((res) => {
    console.log(res.data);
    clearnewsfeed();
    newsfeedlist(res.data);

  })
}
async function newsfeedlist(data) {

  data.forEach((data) => {
    const creadteDate = new Date(data.createAt) 
    const updateDate = new Date(data.updateAt)
    const timeOptions = {
      hour12: false,
      hour: "2-digit", 
      minute: "2-digit"
    }
    const creadteDateFormat = creadteDate.toLocaleDateString("Ko-KR",timeOptions)
    const updateDateFormat = updateDate.toLocaleDateString("Ko-KR",timeOptions)
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
          <p class="simple-dropdown-link" onclick="modinewsfeed(${data.id})">수정</p>
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
                <div class="hexagon-image-30-32" data-src="img/avatar/02.jpg"></div>
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
  const asd = `<script src="/js/vendor/xm_plugins.min.js"></script>`;
  $('#ddd').append(asd);
}

async function deletenewsfeed(newsfeedId){
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
                  const accessToken = document.cookie.split(';').filter((token)=> token.includes('accessToken'))[0].split('=')[1]
                  axios({
                    method: 'Delete',
                    url: `/api/newsfeed/newsfeed/${newsfeedId}`,
                    headers: {
                      Authorization: `${accessToken}` // 엑세스 토큰
                    }
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
                    if(err.response.data.statusCode === 401) {
                      const Toast = Swal.mixin({
                        toast: true,
                        position: 'center-center',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                      });
                      await Toast.fire({
                        icon: 'error',
                        title: '로그인 정보가 일치하지 않습니다.',
                      });
                      window.location.replace('auth');
                    }
                    Swal.fire({
                      icon: 'error',
                      title: '알수없는 이유로 실행되지 않았습니다.',
                      text: "관리자에게 문의해 주세요.",
                    })
                  })
                }
              })
}

async function serchtag(tag) {
  const test = tag
    axios({
      method: 'Get',
      url: '/api/newsfeed/tag/newsfeed',
      params: {
        tag:test
      },
    })
    .then(async (res) => {
      console.log(res.data);
    })
}

function clearnewsfeed(){
  $('#newsfeedbox').empty();
}



function modinewsfeed(a){
  console.log("하이!",a);
}