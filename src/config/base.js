const Enum = require('enum');

const AppEnvironment = buildEnv();
function buildEnv() {
  let appEnvironment = new Enum({});
  appEnvironment.DEV = 'development';
  appEnvironment.PROD = 'production';
  appEnvironment.TEST = 'test';
  return appEnvironment;
}

function getEnv() {
  const value = process.env.NODE_ENV;
  if (value && !Object.values(AppEnvironment).includes(value)) {
    throw new Error(`Invalid environment: ${value}`);
  }
  return value;
}

function isDev() {
  return getEnv() === AppEnvironment.DEV.value;
}

function isProd() {
  return getEnv() === AppEnvironment.PROD.value;
}

function isTest() {
  return getEnv() === AppEnvironment.TEST.value;
}

function isDebugMode() {
  return process.env.DEBUG_MODE === '1' || false;
}


module.exports = {
  getEnv,
  isDev,
  isProd,
  isTest,
  isDebugMode,
  AppEnvironment
};