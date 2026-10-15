/**
 * Class EloquentUserProvider.
 */
class EloquentUserProvider {

    $model;

    $hasher;

    /**
     * Create a new instance.
     * @param {*} $hasher
     * @param {*} $model
     */
    constructor($hasher: boolean, $model: any) {
        this.$model = $model;
        this.$hasher = $hasher;
    }

    /**
     * retrieveById method.
     * @param {*} $identifier
     * @returns {any}
     */
    retrieveById($identifier: string) {
        let $model = this.createModel();

        return this.newModelQuery($model)
            .where($model.getAuthIdentifierName(), $identifier)
            .first();
    }

    /**
     * retrieveByToken method.
     * @async
     * @param {*} $identifier
     * @param {*} $token
     * @returns {any}
     */
    async retrieveByToken($identifier: string, $token: string) {
        let $model = this.createModel();

        let $retrievedModel = await this.newModelQuery($model).where(
            $model.getAuthIdentifierName(), $identifier
        ).first();

        if (!$retrievedModel) {
            return;
        }

        let $rememberToken = $retrievedModel.getRememberToken();
        return $rememberToken && $rememberToken == $token ?
            $retrievedModel : null;
    }

    /**
     * updateRememberToken method.
     * @param {*} $user
     * @param {*} $token
     * @returns {any}
     */
    updateRememberToken($user: Record<string, any>, $token: string) {
        $user.setRememberToken($token);

        return $user.save();

    }

    /**
     * retrieveByCredentials method.
     * @param {*} $credentials
     * @returns {any}
     */
    retrieveByCredentials($credentials: Record<string, any>) {
        if (empty($credentials) ||
            (count($credentials) === 1 &&
                String.contains(this.firstCredentialKey($credentials), 'password'))) {
            return;
        }

        let $query = this.newModelQuery();

        for (let $key in $credentials) {
            let $value = $credentials[$key]
            if (String.contains($key, 'password')) {
                continue;
            }
            if (is_array($value) || $value instanceof Array) {
                $query.whereIn($key, $value);
            } else {
                $query.where($key, $value);
            }
        }

        return $query.first();
    }

    /**
     * firstCredentialKey method.
     * @param {*} $credentials
     * @returns {any}
     */
    firstCredentialKey($credentials: Record<string, any>) {
        for (let $key in $credentials) {
            return $key;
        }
    }

    /**
     * validateCredentials method.
     * @param {*} $user
     * @param {*} $credentials
     * @returns {any}
     */
    validateCredentials($user: Record<string, any>, $credentials: Record<string, any>) {
        let $plain = $credentials['password'];
        return this.$hasher.check($plain, $user.getAuthPassword());
    }

    /**
     * newModelQuery method.
     * @param {*} $model
     * @returns {any}
     */
    newModelQuery($model: any = null) {
        return is_null($model) ?
            this.createModel().newQuery() :
            $model.newQuery();
    }

    /**
     * createModel method.
     * @returns {any}
     */
    createModel() {
        return new this.$model;
    }

    /**
     * getHasher method.
     * @returns {any}
     */
    getHasher() {
        return this.$hasher;
    }

    /**
     * setHasher method.
     * @param {*} $hasher
     * @returns {any}
     */
    setHasher($hasher: boolean) {
        this.$hasher = $hasher;

        return this;
    }

    /**
     * getModel method.
     * @returns {any}
     */
    getModel() {
        return this.$model;
    }

    /**
     * setModel method.
     * @param {*} $model
     * @returns {any}
     */
    setModel($model: any) {
        this.$model = $model;

        return this;
    }
}

module.exports = EloquentUserProvider