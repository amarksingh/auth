import type { IAuthenticatable } from '@ostro/contracts/auth/authenticatable';

/**
 * Class Authenticatable.
 */
class Authenticatable implements IAuthenticatable {

    $rememberTokenName: string = 'remember_token';
    
    $apiTokenName: string = 'api_token';

    /**
     * getAuthIdentifierName method.
     * @returns {any}
     */
    getAuthIdentifierName() {
        return this.getKeyName();
    }

    /**
     * getAuthIdentifier method.
     * @returns {any}
     */
    getAuthIdentifier() {
        return this[this.getAuthIdentifierName()];
    }

    /**
     * getAuthIdentifierForBroadcasting method.
     * @returns {any}
     */
    getAuthIdentifierForBroadcasting() {
        return this.getAuthIdentifier();
    }

    /**
     * getAuthPassword method.
     * @returns {any}
     */
    getAuthPassword() {
        return this.password;
    }

    /**
     * getRememberToken method.
     * @returns {any}
     */
    getRememberToken() {
        if (this.getRememberTokenName()) {
            return this[this.getRememberTokenName()];
        }
    }

    /**
     * setRememberToken method.
     * @param {*} $value
     * @returns {any}
     */
    setRememberToken($value: any) {
        if (this.getRememberTokenName()) {
            this[this.getRememberTokenName()] = $value;
        }
    }

    /**
     * getRememberTokenName method.
     * @returns {any}
     */
    getRememberTokenName() {
        return this.$rememberTokenName;
    }

    /**
     * getApiToken method.
     * @returns {any}
     */
    getApiToken() {
        if (this.getApiTokenName()) {
            return this[this.getApiTokenName()];
        }
    }

    /**
     * setApiToken method.
     * @param {*} $value
     * @returns {any}
     */
    setApiToken($value: any) {
        if (this.getApiTokenName()) {
            this[this.getApiTokenName()] = $value;
        }
    }

    /**
     * getApiTokenName method.
     * @returns {any}
     */
    getApiTokenName() {
        return this.$apiTokenName;
    }
}

module.exports = Authenticatable