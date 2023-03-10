function findPassword() {
  const email = $('#register-email').val();
  const password = $('#register-password').val();
  const passwordRepeat = $('#register-password-repeat').val();
  const check = document.getElementById('check');

  if (!check) {
    alert('이메일 인증을 해주세요.');
  } else if (!email || !password || !passwordRepeat) {
    alert('모든 정보를 입력해주세요.');
  } else if (password !== passwordRepeat) {
    alert('비밀번호를 확인해주세요.');
  } else {
    axios
      .put('api/user/findPassword', {
        email: email,
        password: password,
      })
      .then((res) => {
        alert('비밀번호가 변경되었습니다.');
        window.location.href('/');
      })
      .catch(async (error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  }
}

function updatePassword() {
  const password = $('#account-current-password').val();
  const newPassword = $('#account-new-password').val();
  const newPasswordRepeat = $('#account-new-password-confirm').val();
  const accessToken = document.cookie
    .split(';')
    .filter((token) => token.includes('accessToken'))[0]
    .split('=')[1];

  if (!password || !newPassword || !newPasswordRepeat) {
    alert('모든 정보를 입력해주세요.');
  } else if (newPassword !== newPasswordRepeat) {
    alert('새 비밀번호를 확인해주세요.');
  } else {
    axios({
      url: '/api/user/password',
      method: 'put',
      headers: {
        Authorization: `${accessToken}`,
      },
      data: {
        password: password,
        newPassword: newPassword,
      },
    })
      .then((res) => {
        console.log(res);
        alert('비밀번호가 변경되었습니다.');
        window.location.reload();
      })
      .catch(async (error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  }
}
