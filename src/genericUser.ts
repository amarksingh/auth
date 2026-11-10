import type { IGenericUser } from '@ostro/contracts/auth/genericUser';

/**
 * Class GenericUser.
 */
class GenericUser implements IGenericUser {
    [key: string]: any;

    public $attributes: Record<string, any>;

    /**
     * Create a new generic user instance.
     *
     * @param $attributes - User attributes dictionary
     */
    constructor($attributes: Record<string, any> = {}) {
        this.$attributes = $attributes;
        return new Proxy(this, {
            get(target: any, prop: string | symbol) {
                if (prop in target) {
                    return target[prop];
                }
                if (typeof prop === 'string' && target.$attributes && prop in target.$attributes) {
                    return target.$attributes[prop];
                }
                return undefined;
            },
            set(target: any, prop: string | symbol, value: any) {
                if (prop in target) {
                    target[prop] = value;
                } else if (typeof prop === 'string') {
                    target.$attributes[prop] = value;
                }
                return true;
            }
        });
    }

    /**
     * Get the name of the unique identifier for the user.
     *
     * @returns The auth identifier key name
     */
    public getAuthIdentifierName(): string {
        return 'id';
    }

    /**
     * Get the unique identifier for the user.
     *
     * @returns The unique identifier value
     */
    public getAuthIdentifier(): any {
        return this.$attributes[this.getAuthIdentifierName()];
    }

    /**
     * Get the password for the user.
     *
     * @returns The hashed password
     */
    public getAuthPassword(): any {
        return this.$attributes['password'];
    }

    /**
     * Get the token value for the "remember me" session.
     *
     * @returns The remember token
     */
    public getRememberToken(): any {
        return this.$attributes[this.getRememberTokenName()];
    }

    /**
     * Set the token value for the "remember me" session.
     *
     * @param $value - The remember token value
     */
    public setRememberToken($value: any): void {
        this.$attributes[this.getRememberTokenName()] = $value;
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @returns The remember token column name
     */
    public getRememberTokenName(): string {
        return 'remember_token';
    }

    /**
     * Set the token value for the API session.
     *
     * @param $value - The API token value
     */
    public setApiToken($value: any): void {
        this.$attributes[this.getApiTokenName()] = $value;
    }

    /**
     * Get the column name for the API token.
     *
     * @returns The API token column name
     */
    public getApiTokenName(): string {
        return 'api_token';
    }

    /**
     * Convert the user instance to JSON.
     *
     * @returns Attributes object
     */
    public toJSON(): Record<string, any> {
        return this.$attributes;
    }

    /**
     * Magic getter for attributes.
     *
     * @param $key - Attribute name
     * @returns Attribute value
     */
    public __get($key: string): any {
        return this.$attributes[$key];
    }

    /**
     * Magic setter for attributes.
     *
     * @param $key - Attribute name
     * @param $value - Attribute value
     */
    public __set($key: string, $value: any): void {
        this.$attributes[$key] = $value;
    }
}

export default GenericUser;