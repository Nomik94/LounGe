let page = 1;
$(document).ready(async function () {
  await restoreToken();
  readnewsfeedgrouptimeline(page);
});
const contents = document.querySelector('#newsfeedbox');

// 특정 그룹의 뉴스피드 가져오기
function readnewsfeedgrouptimeline(page) {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');
  axios({
    method: 'get',
    url: `/api/newsfeed/group/${groupId}/${page}`,
  })
    .then(async (res) => {
      await newsfeedlist(res.data);
    })
    .catch(async (err) => {
      await Swal.fire({
        icon: 'error',
        title: '알수없는 이유로 실행되지 않았습니다.',
        text: '관리자에게 문의해 주세요.',
      });
    });
}

// 무한 스크롤
async function limitscroll() {
  page++;
  readnewsfeedgrouptimeline(page);
}

// 특정 그룹에서 뉴스피드 태그로 검색하기
function serchtag(tag) {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');

  const test = tag;
  axios({
    method: 'Get',
    url: `/api/newsfeed/tag/${groupId}`,
    params: {
      tag: test,
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
      } else {
        Swal.fire({
          icon: 'error',
          title: '알수없는 이유로 실행되지 않았습니다.',
          text: '관리자에게 문의해 주세요.',
        });
      }
    });
}

// 뉴스피드 작성하기
async function createNewsfeed() {
  const content = document.getElementById('quick-post-text').value;
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');
  const formData = new FormData();
  if (!content) {
    await Swal.fire({
      icon: 'error',
      title: '빈 내용은 작성할 수 없습니다!',
      text: '뭐라도 좋으니 내용을 입력해주세요 T^T',
    });
  } else if (selectedImages.length > 5) {
    await Swal.fire({
      icon: 'error',
      title: '사진은 최대 5장만 입력 가능합니다!',
      text: '소중한 사진을 많이 처리하지 못해 죄송합니다 T^T',
    });
  } else {
    if (selectedTags.length !== 0) {
      formData.append('newsfeedTags', selectedTags);
    }
    formData.append('content', content);
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append('newsfeedImage', selectedImages[i]);
    }
    axios({
      url: `/api/newsfeed/newsfeed/${groupId}`,
      method: 'post',
      headers: {
        Authorization: `${getCookie('accessToken')}`,
      },
      data: formData,
    })
      .then(async (res) => {
        await Swal.fire({
          icon: 'success',
          title: '뉴스피드 작성 완료!',
          text: '잠시 후 새로고침 됩니다.',
        });
        window.location.reload();
      })
      .catch((err) => {
        if (err.response.data.statusCode === 400) {
          Swal.fire({
            icon: 'error',
            title: '사진은 최대 5장까지만 등록 가능합니다.',
            text: '죄송합니다.',
          });
        } else if (err.response.data.statusCode === 401) {
          Swal.fire({
            icon: 'error',
            title: '로그인 정보가 일치하지 않습니다.',
            text: '다시 로그인해주세요.',
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
}

// 뉴스피드 작성할때 태그 입력
async function getTags() {
  const tags = await Swal.fire({
    title: '태그는 최대 3개까지 가능합니다.',
    html:
      '<input id="swal-input1" class="swal2-input">' +
      '<input id="swal-input2" class="swal2-input">' +
      '<input id="swal-input3" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
      const values = [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3').value,
      ];
      return values.filter((value) => value !== '');
    },
  });
  let tagHtml = `
   <div class="tag-list">
    ${tags.value
      .map(
        (tag) => `
    <a class="tag-item secondary">${tag}</a>
   `,
      )
      .join('')}
   `;
  selectedTags = tags.value;
  $('#tag_box').empty();
  $('#tag_box').append(tagHtml);
}

// 뉴스피드 작성할때 이미지 입력
async function getImages() {
  const imageSelcet = document.createElement('input');
  imageSelcet.type = 'file';
  imageSelcet.multiple = true;
  imageSelcet.accept = 'image/*';
  imageSelcet.onchange = function (event) {
    const files = event.target.files;
    selectedImages = files;

    if (files.length === 1) {
      let imageHtml = `
    <svg class="quick-post-footer-action-icon icon-camera">
    <use xlink:href="#svg-camera"></use>
    </svg>
    ${files[0].name}
    `;
      $('#image_box').empty();
      $('#image_box').append(imageHtml);
    } else if (files.length !== 1) {
      let imageHtml = `
    <svg class="quick-post-footer-action-icon icon-camera">
    <use xlink:href="#svg-camera"></use>
    </svg>
    ${files[0].name} 외 ${files.length - 1}장
    `;
      $('#image_box').empty();
      $('#image_box').append(imageHtml);
    }
  };
  imageSelcet.click();
}
