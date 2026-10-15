require('@ostro/support/helpers')
const Manager = require('@ostro/support/manager')
const InvalidArgumentException = require('@ostro/support/exceptions/invalidArgumentException')
const CreatesUserProvider = require('./createsUserProviders')
const SessionGuard = require('./sessionGuard')
const TokenGuard = require('./tokenGuard')
const AuthRequest = require('./authRequest')

/**
 * Class AuthManager.
 */
class AuthManager extends implement(Manager, CreatesUserProvider) {

    $type = 'auth';

    /**
     * Create a new instance.
     * @param {*} $app
     */
    constructor($app: any) {
        super($app)
        Object.defineProperties(this, {
            $userResolver: {
                value: function($guard = null) {
                    return this.guard($guard).user();
                },
                writable: true
            }
        })
    }

    /**
     * guard method.
     * @param {*} $name
     * @returns {any}
     */
    guard($name: any = null) {
        return this.driver($name)
    }

    /**
     * resolve method.
     * @param {*} $name
     * @returns {any}
     */
    resolve($name: string) {
        let $config = this.getConfig($name);
        if (!$config) {
            throw new InvalidArgumentException(`Auth guard [${$name}] is not defined.`);
        }
        return super.resolve($name, $config)
    }

    /**
     * start method.
     * @returns {any}
     */
    start() {
        return (request, response, next) => {
            request.auth = new AuthRequest(request, this)
            request.user = function($guard) {
                return this.auth.guard($guard).user()
            }
            next()
        }
    }

    /**
     * createSessionDriver method.
     * @param {*} $config
     * @param {*} $name
     * @returns {any}
     */
    createSessionDriver($config: Record<string, any>, $name: string) {
        let $provider = this.createUserProvider($config['provider'] || null);

        return ($request) => {

            return new SessionGuard($name, $provider, $request);
        }

    }

    /**
     * createTokenDriver method.
     * @param {*} $config
     * @param {*} $name
     * @returns {any}
     */
    createTokenDriver($config: Record<string, any>, $name: string) {

        let $provider = this.createUserProvider($config['provider'] || null)
        return ($request) => {
            return new TokenGuard(
                $provider,
                $request,
                $config['input_key'] || 'api_token',
                $config['storage_key'] || 'api_token',
                $config['hash'] || false
            );
        }

    }

    /**
     * getConfig method.
     * @param {*} name
     * @returns {any}
     */
    getConfig(name: string) {
        return super.getConfig(`guards.${name}`);
    }

    /**
     * getDefaultDriver method.
     * @returns {any}
     */
    getDefaultDriver() {
        return super.getConfig(`defaults.guard`);
    }

    /**
     * userResolver method.
     * @returns {any}
     */
    userResolver() {
        return this.$userResolver;
    }

    /**
     * resolveUsersUsing method.
     * @param {*} $userResolver
     * @returns {any}
     */
    resolveUsersUsing($userResolver: Function) {
        this.$userResolver = $userResolver;
        return this;
    }

    /**
     * provider method.
     * @param {*} $name
     * @param {*} $callback
     * @returns {any}
     */
    provider($name: string, $callback: Function) {
        this.$customProviderCreators[$name] = $callback;
        return this;
    }

    /**
     * hasResolvedGuards method.
     * @returns {any}
     */
    hasResolvedGuards() {
        return count(this.$drivers) > 0;
    }

    /**
     * forgetGuards method.
     * @returns {any}
     */
    forgetGuards() {
        return this.forgetDrivers()
    }

}

module.exports = AuthManager