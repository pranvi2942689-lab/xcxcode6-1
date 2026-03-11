const { BASE_URL } = require('../config/index');

function request(options) {
  const {
    url,
    method = 'GET',
    data,
    timeout = 10000
  } = options;

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      timeout,
      header: {
        'Content-Type': 'application/json'
      },
      success(response) {
        const { statusCode, data: body } = response;

        if (statusCode >= 200 && statusCode < 300 && body && body.code === 0) {
          resolve(body.data);
          return;
        }

        reject(new Error((body && body.message) || '请求失败'));
      },
      fail(error) {
        reject(new Error(error.errMsg || '网络异常'));
      }
    });
  });
}

request.get = (url, data) => request({ url, method: 'GET', data });
request.post = (url, data) => request({ url, method: 'POST', data });

module.exports = request;
