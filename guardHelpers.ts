const AuthenticationException = require('./authenticationException');

/**
 * Class GuardHelpers.
 */
class GuardHelpers {

    /**
     * authenticate method.
     * @async
     * @returns {any}
     */
    async authenticate() {
        let $user = await this.user()
        if (!is_null($user)) {
            return $user;
        }

        throw new AuthenticationException;
    }

    /**
     * hasUser method.
     * @returns {any}
     */
    hasUser() {
        return !is_null(this.$user);
    }

    /**
     * check method.
     * @async
     * @returns {any}
     */
    async check() {
        return !is_null(await this.user());
    }

    /**
     * guest method.
     * @async
     * @returns {any}
     */
    async guest() {
        return !await this.check();
    }

    /**
     * id method.
     * @async
     * @returns {any}
     */
    async id() {
        if (await this.user()) {
            return (await this.user()).getAuthIdentifier();
        }
    }

    /**
     * setUser method.
     * @param {*} $user
     * @returns {any}
     */
    setUser($user: Record<string, any>) {
        this.$user = $user;

        return this;
    }

    /**
     * getProvider method.
     * @returns {any}
     */
    getProvider() {
        return this.$provider;
    }

    /**
     * setProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    setProvider($provider: any) {
        this.$provider = $provider;
    }
}

module.exports = GuardHelpers