import React, { useState,useEffect } from 'react';
import Dropzone from 'react-dropzone';

function AvatarUploader() {
  const [avatar, setAvatar] = useState(null);
  const [resizedAvatar, setResizedAvatar] = useState(null);

  const handleDrop = (files) => {
    setAvatar(files[0]);
  };

  
  const resizeImage = (file) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        ctx.drawImage(img, 0, 0, 300, 300);

        canvas.toBlob((blob) => {
          setResizedAvatar(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (avatar) {
      resizeImage(avatar);
    }
  }, [avatar]);


  const handleUpload = () => {
    // Call an API endpoint to upload the avatar
    console.log('Uploading avatar:', avatar);
  };

  return (
    <div>
      <Dropzone onDrop={handleDrop}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <button style={{padding: '20px'}}>Click or drag an image to upload.</button>
          </div>
        )}
      </Dropzone>
      {avatar && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={URL.createObjectURL(avatar)} alt="Uploaded Avatar" width="300"/>
          {/* <button onClick={handleUpload}>Upload</button> */}
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;