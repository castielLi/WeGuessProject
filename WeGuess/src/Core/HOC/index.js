/**
 * Created by maple on 2017/10/11.
 * HOC工厂
 */
import HocLoading from './Loading';
import HocAndroidBack from './AndroidBack';
import HocAlert from './Alert';
import HocError from './Error';

let HocObj = {
    HocLoading: HocLoading,
    HocAndroidBack: HocAndroidBack,
    HocAlert: HocAlert,
    HocError:HocError
}

export default HOCFactory = (component, hoc) => {
    if (typeof hoc === "function") {
        return hoc(component);
    }

    if (typeof hoc === "string") {
        return HocObj[hoc](component);
    }


    if (Object.prototype.toString.call(hoc) === '[object Array]') {
        let length = hoc.length;
        let newComponent = component;
        for (let i = 0; i < length; i++) {
            newComponent = HocObj[hoc[i]](newComponent);
        }
        return newComponent;
    }

    return component;
}

