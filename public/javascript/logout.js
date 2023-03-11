function logout() {
  document.cookie =
    'accessToken' + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/;';
  document.cookie =
    'refreshToken' + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/;';
  window.location.href = '/';
}
