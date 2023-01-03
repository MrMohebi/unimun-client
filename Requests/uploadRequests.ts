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


export const uploadBookImages = (image: any, currentBookId: string, success: Function, error: Function, onUploadProgress: Function) => {
    // removeEmptyProgresses()
    let data = new FormData();
    data.append('token', UserToken());
    data.append('file', image);
    data.append('bookID', currentBookId);
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
export const uploadBookFile = (image: any, removeEmptyProgresses: Function, currentBookId: string, success: Function, error: Function, onUploadProgress: Function) => {
    removeEmptyProgresses()

    let data = new FormData();
    // data.append('token', UserToken());
    data.append('id', currentBookId);
    data.append('file', image);
    data.append('uploadedAsFile', '1');

    let config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://dl.unimun.me/public/book',
        headers: {
            token: UserToken()
        },
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
export const uploadPublicBookFile = (file: any, removeEmptyProgresses: Function, currentBookId: string, success: Function, error: Function, onUploadProgress: Function) => {
    removeEmptyProgresses()

    let data = new FormData();
    // data.append('token', UserToken());
    data.append('id', currentBookId);
    data.append('file', file);
    data.append('uploadedAsFile', '1');

    let config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://dl.unimun.me/public/book',
        headers: {
            token: UserToken()
        },
        data: data,
        onUploadProgress: (progressEvent: any) => {
            onUploadProgress(progressEvent)
        }
    };

    axios(config)
        .then(function (response: any) {
            success(response)
        })

        .catch(function (er: any) {
            error(er)
        });

}
export const uploadPrivateBookFile = (file: any, removeEmptyProgresses: Function, currentBookId: string, success: Function, error: Function, onUploadProgress: Function) => {
    removeEmptyProgresses()

    let data = new FormData();
    // data.append('token', UserToken());
    data.append('id', currentBookId);
    data.append('file', file);
    data.append('uploadedAsFile', '1');

    let config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://dl.unimun.me/private/book',
        headers: {
            token: UserToken()
        },
        data: data,
        onUploadProgress: (progressEvent: any) => {
            onUploadProgress(progressEvent)
        }
    };

    axios(config)
        .then(function (response: any) {
            success(response)
        })

        .catch(function (er: any) {
            error(er)
        });

}





