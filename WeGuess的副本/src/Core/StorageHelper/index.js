/**
 * Created by ml23 on 2017/08/01.
 */

import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class StorageHelper {
    constructor() {
        if (__instance()) return __instance();
        __instance(this);

    }

    init(size=1000,defaultExpires=null) {
        this.storage = new Storage({
            // 最大容量，默认值1000条数据循环存储
            size: size,

            // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
            // 如果不指定则数据只会保存在内存中，重启后即丢失
            storageBackend: AsyncStorage,

            // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
            defaultExpires: defaultExpires,

            // 读写时在内存中缓存数据。默认启用。
            enableCache: true,

            // 如果storage中没有相应数据，或数据已过期，
            // 则会调用相应的sync方法，无缝返回最新数据。
            // sync方法的具体说明会在后文提到
            // 你可以在构造函数这里就写好sync的方法
            // 或是写到另一个文件里，这里require引入
            // 或是在任何时候，直接对storage.sync进行赋值修改
            // sync: require('./sync')  // 这个sync文件是要你自己写的
        })
    }

    load(key, defaultData) {
        return new Promise((resolve, reject) => {
            // 读取
            this.storage.load({
                key: key,
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: true,

                // syncInBackground(默认为true)意味着如果数据过期，
                // 在调用sync方法的同时先返回已经过期的数据。
                // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
                syncInBackground: true,

                // 你还可以给sync方法传递额外的参数
                syncParams: {
                    extraFetchOptions: {
                        // 各种参数
                    },
                    someFlag: true,
                },
            }).then(ret => {
                resolve(ret);
            }).catch(err => {
                switch (err.name) {
                    case 'NotFoundError':
                        reject(defaultData, 0)
                        break;
                    case 'ExpiredError':
                        reject(defaultData, 1)
                        break;
                }
            })
        })
    }

    save(key, data, expires) {
        return new Promise((resolve, reject) => {
            this.storage.save({
                key: key,  // 注意:请不要在key中使用_下划线符号!
                data: data,

                // 如果不指定过期时间，则会使用defaultExpires参数
                // 如果设为null，则永不过期
                expires: expires ? expires : null
            });
        })
    }

    remove(key){
        this.storage.remove({
            key: key
        });
    }

    clear(){
        this.storage.clearMap();
    }

}