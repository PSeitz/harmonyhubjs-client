var debug = require('debug')('harmonyjs:login:auth')
	, request = require('request')
	, Q = require('q')
	, logitechUrl = 'https://svcs.myharmony.com/CompositeSecurityServices/' +
					'Security.svc/json/GetUserAuthToken';

/** Function: getUserAuthToken
 * Connects to Logitechs web service to retrieve a userAuthToken. This token
 * then can be used to login to a Harmony hub as guest.
 *
 * Parameters:
 *     (String) email - E-mail address of a Harmony account
 *     (String) password - Password of a Harmony account
 *
 * Returns:
 *     (Q.promise) - When resolved, passes the userAuthToken.
 */
function getUserAuthToken(email, password) {
	debug('retrieve userAuthToken from logitech');

	var deferred = Q.defer();

	request.post({
		method: 'post'
		, url: logitechUrl
		, json: true
		, body: {
			email: email
			, password: password
		}}
		, function(error, response, body) {
			if(!error) {
				if(!body.ErrorCode) {
					debug('userAuthToken retrieved');

					var authToken = body.GetUserAuthTokenResult.UserAuthToken;
					deferred.resolve(authToken);
				} else {
					debug('failed to retrieve userAuthToken');

					deferred.reject(new Error(
						'Could not retrieve userAuthToken via Logitech! ' +
						'Please check email & password.'
					));
				}
			} else {
				debug('HTTP error');
				deferred.reject(error);
			}
		}
	);

	return deferred.promise;
}

module.exports = getUserAuthToken;