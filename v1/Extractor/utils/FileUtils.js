import mimeTypes from 'mime-types';
import path from 'path';

function ValidateFileType (mimetype) {
    const validTypes = ['application/pdf'];
    return validTypes.includes(mimetype);
}

function ValidateFields(objList) {

  // check for object length
  if (!objList || Object.keys(objList).length != 1) {
    return false;
  }

  // check for required fields: admin, user
  if (!objList.file) {
    return false;
  }
  
  return true;
}

export { ValidateFileType, ValidateFields };
