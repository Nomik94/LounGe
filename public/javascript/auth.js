$(document).ready(function () {
  // const cookie = document.cookie.split('=')[0];
  // if (cookie === 'accessToken') {
  //   window.location.href = 'http://localhost:3000/newsfeed';
  // }
  restoreAccessToken();
});

function login() {
  const email = $('#login-username').val();
  const password = $('#login-password').val();
  if (!email || !password) {
    alert('이메일 또는 비밀번호가 입력되지 않았습니다.');
  }
  axios
    .post('/api/auth/login', {
      email: email,
      password: password,
    })
    .then((res) => {
      const date = new Date();
      date.setTime(date.getTime() + 1000 * 60);
      const expires = date.toGMTString();
      console.log(expires);
      document.cookie = `accessToken=Bearer ${res.data.accessToken} path=/; expires=${expires}`;
      document.cookie = `refreshToken=Bearer ${res.data.refreshToken} path=/;`;
      window.location.href = 'http://localhost:3000/newsfeed';
    })
    .catch(async (error) => {
      console.log(error);
      alert(error.response.data.message);
    });
}

function kakaoLogin() {
  window.open('http://localhost:3000/api/auth/login/kakao');

  function loginCallback(event) {
    if (event.data?.accessToken) {
      const accessToken = event.data?.accessToken;
      const refreshToken = event.data?.refreshToken;
      document.cookie = `accessToken=Bearer ${accessToken}`;
      document.cookie = `refreshToken=Bearer ${refreshToken}`;
    }
    window.removeEventListener('message', loginCallback);
  }
  window.addEventListener('message', loginCallback);
  window.location.href = 'http://localhost:3000/newsfeed';
}

function emailVerify() {
  const email = $('#register-email').val();
  if (!email) {
    alert('이메일을 입력해주세요.');
  }

  axios
    .post('/api/emailVerify', {
      email: email,
    })
    .then((res) => {
      alert('인증번호가 발송되었습니다.');
    })
    .catch(async (error) => {
      if (error.response.data.statusCode === 500) {
        alert('이메일 형식이 아닙니다.');
      } else {
        alert(error.response.data.message);
      }
    });
}

function emailCheck() {
  const email = $('#register-email').val();
  const checkNumber = $('#certification_number').val();
  if (!checkNumber) {
    alert('번호를 입력해주세요.');
  }
  axios
    .post('/api/emailVerify/check', {
      email: email,
      checkNumber: checkNumber,
    })
    .then((res) => {
      document.querySelector('.checkNumber').id = 'check';
      alert('인증이 완료되었습니다.');
    })
    .catch(async (error) => {
      alert(error.response.data.message);
    });
}

function register() {
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
    alert('이메일 인증을 해주세요.');
  } else if (!email || !username || !password || !passwordRepeat) {
    alert('모든 정보를 입력해주세요.');
  } else if (password !== passwordRepeat) {
    alert('비밀번호를 확인해주세요.');
  } else {
    axios({
      method: 'post',
      url: '/api/auth/register',
      data: formData,
    })
      .then((res) => {
        alert('회원가입이 완료되었습니다.');
        window.location.reload();
      })
      .catch(async (error) => {
        alert(error.response.data.message);
      });
  }
}

function logout() {
  document.cookie = 'accessToken' + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  document.cookie =
    'refreshToken' + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  window.location.href = '/';
}

function restoreAccessToken() {
  const accessToken = document.cookie.filter((token) =>
    token.includes('accessToken'),
  );
  const refreshToken = document.cookie
    .split(';')
    .filter((token) => token.includes('refreshToken'))[0]
    .split('=')[1]
    .split('Bearer ')[1];
  console.log(accessToken);

  if (!refreshToken) {
    alert('로그인을 다시 해주세요.');
  } else if (!accessToken) {
    axios
      .post('/api/auth/restoreAccessToken', {
        refreshToken: refreshToken,
      })
      .then((res) => {
        document.cookie = `accessToken=Bearer ${res.data.accessToken}; path=/;`;
      });
  }
}
