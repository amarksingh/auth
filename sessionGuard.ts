const GuardHelpers = require('./guardHelpers')
const uid = require('uid-safe').sync
const Recaller = require('./recaller')
const { implement } = require('@ostro/support/function')
const Session = require('@ostro/contracts/session/session')
const Hash = require('@ostro/support/facades/hash')
/**
 * Class SessionGuard.
 */
class SessionGuard extends GuardHelpers {

    $viaRemember = false;

    $lastAttempted = null;

    $loggedOut = false;

    $recallAttempted = false;

    $user = null;

    /**
     * Create a new instance.
     * @param {*} $name
     * @param {*} $provider
     * @param {*} $request
     */
    constructor($name: string, $provider: any, $request: any = null) {
        super()
        this.$request = $request
        this.$guardName = $name;
        this.$session = $request.session;
        this.$provider = $provider;
        this.$cookie = $request.cookie;
    }

    /**
     * user method.
     * @async
     * @returns {any}
     */
    async user() {
        if (this.$loggedOut) {
            return;
        }

        if (!is_null(this.$user)) {
            return this.$user;
        }
        if (!this.$session) {
            return;
        }

        let $id = this.$session.get(this.getName());
        this.$user = await this.$provider.retrieveById($id)
        let $recaller = this.recaller()

        if (is_null(this.$user) && !is_null($recaller)) {
            this.$user = await this.userFromRecaller($recaller);
            if (this.$user) {
                this.updateSession(this.$user.getAuthIdentifier());

            }
        }

        return this.$user;
    }

    /**
     * userFromRecaller method.
     * @async
     * @param {*} $recaller
     * @returns {any}
     */
    async userFromRecaller($recaller: any) {
        if (!$recaller.valid() || this.recallAttempted) {
            return;
        }

        this.recallAttempted = true;
        let $user = await this.$provider.retrieveByToken(
            $recaller.id(), $recaller.token()
        )
        this.$viaRemember = !is_null($user);

        return $user;
    }

    /**
     * recaller method.
     * @returns {any}
     */
    recaller() {
        if (is_null(this.$cookie)) {
            return;
        }
        let $recaller = this.$cookie.get(this.getRecallerName())
        if ($recaller) {
            return new Recaller($recaller);
        }
    }

    /**
     * id method.
     * @async
     * @returns {any}
     */
    async id() {
        if (this.$loggedOut) {
            return;
        }

        return await await this.user() ?
            (await await this.user()).getAuthIdentifier() :
            this.$session.get(this.getName());
    }

    /**
     * once method.
     * @async
     * @param {*} $credentials
     * @returns {any}
     */
    async once($credentials: Record<string, any> = {}) {
        if (await this.validate($credentials)) {
            this.setUser(this.$lastAttempted);

            return true;
        }

        return false;
    }

    /**
     * onceUsingId method.
     * @async
     * @param {*} $id
     * @returns {any}
     */
    async onceUsingId($id: string) {
        let $user = await this.$provider.retrieveById($id)

        if (!is_null($user)) {
            this.setUser($user);

            return $user;
        }

        return false;
    }

    /**
     * validate method.
     * @async
     * @param {*} $credentials
     * @returns {any}
     */
    async validate($credentials: Record<string, any> = {}) {
        let $user = await this.$provider.retrieveByCredentials($credentials)
        this.$lastAttempted = $user;

        return this.hasValidCredentials($user, $credentials);
    }

    /**
     * basic method.
     * @async
     * @param {*} $field
     * @param {*} $extraConditions
     * @returns {any}
     */
    async basic($field: string = 'email', $extraConditions: Record<string, any> = {}) {
        if (await this.check()) {
            return;
        }

        if (await this.attemptBasic(this.getRequest(), $field, $extraConditions)) {
            return;
        }

        return this.failedBasicResponse();
    }

    /**
     * onceBasic method.
     * @async
     * @param {*} $field
     * @param {*} $extraConditions
     * @returns {any}
     */
    async onceBasic($field: string = 'email', $extraConditions: Record<string, any> = {}) {
        let $credentials = await this.basicCredentials(this.getRequest(), $field);

        if (!await this.once(Object.assign($credentials, $extraConditions))) {
            return this.failedBasicResponse();
        }
    }

    /**
     * attemptBasic method.
     * @param {*} $request
     * @param {*} $field
     * @param {*} $extraConditions
     * @returns {any}
     */
    attemptBasic($request: any, $field: string, $extraConditions: Record<string, any> = {}) {
        if (!$request.getUser()) {
            return false;
        }

        return this.attempt(Object.assign(
            this.basicCredentials($request, $field), $extraConditions
        ));
    }

    /**
     * basicCredentials method.
     * @param {*} $request
     * @param {*} $field
     * @returns {any}
     */
    basicCredentials($request: any, $field: string) {
        return {
            $field: $request.getUser(),
            'password': $request.getPassword()
        };
    }

    /**
     * failedBasicResponse method.
     * @returns {any}
     */
    failedBasicResponse() {
        throw new UnauthorizedHttpException('Basic', 'Invalid credentials.');
    }

    /**
     * attempt method.
     * @async
     * @param {*} $credentials
     * @param {*} $remember
     * @returns {any}
     */
    async attempt($credentials: Record<string, any> = {}, $remember: boolean = false) {

        let $user = await this.$provider.retrieveByCredentials($credentials);
        this.$lastAttempted = $user

        if (await this.hasValidCredentials($user, $credentials)) {
            await this.login($user, $remember);

            return true;
        }

        return false;
    }

    /**
     * attemptWhen method.
     * @async
     * @param {*} $credentials
     * @param {*} $callbacks
     * @param {*} $remember
     * @returns {any}
     */
    async attemptWhen($credentials: Record<string, any> = {}, $callbacks: any = null, $remember: boolean = false) {
        let $user = await this.$provider.retrieveByCredentials($credentials)
        this.$lastAttempted = $user;

        if (await this.hasValidCredentials($user, $credentials) && await this.shouldLogin($callbacks, $user)) {
            await this.login($user, $remember);

            return true;
        }

        return false;
    }

    /**
     * hasValidCredentials method.
     * @async
     * @param {*} $user
     * @param {*} $credentials
     * @returns {any}
     */
    async hasValidCredentials($user: Record<string, any>, $credentials: Record<string, any>) {
        let $validated = !is_null($user) && await this.$provider.validateCredentials($user, $credentials);

        return $validated;
    }

    /**
     * shouldLogin method.
     * @param {*} $callbacks
     * @param {*} $user
     * @returns {any}
     */
    shouldLogin($callbacks: any, $user: Record<string, any>) {

        return true;
    }

    /**
     * loginUsingId method.
     * @async
     * @param {*} $id
     * @param {*} $remember
     * @returns {any}
     */
    async loginUsingId($id: string, $remember: boolean = false) {
        let $user = await this.$provider.retrieveById($id)
        if (!is_null($user)) {
            this.login($user, $remember);

            return $user;
        }

        return false;
    }

    /**
     * login method.
     * @async
     * @param {*} $user
     * @param {*} $remember
     * @returns {any}
     */
    async login($user: Record<string, any>, $remember: boolean = false) {
        this.updateSession($user.getAuthIdentifier());
        if ($remember) {
            await this.ensureRememberTokenIsSet($user);

            this.queueRecallerCookie($user);
        }

        this.setUser($user);
    }

    /**
     * updateSession method.
     * @param {*} $id
     * @returns {any}
     */
    updateSession($id: string) {
        if (this.$session instanceof Session) {
            this.$session.put(this.getName(), $id);
        }

    }

    /**
     * ensureRememberTokenIsSet method.
     * @async
     * @param {*} $user
     * @returns {any}
     */
    async ensureRememberTokenIsSet($user: Record<string, any>) {
        if (empty($user.getRememberToken())) {
            await this.cycleRememberToken($user);
        }
    }

    /**
     * queueRecallerCookie method.
     * @param {*} $user
     * @returns {any}
     */
    queueRecallerCookie($user: Record<string, any>) {
        this.createRecaller(
            $user.getAuthIdentifier() + '|' + $user.getRememberToken() + '|' + $user.getAuthPassword()
        );
    }

    /**
     * createRecaller method.
     * @param {*} $value
     * @returns {any}
     */
    createRecaller($value: any) {
        return this.getCookieJar().forever(this.getRecallerName(), $value);
    }

    /**
     * logout method.
     * @async
     * @returns {any}
     */
    async logout() {
        let $user = await this.user();

        this.clearUserDataFromStorage();

        if (!is_null(this.$user) && !empty($user.getRememberToken())) {
            await this.cycleRememberToken($user);
        }

        this.$user = null;

        this.$loggedOut = true;
        return true
    }

    /**
     * logoutCurrentDevice method.
     * @async
     * @returns {any}
     */
    async logoutCurrentDevice() {
        let $user = await this.user();

        this.clearUserDataFromStorage();

        this.$user = null;

        this.$loggedOut = true;
    }

    /**
     * clearUserDataFromStorage method.
     * @returns {any}
     */
    clearUserDataFromStorage() {
        this.$session.remove(this.getName());

    }

    /**
     * cycleRememberToken method.
     * @param {*} $user
     * @returns {any}
     */
    cycleRememberToken($user: Record<string, any>) {
        let $token = uid(50)
        $user.setRememberToken($token);

        return this.$provider.updateRememberToken($user, $token);
    }

    /**
     * logoutOtherDevices method.
     * @async
     * @param {*} $password
     * @param {*} $attribute
     * @returns {any}
     */
    async logoutOtherDevices($password: string, $attribute: string = 'password') {
        if (!await this.user()) {
            return;
        }

        let $result = await this.rehashUserPassword($password, $attribute);

        if (this.recaller()) {
            this.queueRecallerCookie(await this.user());
        }

        return $result;
    }

    /**
     * rehashUserPassword method.
     * @async
     * @param {*} $password
     * @param {*} $attribute
     * @returns {any}
     */
    async rehashUserPassword($password: string, $attribute: string) {
        let $user = await this.user();
        if (!Hash.check($password, $user[$attribute])) {
            throw new InvalidArgumentException('The given password does not match the current password.');
        }

        return tap(await $user.forceFill({
            [$attribute]: Hash.make($password),
        }), ($u) => $u.save());
    }

    /**
     * getLastAttempted method.
     * @returns {any}
     */
    getLastAttempted() {
        return this.$lastAttempted;
    }

    /**
     * getName method.
     * @returns {any}
     */
    getName() {
        return 'login_' + this.$guardName.toLowerCase()
    }

    /**
     * getRecallerName method.
     * @returns {any}
     */
    getRecallerName() {
        return 'remember_' + this.$guardName.toLowerCase()
    }

    /**
     * viaRemember method.
     * @returns {any}
     */
    viaRemember() {
        return this.$viaRemember;
    }

    /**
     * getCookieJar method.
     * @returns {any}
     */
    getCookieJar() {
        if (!isset(this.$cookie)) {
            throw new Error('Cookie jar has not been set.');
        }

        return this.$cookie;
    }

    /**
     * setCookieJar method.
     * @param {*} $cookie
     * @returns {any}
     */
    setCookieJar($cookie: any) {
        this.$cookie = $cookie;
    }

    /**
     * getSession method.
     * @returns {any}
     */
    getSession() {
        return this.$session;
    }

    /**
     * getUser method.
     * @returns {any}
     */
    getUser() {
        return this.$user;
    }

    /**
     * setUser method.
     * @param {*} $user
     * @returns {any}
     */
    setUser($user: Record<string, any>) {
        this.$user = $user;

        this.$loggedOut = false;

        return this;
    }

    /**
     * getRequest method.
     * @returns {any}
     */
    getRequest() {
        return this.$request;
    }

    /**
     * setRequest method.
     * @param {*} $request
     * @returns {any}
     */
    setRequest($request: any) {
        this.$request = $request;

        return this;
    }
}

module.exports = SessionGuard