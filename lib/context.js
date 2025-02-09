'use strict';

const logger = require('hexo-log');
const { underline } = require('picocolors');
const { EventEmitter } = require('events');
const Promise = require('bluebird');
const ConsoleExtend = require('./extend/console');

// a stub Hexo object
// see `hexojs/hexo/lib/hexo/index.js`

class Context extends EventEmitter {
  constructor(base = process.cwd(), args = {}) {
    super();
    this.base_dir = base;
    this.log = logger(args);

    this.extend = {
      console: new ConsoleExtend()
    };
  }

  init() {
    // Do nothing
  }

  call(name, args, callback) {
    if (!callback && typeof args === 'function') {
      callback = args;
      args = {};
    }

    return new Promise((resolve, reject) => {
      const c = this.extend.console.get(name);

      if (c) {
        c.call(this, args).then(resolve, reject);
      } else {
        reject(new Error(`Console \`${name}\` has not been registered yet!`));
      }
    }).asCallback(callback);
  }

  exit(err) {
    if (err) {
      this.log.fatal(
        {err},
        'Something\'s wrong. Maybe you can find the solution here: %s',
        underline('http://hexo.io/docs/troubleshooting.html')
      );
    }

    return Promise.resolve();
  }

  unwatch() {
    // Do nothing
  }
}

module.exports = Context;
