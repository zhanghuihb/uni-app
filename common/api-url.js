// const ENV = 'dev';
const ENV = 'prod';

let baseUrl = {
  mongo: {
    dev: 'http://192.168.2.132:8090/mongo',
    prod: 'http://106.14.47.3:8090/mongo'
  }
};

const b = (c = 'mongo', e = 'dev') => {
  if (ENV !== 'dev') {
    return baseUrl[c][ENV];
  } else {
    return baseUrl[c][e];
  }
};

export default {
  mongo: {
    login: b('mongo') + '/user/skip/login',
    saveOpinion: b('mongo') + '/opinion/saveOpinion'
  }
}