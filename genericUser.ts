const GenericUserInterface = require('@ostro/contracts/auth/genericUser')
/**
 * Class GenericUser.
 */
class GenericUser extends GenericUserInterface {

    /**
     * Create a new instance.
     * @param {*} $attributes
     */
    constructor($attributes: Record<string, any>) {
        super()
        this.$attributes = $attributes;
    }

    /**
     * getAuthIdentifierName method.
     * @returns {any}
     */
    getAuthIdentifierName() {
        return 'id';
    }

    /**
     * getAuthIdentifier method.
     * @returns {any}
     */
    getAuthIdentifier() {
        return this.$attributes[this.getAuthIdentifierName()];
    }

    /**
     * getAuthPassword method.
     * @returns {any}
     */
    getAuthPassword() {
        return this.$attributes['password'];
    }

    /**
     * getRememberToken method.
     * @returns {any}
     */
    getRememberToken() {
        return this.$attributes[this.getRememberTokenName()];
    }

    /**
     * setRememberToken method.
     * @param {*} $value
     * @returns {any}
     */
    setRememberToken($value: any) {
        this.$attributes[this.getRememberTokenName()] = $value;
    }

    /**
     * getRememberTokenName method.
     * @returns {any}
     */
    getRememberTokenName() {
        return 'remember_token';
    }

    /**
     * setApiToken method.
     * @param {*} $value
     * @returns {any}
     */
    setApiToken($value: any) {
        this.$attributes[this.getApiTokenName()] = $value;
    }

    /**
     * getApiTokenName method.
     * @returns {any}
     */
    getApiTokenName() {
        return 'api_token';
    }

    /**
     * toJSON method.
     * @returns {any}
     */
    toJSON() {
        return this.$attributes
    }


    /**
     * __get method.
     * @param {*} $key
     * @returns {any}
     */
    __get($key: string) {
        return this.$attributes[$key];
    }

    /**
     * __set method.
     * @param {*} $key
     * @param {*} $value
     * @returns {any}
     */
    __set($key: string, $value: any) {
        this.$attributes[$key] = $value;
    }


}

module.exports = GenericUser