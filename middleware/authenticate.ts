const AuthenticationException = require('../authenticationException')
/**
 * Class Authenticate.
 */
class Authenticate {        
    /**
     * Create a new instance.
     * @param {*} guards
     */
    constructor(...guards){
        this.$guards = guards;
    }
    /**
     * handle method.
     * @async
     * @param {*} { request
     * @param {*} next }
     * @returns {any}
     */
    async handle({ request, next }) {
        await this.authenticate(request,this.$guards);
        return next();
    }

    /**
     * authenticate method.
     * @async
     * @param {*} $request
     * @param {*} $guards
     * @returns {any}
     */
    async authenticate($request, $guards) {
        if (empty($guards)) {
            $guards = [null];
        }

        for (let $guard of $guards) {
            if (await $request.auth.guard($guard).check()) {
                return await $request.auth.shouldUse($guard)
            }
        }

        this.unauthenticated($request, $guards);
    }

    /**
     * unauthenticated method.
     * @param {*} $request
     * @param {*} $guards
     * @returns {any}
     */
    unauthenticated($request, $guards) {
        throw new AuthenticationException(
            'Unauthenticated.', $guards, this.redirectTo($request)
        );
    }

    /**
     * redirectTo method.
     * @param {*} $request
     * @returns {any}
     */
    redirectTo($request) {
        //
    }
}

module.exports = Authenticate