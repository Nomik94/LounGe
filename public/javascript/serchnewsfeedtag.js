let page = 1;
let tagSerch = 0;
$(document).ready(async function () {
  await restoreToken();
  let text = window.localStorage.getItem('searchResults')
  serchTagNewsfeed(text)
});
const contents = document.querySelector('#newsfeedbox');

// 서치바에서 태그 검색
function serchTagNewsfeed(text){
    axios({
      method: 'get',
      url: '/api/newsfeed/serchbar/tag',
      params: {
        tag: text,
      },
      headers: {
        Authorization: `${getCookie('accessToken')}`,
      },
    })
      .then((res) => {
        if(res.data.length < 9) {
          document.getElementById('loader').innerHTML = ''
        } 
        clearnewsfeed()
        newsfeedlist(res.data);
      })
      .catch((err) => {
        if (err.response.data.statusCode === 401) {
          alert("로그인 정보가 확인되지 않습니다.")
        }
        alert(err.response.data.message)
        window.location.href = '/newsfeed';
      });
}

// 서치바에서 태그 검색한 후 몇몇 태그 정렬
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
      tagSerch = 1;
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
