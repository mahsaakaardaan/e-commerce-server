// api secret = pKAsOHOcqoKhbieT5VUemZW52Wo
// api key = 577658169591937
// CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@mahsaa

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'mahsaa',
  api_key: '577658169591937',
  api_secret: 'pKAsOHOcqoKhbieT5VUemZW52Wo'
});

module.exports  = cloudinary;
