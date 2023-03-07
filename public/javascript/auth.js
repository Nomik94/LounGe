function login() {
  const email = $('#login-username').val();
  const password = $('#login-password').val();
  if (!email || !password) {
    alert('이메일 또는 비밀번호가 입력되지 않았습니다.');
  } else {
    axios({
      method: 'post',
      url: '/api/auth/login',
      data: {
        email: email,
        password: password,
      },
    }).then((res) => {
      console.log(res);
      document.cookie = `accessToken=Bearer ${res.data.accessToken}`;
    });
  }
}
