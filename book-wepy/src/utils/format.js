
/**
 * 数字格式化成万或千
 * @param  {[type]} digit [description]
 * @param  {[type]} block [description]
 * @return {[type]}       [description]
 */
export function digitFormat(digit, block) {

    if ((digit === undefined) || (digit === '')) return 0;

    var format = parseInt(block) || 10000;

    digit = parseInt(digit);

    if (digit >= 1000 && digit < 10000 && format <= 1000) {

        digit = digit / 1000;

        digit = digit.toFixed(1) + '千';


    } else if (digit > 10000 && digit >= format) {

        digit = digit / 10000;

        digit = digit.toFixed(1) + '万';

    }

    return digit;
}

/**
 * 格格式输出日期串
 * @param date      {Number/Date}   要格式化的日期
 * @param formatStr {String}        格式串(yMdHmsqS)
 * @returns {*|string}
 */
export function formatDate(date, formatStr) {
    if (!date) {
        return '';
    }

    var format = formatStr || 'yyyy-MM-dd';

    if ('number' === typeof date || 'string' === typeof date) {
        date = new Date(+date);
    }

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;

}


/**
 * 格式化钱
 * @param amount {Number/String}   要格式化的数字
 * @param base   {Number}          格式化基数,默认为100
 * @returns {number}
 */
export function formatMoney(amount, base = 100) {
    if (base === 1) {
        return amount;
    }

    // 解决类似amount=1990时的精数不准问题
    if (parseInt(amount) === Number(amount)) {
        return Number(amount || 0) / base;
    }

    let money=(Math.floor(Number(amount || 0) / base * base) / base).toFixed(2);
    return money;
}
/**
 * 将参数字典解析成url参数
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function stringifyUrlParams(params) {
    let re = '';
    for (let key in params) {
        re += `${key}=${params[key]}&`;
    }

    return re;
}

/* 将秒数转换为时间字符串 */
export function formatSecondToTimeStr(second) {
    if (!second || second <= 0) { return '00:00' }
    second = Math.ceil(second)
    let min = (Math.floor(second / 60)).toString()
    while (min.length < 2) {
        min = '0' + min
    }
    let sec = (second % 60).toString()
    while (sec.length < 2) {
        sec = '0' + sec
    }
    return min + ':' + sec
}
/**
 * 获取媒体时间格式化字符串
 * @param  {[type]} secs [description]
 * @return {[type]}      [description]
 */
export function getAudioTimeShow(secs) {
    //时
    let hours = Math.round(secs / 3660);
    if (hours < 10) {
        hours = "0" + hours;
    }
    //分钟
    let minutes = parseInt(secs / 60 % 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    //秒
    let seconds = Math.round(secs % 60);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return `${hours}:${minutes}:${seconds}`;
}

export default {
    digitFormat,
    formatDate,
    formatMoney,
    stringifyUrlParams,
    formatSecondToTimeStr,
    getAudioTimeShow,
}