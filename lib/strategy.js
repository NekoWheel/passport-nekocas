/**
 * Module dependencies.
 */
var passport = require('passport-strategy');
var NekoCAS = require('nekocas');
var url = require('url');
/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('nekocas Strategy requires a verify callback'); }

  
  passport.Strategy.call(this);
  this.name = 'nekocas';
  this.serviceBaseURL = options.serviceBaseURL;
  this.secret = options.secret;
  this.domain = options.domain;
  this._verify = verify;
}


/**
 * Get service url.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.service = function(req){
  var serviceURL = this.serviceURL || req.originalUrl;
  var resolvedURL = url.resolve(this.serviceBaseURL, serviceURL);
  var parsedURL = url.parse(resolvedURL, true);
  delete parsedURL.query.ticket;
  delete parsedURL.search;
  return url.format(parsedURL);
};


/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  
  var ticket = req.param('ticket');
  if (!ticket) {
    var redirectURL = url.parse(this.domain + '/login', true);
    redirectURL.query.service = this.service(req);
    return this.redirect(url.format(redirectURL));
  }

  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  var cas = new NekoCAS(this.domain, this.secret);
  
  cas.validate(ticket).then((data) => {
    this._verify(data, verified);
  }).catch((err)=>{
    return self.error(err);
  })

};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;