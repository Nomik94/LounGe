function deleteUserEvent(eventId, eventName) {
  console.log(eventId)
  Swal.fire({
    text: `${eventName}일정을 삭제하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '승인',
    cancelButtonText: '취소',
    reverseButtons: false, // 버튼 순서 거꾸로
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        url: `/api/calendar/users/events/${eventId}`,
        method: 'delete',
        headers: {
          Authorization: `${getCookie('accessToken')}`,
        },
      })
        .then(function (res) {
          window.location.replace('/events');
        })
        .catch(async function (error) {
          console.log(error)
          if (error.response.data.statusCode === 401) {
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
            window.location.replace('/');
          }
          Swal.fire({
            icon: 'error',
            text: `${error.response.data.message}`,
          });
        });
    }
  });
}
