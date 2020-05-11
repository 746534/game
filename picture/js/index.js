var time;
$(function () {
    var lis = $("li")
    console.log(lis)
    // 随机数 Matn.random() 
    // Math.floor 向下取整
    var random = Math.floor(Math.random() * 4)
    console.log(random)
    
    var flag = true;

    var arr = ['n1','n2','n3','n4','n5','n6','n7','n8','n9']
    // 遍历 li类名
    for (var i = 0; i < lis.length; i++) {
        // 将map里面第random个数组里面第i个赋给li第i个类名
        lis[i].className = map[random][i]
        console.log(
            lis[i].className = map[random][i]
        )
    }

    // 鼠标点击时
    lis.mousedown(function () {
        console.log("点击到我了")

        if (flag) {
            $(".use_time").fnTimeCountDown();
            flag = false;
        }
        
        // 判断  九宫格规则的编写

        var i =$(".n9").index(); // 8  3
        console.log("空白格的位置",i)
        var o = $(this).index();//  4
        console.log("当前点击的位置",o)
        
        if (
            o == i - 1 && i!=3 && i!=6 || // 向右移动
            o == i + 1 && i!=5 && i!=2 || // 向左移动
            o == i - 3  || // 向下移动
            o == i + 3  // 向上移动
        ) {
            // 类名互换
            $(".n9")[0].className = this.className
            this.className = 'n9'
            end()
        }
    })

    // 完成之后要呈现的效果
    function end(){
        var num = [];
        
        for (var index = 0; index < arr.length; index++) {
            num.push(lis[index].className)
        }
        console.log("正常完整的数组",arr.toString())
        console.log("每点击一次就改变的数组",num.toString())
        
        // 当我们 两个数组的值 相同的时候就完成了
        if (
            arr.toString() == num.toString()
        ) {
            console.log("完成了")
            $('li').css("border","none");
            $('ul').css({
                "transform" : "scale(1.2)"
            })
            $(lis).unbind("mousedown")
            $('.n9')[0].className = 'active'
            clearTimeout(time)


        }
        
    }
    // console.log("我是n9",$('.n9')[0].className = 'active')
})