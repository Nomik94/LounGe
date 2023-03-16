async function logout() {
  document.cookie =
    'accessToken' + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/;';
  document.cookie =
    'refreshToken' + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/;';
  await Swal.fire({
    icon: 'success',
    text: '로그아웃 되었습니다.',
  });
  window.location.href = '/';
}
