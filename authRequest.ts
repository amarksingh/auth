const { Macroable } = require('@ostro/support/macro')

/**
 * Class Auth.
 */
class Auth extends Macroable {

    /**
     * Create a new instance.
     * @param {*} request
     * @param {*} manager
     */
    constructor(request: any, manager: any) {
        super()
        Object.defineProperties(this, {
            $request: {
                value: request
            },
            $manager: {
                value: manager,
            },
            $defaultGuard: {
                value: manager.getDefaultDriver(),
                writable: true
            },
            $guards: {
                value: {},
                writable: true
            }
        })
    }

    /**
     * guard method.
     * @param {*} $name
     * @returns {any}
     */
    guard($name: string) {
        if (!$name) {
            $name = this.$defaultGuard
        }
        return this.$guards[$name] = this.$guards[$name] || this.$manager.guard($name)(this.$request)
    }

    /**
     * shouldUse method.
     * @param {*} $name
     * @returns {any}
     */
    shouldUse($name: string) {
        $name = $name || this.$defaultGuard;

        this.setDefaultDriverForCurrentRequest($name);

        return this.guard($name).user();
    }

    /**
     * setDefaultDriverForCurrentRequest method.
     * @param {*} $name
     * @returns {any}
     */
    setDefaultDriverForCurrentRequest($name: string) {
        this.$defaultGuard = $name;
    }

    /**
     * __get method.
     * @param {*} target
     * @param {*} method
     * @returns {any}
     */
    __get(target: Record<string, any>, method: string) {
        return this.make(target.guard(this.$defaultGuard), method)
    }

}
module.exports = Auth