/**
 * Class Recaller.
 */
class Recaller {

    $recaller;

    /**
     * Create a new instance.
     * @param {*} $recaller
     */
    constructor($recaller: any) {
        this.$recaller = $recaller;
    }

    /**
     * id method.
     * @returns {any}
     */
    id() {
        return this.$recaller.split('|')[0];
    }

    /**
     * token method.
     * @returns {any}
     */
    token() {
        return this.$recaller.split('|')[1];
    }

    /**
     * hash method.
     * @returns {any}
     */
    hash() {
        return this.$recaller.split('|')[2];
    }

    /**
     * valid method.
     * @returns {any}
     */
    valid() {
        return this.properString() && this.hasAllSegments();
    }

    /**
     * properString method.
     * @returns {any}
     */
    properString() {
        return is_string(this.$recaller) && String.contains(this.$recaller, '|');
    }

    /**
     * hasAllSegments method.
     * @returns {any}
     */
    hasAllSegments() {
        let $segments = this.$recaller.split('|');

        return count($segments) === 3 && trim($segments[0]) !== '' && trim($segments[1]) !== '';
    }
}

module.exports = Recaller