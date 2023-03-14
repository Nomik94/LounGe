$(document).ready(async function () {
  await restoreToken();
  readnewsfeedmygroup(); // 내가 가입한 모든 그룹의 뉴스피드 보기
});

// 내가 가입한 모든 그룹의 뉴스피드 보기
async function readnewsfeedmygroup() {
  axios({
    method: 'get',
    url: '/api/newsfeed/newsfeed/mygroup',
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(async(res) => {
      // clearnewsfeed();
     await newsfeedlist(res.data);
    })
    .catch((err) => {
      if (err.response.data.statusCode === 401) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'center-center',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: 'error',
          title: '로그인 정보가 없습니다. <br>로그인이 필요합니다.',
        });
        // window.location.href = '/';
      }

      if (err.response.data.statusCode !== 401) {
        Swal.fire({
          icon: 'error',
          title: '알수없는 이유로 실행되지 않았습니다.',
          text: '관리자에게 문의해 주세요.',
        });
      }
    });
}

// 태그 클릭 시 해당 태그로 작성된 뉴스피드 검색
async function serchtag(tag) {
  const test = tag;
  axios({
    method: 'Get',
    url: '/api/newsfeed/tag/newsfeed',
    params: {
      tag: test,
    },
  })
    .then(async (res) => {
      // console.log(res.data);
      clearnewsfeed();
      newsfeedlist(res.data);
    })
    .catch(async (err) => {
      if (err.response.data.statusCode === 401) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'center-center',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        await Toast.fire({
          icon: 'error',
          title: '로그인 정보가 일치하지 않습니다.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '알수없는 이유로 실행되지 않았습니다.',
          text: '관리자에게 문의해 주세요.',
        });
      }
    });
}
