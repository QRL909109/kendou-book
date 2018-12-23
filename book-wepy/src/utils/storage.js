import wepy from 'wepy'
/**
 * 本地存储获取方法，若过期则返回空
 * @type {[type]}
 */
export const getStorageSync = key => {
    let data;

    try {
        data = wepy.getStorageSync(key);
    } catch (e) {
        console.error('get storage sync failed! ' + JSON.stringify(e));
        return;
    }

    if (data && 'object' === typeof data && data._expires) {
        let nowDate = new Date().getTime();

        // 已过期
        if ((+data._expires) < nowDate) {
            try {
                wepy.removeStorageSync(key)
            } catch (e) {
                // Do something when catch error
                console.error('remove storage sync failed! ' + JSON.stringify(e));
            }

            console.info('缓存已过期！', key);
            return;
        }

        return data.value;
    }

    return data;
};

/**
 * 本地存储方法，可设置过期时间
 *
 *	 setStorageSync('test', 1, 10);

     setTimeout(() => {
         console.log('5000:', getStorageSync('test'));
     }, 5000);

     setTimeout(() => {
         console.log('10000:', getStorageSync('test'));
     }, 10000);

     setTimeout(() => {
         console.log('12000:', getStorageSync('test'));
     }, 12000);
 *
 *
 *
 *
 * @param  {String} key    存储的数据的key
 * @param  {Object/String} value 存储的内容
 * @param  {[type]} expires 过期时间（单位：秒(s)）
 * @return {[type]}        [description]
 */
export const setStorageSync = (key, value, expires) => {
    let nowDate = new Date(),
        data;

    if (expires) {
        expires = nowDate.getTime() + (+expires) * 1000;

        data = {
            _expires: expires,
            value
        };
    } else {
        data = value;
    }

    try {
        wepy.setStorageSync(key, data);
    } catch (e) {
        console.error('set storage sync failed! ' + JSON.stringify(e));
    }
};

export default {
    getStorageSync,
    setStorageSync
}