const ServiceProvider = require('@ostro/support/serviceProvider')
const AuthManager = require('./authManager')
/**
 * Class AuthServiceProvider.
 */
class AuthServiceProvider extends ServiceProvider {

    /**
     * register method.
     * @returns {any}
     */
    register() {
        this.registerAuthenticator();

    }

    /**
     * registerAuthenticator method.
     * @returns {any}
     */
    registerAuthenticator() {
        this.$app.singleton('auth', function($app) {
            return new AuthManager($app);
        });

    }
    /**
     * boot method.
     * @returns {any}
     */
    boot() {
        this.$app.singleton('auth.driver', function($app) {
            return $app['auth'].guard();
        });
    }

    /**
     * registerUserResolver method.
     * @returns {any}
     */
    registerUserResolver() {
        this.$app.bind('@ostro/contracts/auth/authenticatable', function($app) {
            return call_user_func($app['auth'].userResolver());
        });
    }

    /**
     * registerRequestRebindHandler method.
     * @returns {any}
     */
    registerRequestRebindHandler() {
        this.$app.rebinding('request', function($app, $request) {
            $request.setUserResolver(function($guard = null) {
                return call_user_func($app['auth'].userResolver(), $guard);
            });
        });
    }

}

module.exports = AuthServiceProvider