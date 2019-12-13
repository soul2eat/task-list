import $ from 'jquery';

const { REACT_APP_API_PATH } = process.env;

export async function sendBackand({ path = '', objData, query, callback }) {
    let queryString = '?developer=Igor';
    if (query) {
        for (let key in query) {
            queryString += '&' + key + '=' + query[key];
        }
    }
    const url = REACT_APP_API_PATH + '~shapoval/test-task-backend/v2' + path + '/' + queryString;

    if (!objData) {
        // for get action
        return $.ajax({
            url,
            crossDomain: true,
            method: 'GET',
            mimeType: "multipart/form-data",
            contentType: false,
            processData: false,
            dataType: "json",
            success: callback,
            error: function () {
                callback({
                    status: 'error',
                    message: {
                        error: 'Ошибка соединения с сервером'
                    }
                })
            }
        });
    }
    // generate form data
    const form = new FormData();
    for (let key in objData) {
        form.append(key, objData[key]);
    }

    $.ajax({
        url,
        crossDomain: true,
        method: 'POST',
        mimeType: "multipart/form-data",
        contentType: false,
        processData: false,
        data: form,
        dataType: "json",
        success: callback,
        error: function () {
            callback({
                status: 'error',
                message: {
                    error: 'Ошибка соединения с сервером'
                }
            })
        }
    });
}
/**
 * 
 * @param {} arg {'path'='/', 'objData', 'query', 'callback'}
 */
export function sendWithPromise(arg) {
    return new Promise(res => {
        sendBackand({ ...arg, callback: res });
    })
}