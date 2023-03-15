let page = 1;
$(document).ready(async function () {
  await restoreToken();
  readnewsfeedmylist(page);
});
const contents = document.querySelector('#newsfeedbox');

// 내가 쓴 뉴스피드만 불러오기
async function readnewsfeedmylist(page) {
  axios({
    method: 'get',
    url: `/api/newsfeed/newsfeed/${page}`,
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(async (res) => {
     await newsfeedlist(res.data);
    })
    .catch( (err) => {
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
      }
      Swal.fire({
        icon: 'error',
        text: `${err.response.data.message}`,
      });
    });
}

// 무한 스크롤
async function limitscroll() {
  page++
  readnewsfeedmylist(page)
  }

// 내 뉴스피드에서 태그 정렬
async function serchtag(tag) {
  const test = tag;
  axios({
    method: 'get',
    url: '/api/newsfeed/tag/newsfeed/list',
    params: {
      tag: test,
    },
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then((res) => {
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
