/**
 * Class StartAuth.
 */
class StartAuth {
    /**
     * Create a new instance.
     */
    constructor() {
        this.$auth = this.$app['auth'];

        if (this.$auth instanceof require('../authManager')) {

            this.$registered = true;
            this.$startAuth = this.$auth.start();
        }
    }

    /**
     * handle method.
     * @param {*} {request
     * @param {*} response
     * @param {*} next}
     * @returns {any}
     */
    handle({request, response, next} ) {
    	if(!this.$registered){
            return next()
        }

        this.$startAuth(request, response, next)
    }
}

module.exports = StartAuth