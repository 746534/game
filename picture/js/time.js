$.extend($.fn,{
    fnTimeCountDown : function(){
        var now_time = new Date();
        var $this = $(this)

        // 获取 use_time 的后代元素
        var o = {
            sec:$this.find(".sec"),
            mini:$this.find(".mini"),
            hour:$this.find(".hour"),
            day:$this.find(".day"),
            month:$this.find(".month"),
            year:$this.find(".year")
        }

        var k = {

            miao:function(n){
                // 将 n 转化为 整数
                var _n = parseInt(n)
                // 当传进来的 _n 值 大于0 
                if ( _n > 0 ) {
                    // 当他小于10 
                    if ( _n < 10) {
                        _n = "0" + _n
                        // 01 = "0" + 1
                        // 02 = "0" + 2
                    }
                    // 将 _n 返回函数
                    return _n
                }else{
                    return "00"
                }
            },

            dv:function(){
                var futrue_time = new Date();

                // 计算我们变动的时间 - 固定的时间 / 1000 = 秒数
                var dur = (futrue_time.getTime() - now_time.getTime()) / 1000

                var pms = {
                    sec: "00",
                    mini: "00",
                    hour: "00",
                    day: "00",
                    month: "00",
                    year: "00"
                }

                // var a = 1
                // if (a == 1) {
                //     console.log("1")
                // }else{
                //     console.log("2")
                // }

                // a==1?console.log("1"):console.log("2")

                if (dur > 0) {
                    pms.sec = k.miao( dur % 60 );
                    pms.mini = Math.floor( dur / 60 ) > 0 ? k.miao(Math.floor( dur / 60 ) % 60): "00";
                    pms.hour = Math.floor( dur / 3600 ) > 0 ? k.miao(Math.floor( dur / 3600) % 24): "00";

                    pms.day = Math.floor( dur / 86400 ) > 0 ? k.miao( Math.floor( dur / 86400 ) % 30): "00";
                    // 月份 是按照每一个月平均的实际秒数 2629744

                    pms.month = Math.floor( dur / 2629744) > 0 ? k.miao( Math.floor( dur / 2629744) % 12) : "00";
                    // 年份 按照回归年 365天5小时48分钟46秒 来计算的 31556926
                    pms.year = Math.floor( dur / 31556926) > 0? k.miao(Math.floor( dur / 31556926)):"0";
                }
                return pms
            },

            ui:function(){
                // 秒
                if (o.sec) {
                    o.sec.html(k.dv().sec)
                }
                // 分钟
                if (o.mini) {
                    o.mini.html(k.dv().mini)
                }

                // 小时
                if (o.hour) {
                    o.hour.html(k.dv().hour)
                }

                // 天
                if (o.day) {
                    o.day.html(k.dv().day)
                }

                // 月份
                if (o.month) {
                    o.month.html(k.dv().month)
                }
                // 年份
                if (o.year) {
                    o.year.html(k.dv().year)
                }

                time = setTimeout(k.ui,1000)
            }
        }
        k.ui();
    }
})

// var a = {
//     name: "小明",
//     age: "20"
// }
// var b = {
//     name: "小红",
//     O: "hhh",
//     p: "qqq"
// }
// console.log("哈哈哈哈",
//     $.extend(a,b)
// )
console.log($.fn)