import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp') //cb -> callback
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
      // console.log(file)
    }
  })
  
  export const upload = multer({ storage: storage })

  // file -->
  // {
  //   fieldname: 'avatar',
  //   originalname: 'IMG_20240105_083452.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg'
  // }
  // {
  //   fieldname: 'coverImage',
  //   originalname: 'Sigma.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg'
  //   encoding: '7bit',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg'
  // }