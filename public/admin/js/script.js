function previewImage(input, event, image) {
    try{
      if (input.files) {
        for(let i=0;i<input.files.length;i++){
          const imageTag = document.getElementById(`imagePreview${i+1}`);
          const reader = new FileReader(input.files[i]);
          reader.onload = (e) => {
            imageTag.src = e.target.result;
          };
          reader.readAsDataURL(input.files[i]);
        }
      } else {
        const imageTag = document.getElementById(`imagePreview2`);
        imageTag.src = "";
      }
    }catch(err){
  alert(err)
    }
  }
function previewImageedit(input,image){
  let displayImage=document.getElementById(image)
  if(input.files && input.files[0]){
    const reader=new FileReader(input.files[0])
    reader.onload=(e)=>{
      displayImage.src=e.target.result
    }
    reader.readAsDataURL(input.files[0])
  }else{
    displayImage.src=''

  }
} 