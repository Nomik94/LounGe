$(document).ready(function () {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');
  if (!refreshToken) {
    alert('로그인을 다시 해주세요.');
    window.location.href = '/';
  } else if (!accessToken) {
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
  const Token = getCookie('refreshToken');
  const expires = accessTokenExpires();

  const refreshToken = Token.replace('Bearer ', '');
  axios
    .post('/api/auth/restoreAccessToken', {
      refreshToken: refreshToken,
    })
    .then((res) => {
      document.cookie = `accessToken=Bearer ${res.data.accessToken}; path=/; expires=${expires}`;
      window.location.reload();
    });
}
