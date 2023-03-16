$(document).ready(async function () {
  await restoreToken();
  getUser();
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

function getUser() {
  const accessToken = getCookie('accessToken');

  axios({
    url: '/api/user',
    method: 'get',
    headers: {
      Authorization: `${accessToken}`,
    },
  })
    .then((res) => {
      let temp_html = `<!-- GRID -->
    <div class='grid grid-3-3-3 centered'>
      <!-- USER PREVIEW -->
      <div class='user-preview small fixed-height'>
        <!-- USER PREVIEW COVER -->
        <figure class='user-preview-cover liquid'>
          <img src='' alt='cover-01' />
        </figure>
        <!-- /USER PREVIEW COVER -->

        <!-- USER PREVIEW INFO -->
        <div class='user-preview-info'>
          <!-- USER SHORT DESCRIPTION -->
          <div class='user-short-description small'>
            <!-- USER SHORT DESCRIPTION AVATAR -->
            <div class='user-short-description-avatar user-avatar'>
              <!-- USER AVATAR BORDER -->
              <div class='user-avatar-border'>
                <!-- HEXAGON -->
                <div class='hexagon-100-110'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR BORDER -->

              <!-- USER AVATAR CONTENT -->
              <div class='user-avatar-content'>
                <!-- HEXAGON -->
                <div
                  class='hexagon-image-68-74' id='userImage'
                  data-src='/userImage/${res.data.image}'
                ></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR CONTENT -->

              <!-- USER AVATAR PROGRESS -->
              <div class="user-avatar-progress">
                <!-- HEXAGON -->
                <div class="hexagon-progress-84-92"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS -->
          
              <!-- USER AVATAR PROGRESS BORDER -->
              <div class="user-avatar-progress-border">
                <!-- HEXAGON -->
                <div class="hexagon-border-84-92"></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS BORDER -->



              <!-- USER AVATAR PROGRESS BORDER -->
              <div class='user-avatar-progress-border'>
                <!-- HEXAGON -->
                <div class='hexagon-border-84-92'></div>
                <!-- /HEXAGON -->
              </div>
              <!-- /USER AVATAR PROGRESS BORDER -->

            </div>
            <!-- /USER SHORT DESCRIPTION AVATAR -->
          </div>
          <!-- /USER SHORT DESCRIPTION -->
        </div>
        <!-- /USER PREVIEW INFO -->
      </div>
      <!-- /USER PREVIEW -->
    </div>
    <!-- /GRID -->

    <!-- WIDGET BOX -->
    <div class='widget-box'>
      <!-- WIDGET BOX TITLE -->
      <p class='widget-box-title'>나의 프로필</p>
      <!-- /WIDGET BOX TITLE -->

      <!-- WIDGET BOX CONTENT -->
      <div class='widget-box-content'>
        <!-- FORM -->
        <form class='form'>
          <!-- FORM ROW -->
          <div class='form-row split'>
            <!-- FORM ITEM -->
            <div class='form-item'>
              <!-- FORM INPUT -->
              <div class='form-input small active'>
                <label for='profile-name'>닉네임</label>
                <input
                  type='text'
                  id='profile-name'
                  name='profile_name'
                  value='${res.data.username}'
                />
              </div>
              <!-- /FORM INPUT -->
            </div>
            <!-- /FORM ITEM -->

            <!-- FORM ITEM -->
            <div class='form-item'>
              <!-- FORM INPUT -->
              <div class='form-input small active'>
                <p class='button full primary' onclick="updateUserName()">닉네임 변경</p>
              </div>
              <!-- /FORM INPUT -->
            </div>
            <!-- /FORM ITEM -->
          </div>
          <!-- /FORM ROW -->

      

          <!-- FORM ROW -->
          <div class='form-row split'>


          <!-- FORM ITEM -->
          <div class="form-item">
            <!-- FORM INPUT -->
            <div class="form-input small active">
              <label for="register-image">프로필 이미지</label>
              <input type='file' class='form-control' id='profileImage'/>
            </div>
            <!-- /FORM INPUT -->
          </div>
          <!-- /FORM ITEM -->

          <!-- FORM ITEM -->
            <div class='form-item'>
              <!-- FORM INPUT -->
              <div class='form-input small active'>
                <p class='button full primary' onclick="updateImage()">이미지 변경</p>
              </div>
              <!-- /FORM INPUT -->
            </div>
            <!-- /FORM ITEM -->
          </div>
          <!-- /FORM ROW -->

      
        </form>
        <!-- /FORM -->
      </div>
      <!-- WIDGET BOX CONTENT -->
    </div>
    <!-- /WIDGET BOX -->
  </div>
  <!-- /GRID COLUMN -->
</div>
<!-- /GRID COLUMN -->
</div>
<!-- /GRID -->`;
      $('#getUser').append(temp_html);
      let script_html = `  <!-- app -->
      
      <!-- liquidify -->
      <script src='/js/utils/liquidify.js'></script>
      <!-- global.hexagons -->
      <script src='/js/global/global.hexagons.js'></script>

      
`;
      $('#script').append(script_html);
    })
    .catch(async (error) => {
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

async function findPassword() {
  const email = $('#register-email').val();
  const password = $('#register-password').val();
  const passwordRepeat = $('#register-password-repeat').val();
  const check = document.getElementById('check');

  if (!check) {
    await Swal.fire({
      icon: 'error',
      text: '이메일 인증이 필요합니다.',
    });
  } else if (!email || !password || !passwordRepeat) {
    await Swal.fire({
      icon: 'error',
      text: '모든 정보를 입력해주세요.',
    });
  } else if (password !== passwordRepeat) {
    await Swal.fire({
      icon: 'error',
      text: '비밀번호를 확인해주세요.',
    });
  } else {
    axios
      .put('api/user/find/password', {
        email: email,
        password: password,
      })
      .then(async (res) => {
        await Swal.fire({
          icon: 'success',
          text: `비밀번호가 변경되었습니다.`,
        });
        window.location.href('/');
      })
      .catch(async (error) => {
        Swal.fire({
          icon: 'error',
          text: `${error.response.data.message}`,
        });
      });
  }
}

async function updatePassword() {
  const password = $('#account-current-password').val();
  const newPassword = $('#account-new-password').val();
  const newPasswordRepeat = $('#account-new-password-confirm').val();
  const accessToken = document.cookie
    .split(';')
    .filter((token) => token.includes('accessToken'))[0]
    .split('=')[1];

  if (!password || !newPassword || !newPasswordRepeat) {
    await Swal.fire({
      icon: 'error',
      text: '모든 정보를 입력해주세요.',
    });
  } else if (newPassword !== newPasswordRepeat) {
    await Swal.fire({
      icon: 'error',
      text: '새 비밀번호를 확인해주세요.',
    });
  } else {
    axios({
      url: '/api/user/modify/password',
      method: 'put',
      headers: {
        Authorization: `${accessToken}`,
      },
      data: {
        password: password,
        newPassword: newPassword,
      },
    })
      .then(async (res) => {
        await Swal.fire({
          icon: 'success',
          text: '비밀번호가 변경되었습니다.',
        });
        window.location.reload();
      })
      .catch(async (error) => {
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
function updateImage() {
  const accessToken = document.cookie
    .split(';')
    .filter((token) => token.includes('accessToken'))[0]
    .split('=')[1];
  const image = $('#profileImage')[0].files[0];
  const formData = new FormData();
  formData.append('userImage', image);

  axios({
    method: 'put',
    url: '/api/user/modify/image',
    headers: {
      Authorization: `${accessToken}`,
    },
    data: formData,
  })
    .then(async (res) => {
      await Swal.fire({
        icon: 'success',
        text: '이미지 업데이트가 완료되었습니다.',
      });
      window.location.reload();
    })
    .catch(async (error) => {
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

function updateUserName() {
  const accessToken = document.cookie
    .split(';')
    .filter((token) => token.includes('accessToken'))[0]
    .split('=')[1];

  const username = $('#profile-name')[0].value;

  axios({
    method: 'put',
    url: '/api/user/modify/name',
    headers: {
      Authorization: `${accessToken}`,
    },
    data: { username: username },
  })
    .then(async (res) => {
      await Swal.fire({
        icon: 'success',
        text: '닉네임 업데이트가 완료되었습니다.',
      });
      window.location.reload();
    })
    .catch(async (error) => {
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
