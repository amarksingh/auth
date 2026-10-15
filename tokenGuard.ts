const GuardHelpers = require('./guardHelpers')
const { implement } = require('@ostro/support/function')
const { createHash } = require('crypto');
const Crypt = require('@ostro/support/facades/crypt')

/**
 * Class TokenGuard.
 */
class TokenGuard extends GuardHelpers {

    $hash;

    $request;

    $provider;

    $inputKey = 'api_token';

    $storageKey = 'api_token';

    /**
     * Create a new instance.
     * @param {*} $provider
     * @param {*} $request
     * @param {*} $inputKey
     * @param {*} $storageKey
     * @param {*} $hash
     */
    constructor($provider: any, $request: any, $inputKey: string = 'api_token', $storageKey: string = 'api_token', $hash: boolean = false) {
        super()
        this.$hash = $hash;
        this.$request = $request;
        this.$provider = $provider;
        this.$inputKey = $inputKey;
        this.$storageKey = $storageKey;
    }

    /**
     * hasValidCredentials method.
     * @async
     * @param {*} $user
     * @param {*} $credentials
     * @returns {any}
     */
    async hasValidCredentials($user: Record<string, any>, $credentials: Record<string, any>) {
        return !is_null($user) && await this.$provider.validateCredentials($user, $credentials);

    }

    /**
     * attempt method.
     * @async
     * @param {*} $credentials
     * @returns {any}
     */
    async attempt($credentials: Record<string, any> = {}) {
        let $user = await this.$provider.retrieveByCredentials($credentials);
        this.$lastAttempted = $user;

        if (await this.hasValidCredentials($user, $credentials)) {
            this.$user = $user;
            await this.user();

            return true;
        }

        return false;
    }

    /**
     * user method.
     * @async
     * @returns {any}
     */
    async user() {

        if (!is_null(this.$user)) {
            return this.$user;
        }

        let $user = null;

        let $token = this.getTokenForRequest();
        if (!empty($token)) {
            $user = await this.$provider.retrieveByCredentials({
                [this.$storageKey]: this.$hash ? createHash('sha256').update($token).digest('hex') : $token,
            });
        }

        return this.$user = $user;
    }

    /**
     * getTokenForRequest method.
     * @returns {any}
     */
    getTokenForRequest() {
        let $token = this.$request.getQuery(this.$inputKey);
        if (empty($token)) {
            $token = this.$request.input(this.$inputKey);
        }

        if (empty($token)) {
            $token = this.$request.bearerToken();
        }

        if (empty($token)) {
            $token = this.$request.getPassword();
        }

        return $token;
    }

    /**
     * validate method.
     * @async
     * @param {*} $credentials
     * @returns {any}
     */
    async validate($credentials: Record<string, any> = {}) {

        if (empty($credentials[this.$inputKey])) {
            return false;
        }

        $credentials = {
            [this.$storageKey]: $credentials[this.$inputKey]
        };

        if (await this.$provider.retrieveByCredentials($credentials)) {
            return true;
        }

        return false;
    }

}

module.exports = TokenGuard