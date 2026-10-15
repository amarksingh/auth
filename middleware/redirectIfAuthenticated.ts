/**
 * Class RedirectIfAuthenticated.
 */
class RedirectIfAuthenticated {
    /**
     * Create a new instance.
     * @param {*} $guards
     */
    constructor(...$guards: any[]) {
        this.$guards = $guards;
    }

    /**
     * handle method.
     * @async
     * @param {*} { request
     * @param {*} next
     * @param {*} auth
     * @param {*} redirect }
     * @returns {any}
     */
    async handle({ request, next, auth, redirect }: Record<string, any>) {
        let $guards = empty(this.$guards) ? [null] : this.$guards;

        for (let $guard of $guards) {
            if (await auth.guard($guard).check()) {
                return redirect.to(this.redirectTo(request));
            }
        }

        return next();
    }

    /**
     * redirectTo method.
     * @param {*} $request
     * @returns {any}
     */
    redirectTo($request: any) {
        return '/';
    }
}

module.exports = RedirectIfAuthenticated