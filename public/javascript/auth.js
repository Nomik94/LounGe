$(document).ready(function () {
  const refreshToken = getCookie('refreshToken');

  if (refreshToken) {
    window.location.href = '/newsfeed';
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

function accessTokenExpires() {
  const accessDate = new Date();
  accessDate.setTime(accessDate.getTime() + 1000 * 60);
  const accessExpires = accessDate.toGMTString();
  return accessExpires;
}

function refreshTokenExpires() {
  const refreshDate = new Date();
  refreshDate.setTime(refreshDate.getTime() + 1000 * 60 * 60 * 24 * 7);
  const refreshExpires = refreshDate.toGMTString();
  return refreshExpires;
}

async function login() {
  const email = $('#login-username').val();
  const password = $('#login-password').val();

  if (!email || !password) {
    await Swal.fire({
      icon: 'error',
      text: `이메일 또는 비밀번호가 입력되지 않았습니다.`,
    });
  } else {
    axios
      .post('/api/auth/login', {
        email: email,
        password: password,
      })
      .then((res) => {
        const accessExpires = accessTokenExpires();
        const refreshExpires = refreshTokenExpires();
        document.cookie = `accessToken=Bearer ${res.data.accessToken}; path=/; expires=${accessExpires}`;
        document.cookie = `refreshToken=Bearer ${res.data.refreshToken}; path=/; expires=${refreshExpires}`;
        window.location.href = 'http://localhost:3000/newsfeed';
      })
      .catch(async (error) => {
        Swal.fire({
          icon: 'error',
          text: `${error.response.data.message}`,
        });
      });
  }
}

function kakaoLogin() {
  window.open('http://localhost:3000/api/auth/login/kakao');
  function loginCallback(event) {
    if (event.data?.accessToken) {
      const accessToken = event.data?.accessToken;
      const refreshToken = event.data?.refreshToken;
      const accessExpires = accessTokenExpires();
      const refreshExpires = refreshTokenExpires();
      document.cookie = `accessToken=Bearer ${accessToken}; path=/; expires=${accessExpires}`;
      document.cookie = `refreshToken=Bearer ${refreshToken}; path=/; expires=${refreshExpires}`;
    }
    window.removeEventListener('message', loginCallback);
    window.location.href = 'http://localhost:3000/newsfeed';
  }
  window.addEventListener('message', loginCallback);
}

function emailVerify() {
  const email = $('#register-email').val();
  if (!email) {
    Swal.fire({
      icon: 'false',
      text: `이메일을 입력해주세요.`,
    });
  } else {
    axios
      .post('/api/emailVerify', {
        email: email,
      })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          text: `인증번호가 발송되었습니다.`,
        });
      })
      .catch(async (error) => {
        Swal.fire({
          icon: 'error',
          text: `${error.response.data.message}`,
        });
      });
  }
}

function emailCheck() {
  const email = $('#register-email').val();
  const checkNumber = $('#certification_number').val();
  if (!checkNumber) {
    Swal.fire({
      icon: 'false',
      text: `번호를 입력해주세요.`,
    });
  } else {
    axios
      .post('/api/emailVerify/check', {
        email: email,
        checkNumber: checkNumber,
      })
      .then((res) => {
        document.querySelector('.checkNumber').id = 'check';
        Swal.fire({
          icon: 'success',
          text: `인증이 완료되었습니다.`,
        });
      })
      .catch(async (error) => {
        Swal.fire({
          icon: 'error',
          text: `${error.response.data.message}`,
        });
      });
  }
}

async function register() {
  const email = $('#register-email').val();
  const username = $('#register-username').val();
  const password = $('#register-password').val();
  const passwordRepeat = $('#register-password-repeat').val();
  const check = document.getElementById('check');
  const image = $('#userImage')[0].files[0];
  const formData = new FormData();
  formData.append('userImage', image);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('username', username);

  if (!check) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center-center',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    await Toast.fire({
      icon: 'error',
      text: '이메일 인증이 필요합니다.',
    });
  } else if (!email || !username || !password || !passwordRepeat) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center-center',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    await Toast.fire({
      icon: 'error',
      text: '모든 정보를 입력해주세요.',
    });
  } else if (password !== passwordRepeat) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center-center',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    await Toast.fire({
      icon: 'error',
      text: '비밀번호를 확인해주세요.',
    });
  } else {
    axios({
      method: 'post',
      url: '/api/auth/register',
      data: formData,
    })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          text: '회원가입이 완료되었습니다.',
        });
        window.location.reload();
      })
      .catch(async (error) => {
        Swal.fire({
          icon: 'error',
          text: `${error.response.data.message}`,
        });
      });
  }
}
