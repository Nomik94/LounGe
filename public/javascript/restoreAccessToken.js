async function restoreToken() {
  const accessToken = getCookie('accessToken');
  if (!accessToken) {
    restoreAccessToken();
  }
}

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
  accessDate.setTime(accessDate.getTime() + 1000 * 60 * 60 * 24);
  const accessExpires = accessDate.toGMTString();
  return accessExpires;
}

async function restoreAccessToken() {
  const token = getCookie('refreshToken');
  const expires = accessTokenExpires();

  if (token) {
    const refreshToken = token.replace('Bearer ', '');

    axios
      .post('/api/auth/restore/accessToken', {
        refreshToken: refreshToken,
      })
      .then((res) => {
        document.cookie = `accessToken=Bearer ${res.data.accessToken}; path=/; expires=${expires}`;
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (!token) {
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
    window.location.href = '/';
  }
}
