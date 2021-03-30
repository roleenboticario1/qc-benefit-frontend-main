import http from "../http-common";

class UploadFileService {
  
  /**
   * Upload files to S3
   * @param  {[type]} data             [description]
   * @param  {[type]} onUploadProgress [description]
   * @return {[type]}                  [description]
   */
  uploadfiles(data, onUploadProgress) {
  	let formData = new FormData();
  	formData.append("desc[]", data.desc);
  	formData.append("file[]", data.file);
  	formData.append("transactionId", data.transactionId);
  	formData.append("userid", data.userId);

  	console.log(formData);

    return http.post("/uploadfiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }, onUploadProgress
    });
  }

  /**
   * Download data file from s3
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  downloadfile(data) {
    return http.get("/uploadfiles/download", data);
  }

  /**
   * Get list of files.
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  getFilePerTransaction(data) {
    return http.post("/uploadfiles/getListPerTransaction", data);
  }
}

export default new UploadFileService();