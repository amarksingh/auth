const GenericUser = require('./genericUser')
const { hash_equals } = require('@ostro/support/function')
/**
 * Class DatabaseUserProvider.
 */
class DatabaseUserProvider {

    $conn;

    $table;

    $hasher;

    /**
     * Create a new instance.
     * @param {*} $conn
     * @param {*} $hasher
     * @param {*} $table
     */
    constructor($conn, $hasher, $table) {
        this.$conn = $conn;
        this.$table = $table;
        this.$hasher = $hasher;
    }

    /**
     * retrieveById method.
     * @async
     * @param {*} $identifier
     * @returns {any}
     */
    async retrieveById($identifier) {
        let $user = await this.$conn.table(this.$table).find($identifier);

        return this.getGenericUser($user);
    }

    /**
     * retrieveByToken method.
     * @async
     * @param {*} $identifier
     * @param {*} $token
     * @returns {any}
     */
    async retrieveByToken($identifier, $token) {
        let $user = this.getGenericUser(
            await this.$conn.table(this.$table).where($identifier, $token).first()
        );

        return $user && $user.getRememberToken() && hash_equals($user.getRememberToken(), $token) ?
            $user : null;
    }

    /**
     * updateRememberToken method.
     * @async
     * @param {*} $user
     * @param {*} $token
     * @returns {any}
     */
    async updateRememberToken($user, $token) {
        await this.$conn.table(this.$table)
            .where($user.getAuthIdentifierName(), $user.getAuthIdentifier())
            .update({
                [$user.getRememberTokenName()]: $token
            });
    }

    /**
     * retrieveByCredentials method.
     * @async
     * @param {*} $credentials
     * @returns {any}
     */
    async retrieveByCredentials($credentials = {}) {
        if (empty($credentials) || (count($credentials) === 1 && String.contains(this.firstCredentialKey($credentials), 'password'))) {
            return;
        }

        let $query = this.$conn.table(this.$table);

        for (let $key in $credentials) {
            let $value = $credentials[$key]
            if (String.contains($key, 'password')) {
                continue;
            }

            if (Array.isArray($value) || $value instanceof Array) {
                $query.whereIn($key, $value);
            } else {
                $query.where($key, $value);
            }
        }

        let $user = await $query.first();

        return this.getGenericUser($user);
    }

    /**
     * firstCredentialKey method.
     * @param {*} $credentials
     * @returns {any}
     */
    firstCredentialKey($credentials) {
        for (let $key in $credentials) {
            return $key;
        }
    }

    /**
     * getGenericUser method.
     * @param {*} $user
     * @returns {any}
     */
    getGenericUser($user) {
        if (!is_null($user)) {
            return new GenericUser($user);
        }
    }

    /**
     * validateCredentials method.
     * @param {*} $user
     * @param {*} $credentials
     * @returns {any}
     */
    validateCredentials($user, $credentials = {}) {
        return this.$hasher.check(
            $credentials['password'], $user.getAuthPassword()
        );
    }
}

module.exports = DatabaseUserProvider