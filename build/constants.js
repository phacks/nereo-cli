'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const NEREO_API_URL = exports.NEREO_API_URL = 'https://absences.nereo.com/api';
const NEREO_MIN_DATE = exports.NEREO_MIN_DATE = '2017-09-01';
const NEREO_MAX_DATE = exports.NEREO_MAX_DATE = '2017-09-30';
const NEREO_RC_PATH = exports.NEREO_RC_PATH = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.nereorc';