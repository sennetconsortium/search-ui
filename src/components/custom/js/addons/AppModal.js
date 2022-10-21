import Addon from './Addon'
import $ from 'jquery'

class AppModal extends Addon {
    constructor(el, app) {
        super(el, app)
        this.events()
    }

    events() {
        
        $(window).on('keydown', ((e) => {
            Addon.log(e.code)
            if (this.isEsc(e)) {
                $('.modal-footer .btn').click()
            }
        }).bind(this));
    }
}

export default AppModal