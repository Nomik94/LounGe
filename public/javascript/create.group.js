const { includes } = require("lodash");

function createGroup() {
  const accessToken = document.cookie.split(';').filter((token)=> token.includes('accessToken'))[0].split('=')[1]

  const groupName = document.getElementById('groupName').value;
  const groupDescription = document.getElementById('groupDescription').value;
  const groupTags = document.getElementById('groupTags').value;
  const groupImage = document.getElementById('groupImage').files[0];
  const backgroundImage = document.getElementById('backgroundImage').files[0];

  console.log(groupDescription)
  const formData = new FormData();
  formData.append('groupName', groupName);
  formData.append('description', groupDescription);
  formData.append('tag', groupTags);
  formData.append('groupImage', groupImage);
  formData.append('backgroundImage', backgroundImage);

  axios({
    url: `/api/groups`,
    method: 'post',
    headers: {
      Authorization: `${accessToken}`,
    },
    data : formData
  })
    .then(function (res) {
      console.log(res)
      // Swal.fire({
      //   icon: 'success',
      //   text: `${groupName}에 가입 신청이 완료되었습니다.`,
      // });
    })
    .catch(async function (error) {
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
        window.location.replace('auth');
      }
      Swal.fire({
        icon: 'false',
        text: `${error.response.data.message}`,
      });
    });
}
