$(document).ready(async function () {
  const refreshToken = getCookie('refreshToken');
  if (!refreshToken) {
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
  } else {
    restoreAccessToken();
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

function restoreAccessToken() {
  const accessToken = getCookie('accessToken');
  const token = getCookie('refreshToken');
  const expires = accessTokenExpires();

  const refreshToken = token.replace('Bearer ', '');

  if (!accessToken) {
    axios
      .post('/api/auth/restoreAccessToken', {
        refreshToken: refreshToken,
      })
      .then((res) => {
        document.cookie = `accessToken=Bearer ${res.data.accessToken}; path=/; expires=${expires}`;
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
