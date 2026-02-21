/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import chai from 'chai';

import { isErrorWithCode, looksLikeAnErrnoException } from '../lib/misc.js';

chai.should();

describe('misc helpers', () => {
  describe('isErrorWithCode()', () => {
    it('should return true for an Error with a code property', () => {
      const err = Object.assign(new Error('test'), { code: 'ENOENT' });
      isErrorWithCode(err).should.be.ok;
    });

    it('should return false for a plain Error without code', () => {
      isErrorWithCode(new Error('test')).should.not.be.ok;
    });

    it('should return false for non-Error values', () => {
      isErrorWithCode(null).should.not.be.ok;
      isErrorWithCode(undefined).should.not.be.ok;
      isErrorWithCode('ENOENT').should.not.be.ok;
      isErrorWithCode({ code: 'ENOENT' }).should.not.be.ok;
    });
  });

  describe('looksLikeAnErrnoException()', () => {
    it('should return true for an Error with both code and path', () => {
      const err = Object.assign(new Error('test'), { code: 'ENOENT', path: '/some/file' });
      looksLikeAnErrnoException(err).should.be.ok;
    });

    it('should return false for an Error with code but no path', () => {
      const err = Object.assign(new Error('test'), { code: 'ENOENT' });
      looksLikeAnErrnoException(err).should.not.be.ok;
    });

    it('should return false for a plain Error', () => {
      looksLikeAnErrnoException(new Error('test')).should.not.be.ok;
    });

    it('should return false for non-Error values', () => {
      looksLikeAnErrnoException(null).should.not.be.ok;
      looksLikeAnErrnoException({ code: 'ENOENT', path: '/file' }).should.not.be.ok;
    });
  });
});
