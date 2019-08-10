export default {
    getLastYear2(oneYear) {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let strDate = today.getDate();
        if (month >= 0 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return year - oneYear + "-" + month + "-" + strDate; //2019-04-01
    },
    getNowFormatDate(data) { //获取默认时间
        var d = new Date(data),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        let currentdate = [
            [year - 1, month, day].join('-'), [year, month, day].join('-')
        ]
        return currentdate; //[2018-04-01,2019-04-01]
    },
    getNowYear() {
        var d = new Date(),
            month = (d.getMonth() + 1) < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth()),
            year = d.getFullYear();
        return [year, month].join('-') //2018-04
    },
    getLastYear() {
        var d = new Date(),
            month = (d.getMonth() + 1) < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth()),
            year = d.getFullYear();
        return [year - 1, month].join('-') //2019-04
    },
    getNowFormatDate2() {
        var d = new Date();
        var year = d.getFullYear();
        var month = change(d.getMonth() + 1);
        var day = change(d.getDate());
        var hour = change(d.getHours());
        var minute = change(d.getMinutes());
        var second = change(d.getSeconds());

        function change(t) {
            if (t < 10) {
                return "0" + t;
            } else {
                return t;
            }
        }

        var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return time; //2019-04-01 10：20：30
    },
    getUnitType() {
        return '2c93809155961b350155961fc24e0004'
    },
    uploadSucceed(vm, bus) {
        vm.$vux.toast.show({
                text: '上传成功'
            })
            // setTimeout(function () {
            //
            // },1500)
        bus.$emit('msgFromBrother')
            // vm.$router.go(1)
    },
    funDownload(content, filename) {
        // 创建隐藏的可下载链接
        var eleLink = document.createElement('a');

        if ('download' in document.createElement('a')) {
            downloadFile(res.data, filename)
        } else {
            Message.error('浏览器不支持')
        }
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);

    }
}