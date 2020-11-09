import ApiUrl from './api-url.js';

/**
 * 自定义 Error 类
 *
 * code == 0 正确
 * code > 0 HTTP 请求，服务器端返回的错误码
 * code == -1 HTTP 请求，服务器返回的数据格式不正确，服务器错误
 */
export function MyError(message, code, extra) {
  if (!Error.captureStackTrace) {
    this.stack = (new Error()).stack;
  } else {
    Error.captureStackTrace(this, this.constructor);
  }
  this.message = message;
  this.code = code;
  this.extra = extra;
}

MyError.prototype = new Error();
MyError.prototype.name = 'MyError';
MyError.prototype.constructor = MyError;

export const CancelAuthError = new MyError('没有授权', -100);

// 可以把 wx 对象里的方法(传入参数中包含 success 和 fail)转换为返回 promise 的方法
function promisifyWx(name) {
  return function (param) {
    console.log('wx.' + name + ' [executing] ->', param);
    return new Promise((resolve, reject) => {
      let base = {
        success: (res) => {
          console.log('wx.' + name + ' [success]:', res);
          resolve(res);
        },
        fail: (err) => {
          console.log('wx.' + name + ' [fail]:', err);
          reject(new MyError(err.errMsg, -2));
        }
      };
      wx[name](Object.assign({}, param, base));
    });
  };
}

exports.wx = {};

for (let name in wx) {
  exports.wx[name] = promisifyWx(name);
}

export function genReqBody(token, param, unionId, userId) {
  let body = {
    appId: 1,
    unionId: unionId,
    token: token,
    userId: userId,
    param: param
  };

  return body;
}

/**
* 对 Tool.wx.request 进一步处理
*/
export function request(url, token, param, unionId, userId, callback) {
  let p = exports.wx.request({
    url,
    method: 'POST',
    data: genReqBody(token, param, unionId, userId)
  }).then(res => {
    let resBody = res.data;
    if (resBody && typeof resBody === 'object') {
      if (resBody.code === 0) {
        return resBody.data;
      } else if (resBody.code > 0) {
        let message = resBody.showMsg || '服务器错误';
        let extra;
        if (message.length > 50) {
          extra = message;
          message = '服务器错误';
        }
        throw new MyError(message, resBody.code, extra);
        wx.showToast({
          title: message,
          duration: 1000,
          icon: 'none'
        })
      }
    }
    throw new MyError('服务器错误', -1, resBody);
  }, err => {
    throw new MyError('没有网络连接或服务器错误', err.code, err);
  });

  if (typeof callback === 'function') {
    p.then(data => callback(null, data), callback);
  } else {
    return p;
  }
}

/**
* @param {string} options.fn
* @param {string} options.confirm.title
* @param {string} options.confirm.content
* @param {string} options.confirm.showCancel
* @param {object} options.params
* @param {boolean} options.onlyOnce
*/
export function ensureAuth(options) {
  return exports.wx[options.fn]({ ...options.params })
    .then(res => res, err => {
      if (err && err.message && /auth deny/i.test(err.message)) {
        return exports.wx.showModal({
          showCancel: options.confirm.showCancel,
          title: options.confirm.title,
          content: options.confirm.content,
        }).then(res => {
          if (res.confirm) {
            return exports.wx.openSetting()
              .then(res => {
                if (options.onlyOnce) {
                  throw err;
                } else {
                  return ensureAuth(options);
                }
              });
          } else {
            throw CancelAuthError;
          }
        });
      } else {
        throw err;
      }
    });
}

export function login() {
  let options = {
    fn: 'getUserInfo',
    confirm: {
      title: '微信授权',
      content: '击掌王者需要获得你的公开信息（昵称、头像等）',
      showCancel: true
    }
  };

  return Promise.all([
    exports.wx.login(),
    ensureAuth(options)
  ]).then(res => {
    let code = res[0].code;
    let userInfo = res[1].userInfo;
    let param = {
      code: code,
      encryptedData: res[1].encryptedData,
      iv: res[1].iv,
    };

    return exports.wx.request({
      url: ApiUrl.user.login,
      method: 'POST',
      data: genReqBody('', param, '')
    }).then(res => {
      if (res.data.code === 0) {
        return {
          loginInfo: res.data.data
        };
      } else {
        let message = res.data.showMsg || '服务器错误';
        let extra;
        if (message.length > 50) {
          extra = message;
          message = '服务器错误';
        }
        throw new MyError(message, res.data.code, extra);
      }
    })
  });
}

export function getSystemInfo() {
  return Promise.all([
    exports.wx.getSystemInfo()
  ]).then(res => {
    return {
      systemInfo: res[0]
    };
  })
}