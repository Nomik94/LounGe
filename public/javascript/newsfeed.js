function getImages() {
  const imageSelcet = document.createElement("input");
  imageSelcet.type = "file";
  imageSelcet.multiple = true;
  imageSelcet.accept = "image/*";

  imageSelcet.onchange = function(event) {
    
  const files = event.target.files;
  console.log(files);
  };
  imageSelcet.click();
}

async function getTags() {

  const { value: formValues } = await Swal.fire({
    title: '태그는 최대 5글자까지 가능합니다.',
    html:
      '<input id="swal-input1" class="swal2-input">' +
      '<input id="swal-input2" class="swal2-input">' +
      '<input id="swal-input3" class="swal2-input">' +
      '<input id="swal-input4" class="swal2-input">' +
      '<input id="swal-input5" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3').value,
        document.getElementById('swal-input4').value,
        document.getElementById('swal-input5').value
      ]
    }
  })
  // if (formValues) {
  //   Swal.fire(JSON.stringify(formValues))
  // }
  function removeEmptyIndexes(arr) {
    return arr.filter(elem => elem !== '');
  }
  const Tags = removeEmptyIndexes(formValues)
}

async function postnewsfeed() {

  // const content = document.getElementById("quick-post-text").value
  // const Tags = await getTags()
  // const images = await getImages()
  const content = document.getElementById("quick-post-text").value
  const tag = ["첫번째",'두번째']
  axios({
    method: 'post',
    url: '/api/newsfeed/newsfeed/1',
    data: {
      content: content,
      tag: tag
    },
  }).then((res) => {
    console.log(res.data);
  });

  
}