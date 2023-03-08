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
      document.cookie = `accessToken=Bearer ${res.data.accessToken}`;
      document.cookie = `refreshToken=Bearer ${res.data.refreshToken}`;
      window.location.href = 'http://localhost:3000/newsfeed';
    })
    .catch(async (error) => {
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
      console.log(res);
    })
    .catch(async (error) => {
      alert(error.response.data.message);
    });
}

function emailCheck() {
  const email = $('#register-email').val();
  const checkNumber = $('#certification_number').val();
  if (!checkNumber) {
    alert('번호를 입력해주세요.');
  }
  axios
    .post('api/emailVerify/check', {
      email: email,
      checkNumber: checkNumber,
    })
    .then((res) => {
      console.log(res);
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

  if (!email || !username || !password || !passwordRepeat) {
    alert('모든 정보를 입력해주세요.');
  } else if (password !== passwordRepeat) {
    alert('비밀번호를 확인해주세요.');
  }
  axios
    .post('api/auth/register', {
      email: email,
      username: username,
      password: password,
    })
    .then((res) => {
      alert('회원가입이 완료되었습니다.');
      window.location.href = 'http://localhost:3000/groups';
    })
    .catch(async (error) => {
      alert(error.response.data.message);
    });
}
