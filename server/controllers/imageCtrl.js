const app = require('../index.js');
const db = app.get('db');
module.exports = {
    addImage: (req, res, next) => {
        db.add_image([req.body.home_id, req.body.url], (error, response) => {
              if(error){
                res.json({
                    status: 500,
                    message: error,
                    method: 'addImage'
                })
            }
            else if(response) {
                res.json({
                    status: 200,
                    message: "Image added successfully",
                    method: 'addImage'
                })
            }
        })
    },
    deleteImage: (req, res, next) => {
      db.delete_image(req.params.id, (error, response) => {
          if (error) {
                  res.json({
                      status: 500,
                      message: error,
                      method: 'deleteImage, delete_image'
                  })
              }
          else if (response) {
              res.json({
                  message: "Priorities updated successfully",
                  status: 200,
                  method: 'deleteImage, delete_image'
              })
          }
      })
   },
   readImages: (req, res, next) => {
       db.read_images_by_home_id(Number(req.params.home_id),(error, response) => {
           if (error) {
                   res.json({
                       status: 500,
                       message: error,
                       method: 'readImages, read_Images'
                   })
               }
           else if (response) {
               res.json(response);
           }
       })
   },
}
