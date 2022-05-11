import {UserToken} from "../store/user";
import axios, {AxiosRequestConfig} from "axios";

export const uploadImage = (image: any, removeEmptyProgresses: Function, currentAppealTempId: { current: string }, success: Function, error: Function, onUploadProgress: Function) => {
    removeEmptyProgresses()
    let data = new FormData();
    data.append('token', UserToken());
    data.append('file', image);
    data.append('appealID', currentAppealTempId.current);
    data.append('uploadedAsFile', '0');

    let config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://apidl.unimun.me/appealUpload.php',
        headers: {},
        data: data,
        onUploadProgress: (progressEvent: any) => {
            onUploadProgress(progressEvent)
        }
    };

    axios(config)
        .then(function (response) {
            success(response)
        })

        .catch(function (er) {
            error(er)
        });

}


export const uploadBookImages = (image: any, removeEmptyProgresses: Function, currentBookId: { current: string }, success: Function, error: Function, onUploadProgress: Function) => {
    removeEmptyProgresses()
    let data = new FormData();
    data.append('token', UserToken());
    data.append('file', image);
    data.append('bookID', currentBookId.current);
    data.append('uploadedAsFile', '0');

    let config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://apidl.unimun.me/bookUpload.php',
        headers: {},
        data: data,
        onUploadProgress: (progressEvent: any) => {
            onUploadProgress(progressEvent)
        }
    };

    axios(config)
        .then(function (response) {
            success(response)
        })

        .catch(function (er) {
            error(er)
        });

}
export const uploadBookFile = (image: any, removeEmptyProgresses: Function, currentBookId: { current: string }, success: Function, error: Function, onUploadProgress: Function) => {
    removeEmptyProgresses()

    let data = new FormData();
    data.append('token', UserToken());
    data.append('file', image);
    data.append('bookID', currentBookId.current);
    data.append('uploadedAsFile', '1');

    let config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://apidl.unimun.me/bookUpload.php',
        headers: {},
        data: data,
        onUploadProgress: (progressEvent: any) => {
            onUploadProgress(progressEvent)
        }
    };

    axios(config)
        .then(function (response) {
            success(response)
        })

        .catch(function (er) {
            error(er)
        });

}