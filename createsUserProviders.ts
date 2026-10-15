const InvalidArgumentException = require('@ostro/support/exceptions/invalidArgumentException')
const DatabaseUserProvider = require('./databaseUserProvider')
const EloquentUserProvider = require('./eloquentUserProvider')

/**
 * Class CreatesUserProviders.
 */
class CreatesUserProviders {

    $customProviderCreators = {};

    /**
     * createUserProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    createUserProvider($provider: any = null) {
        let $config = this.getProviderConfiguration($provider)
        if (is_null($config)) {
            return;
        }
        let $driver = ($config['driver'] || null)

        if (isset(this.$customProviderCreators[$driver])) {
            return call_user_func(
                this.$customProviderCreators[$driver], this.$container, $config
            );
        }

        switch ($driver) {
            case 'database':
                return this.createDatabaseProvider($config);
            case 'eloquent':
                return this.createEloquentProvider($config);
            default:
                throw new InvalidArgumentException(
                    `Authentication user provider [{$driver}] is not defined.`
                );
        }
    }

    /**
     * getProviderConfiguration method.
     * @param {*} provider
     * @returns {any}
     */
    getProviderConfiguration(provider: any) {
        provider = provider || this.getDefaultUserProvider()
        if (provider) {
            return this.$container.config.get(`auth.providers.${provider}`);
        }
    }

    /**
     * createDatabaseProvider method.
     * @param {*} $config
     * @returns {any}
     */
    createDatabaseProvider($config: Record<string, any>) {
        let $connection = this.$container['db'].connection($config['connection'] || null);

        return new DatabaseUserProvider($connection, this.$container['hash'], $config['table']);
    }

    /**
     * createEloquentProvider method.
     * @param {*} $config
     * @returns {any}
     */
    createEloquentProvider($config: Record<string, any>) {
        return new EloquentUserProvider(this.$container['hash'], $config['model']);
    }

    /**
     * getDefaultUserProvider method.
     * @returns {any}
     */
    getDefaultUserProvider() {
        return this.$container.config.get('auth.defaults.provider');
    }
}

module.exports = CreatesUserProviders