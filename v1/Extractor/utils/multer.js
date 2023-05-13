import multer from 'multer'
import path from 'path'
import { ValidateFileType, ValidateFields } from './FileUtils.js'
import config from '../../../config/Config.js'
import * as response from '../../../utils/Response.js'

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: config.MaxFileSize },
  // validate file types using custom function
  fileFilter: (req, file, cb) => {
    const validFileType = ValidateFileType(file.mimetype)
    //const validateFields = ValidateFields(req.files)

    if (validFileType /*&& validateFields*/) {
      cb(null, true)
    } else {
      return cb(new Error('Invalid file type'))
    }
  }
})

// create list of fields from config
const fields = config.FieldsName.map((obj) => {
  return { name: obj}
})

export default function MulterUploader (req, res, next) {

    upload.fields(fields)(req, res, (err) => {
        if (err){
            if (config.ApplicationMode == "DEVELOPMENT") {
                return response.fail(res, err.message)
            }else{
                return response.fail(res, "Failed to upload files")
            }
        }
        // Everything went fine.
        next()
    })
}

export { upload }