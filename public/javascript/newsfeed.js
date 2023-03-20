let page = 1;
$(document).ready(async function () {
  await restoreToken();
  readnewsfeedmygroup(page); // 내가 가입한 모든 그룹의 뉴스피드 보기
});
const contents = document.querySelector('#newsfeedbox');

// 내가 가입한 모든 그룹의 뉴스피드 보기
async function readnewsfeedmygroup(page) {
  axios({
    method: 'get',
    url: `/api/newsfeed/newsfeed/groups/${page}`,
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(async (res) => {
      if(res.data.length < 9) {
        document.getElementById('loader').innerHTML = ''
      }
     if(res.data.length == 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'error',
        title: '보여줄 뉴스피드가 없어요 T^T <br><br>그룹에 가입해 주세요!',
      });
     } else if (res.data.length >= 1) {
       await newsfeedlist(res.data);
     }
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
        window.location.href = '/';
      }
      Swal.fire({
        icon: 'error',
        text: `${err.response.data.message}`,
      });
    });
}

// 무한 스크롤
async function limitscroll() {
  page++;
  readnewsfeedmygroup(page);
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
    headers: {
      Authorization: `${getCookie('accessToken')}`,
    },
  })
    .then(async (res) => {
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
      }
      Swal.fire({
        icon: 'error',
        text: `${err.response.data.message}`,
      });
    });
}
