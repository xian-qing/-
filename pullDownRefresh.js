/**
 * Created by stone on 2017/3/14.
 */
(function () {
    pullDownRefresh=function(refreshConfig){
        var rfConfig = {
            idEle:refreshConfig.idEle,       //元素
            refreshHeight:refreshConfig.refreshHeight || 200,             //手指滑动高度
            startY:0,              //开始
            EleHeight: refreshConfig.EleHeight || 100,      //刷新高度
            maxHeight: refreshConfig.maxHeight || 200,       //最大滑动高度
            isEndOk:false,      //判断移动完成
            isMoveOk:false,     //移动是否执行
            showTime:refreshConfig.showTime || 1000 ,     //刷新显示时间
            clearInterval:0,   //定时器变量
            callback:refreshConfig.callback || function () {
                console.log('刷新成功')
            }
        }
        function load (){
            document.addEventListener('touchstart',touch, false);
            document.addEventListener('touchmove',touch, false);
            document.addEventListener('touchend',touch, false);

            function touch (event){
                var event = event || window.event;

                switch(event.type){
                    case "touchstart":
                        start(event)
                        break;
                    case "touchend":
                        end(event)
                        break;
                    case "touchmove":
                        move(event)
                        break;
                }

            }
        }
        window.addEventListener('load',load, false)
        //手指开始事件
        window.start = function (event) {
            var Y = event.touches[0].clientY
            if(rfConfig.refreshHeight >= Y){
                rfConfig.startY = Y
                rfConfig.isMoveOk = true
            }else {
                rfConfig.isMoveOk = false
            }

        }
        //手指移动事件
        window.move = function (event) {
            if(rfConfig.isMoveOk){
                var rfh =document.getElementById(rfConfig.idEle) ;
                event.preventDefault();
                var moveY = event.touches[0].clientY - rfConfig.startY
                moveY = moveY > rfConfig.maxHeight?rfConfig.maxHeight:moveY
                rfh.style.height = moveY + 'px'
                if(moveY > rfConfig.EleHeight){
                    rfConfig.isEndOk = true
                }else {
                    rfConfig.isEndOk = false
                }

            }


        }
        //手指结束事件
        window.end = function (event) {
            var rfh =document.getElementById(rfConfig.idEle) ;
            if(rfConfig.isEndOk){
                refreshHeightAnimate(rfConfig.EleHeight)
                setTimeout(function () {
                    rfConfig.isEndOk = false
                    rfConfig.callback()
                    refreshHeightAnimate(0)
                },rfConfig.showTime)
            }else {
                refreshHeightAnimate(0)
            }

        }

        window.refreshHeightAnimate = function (hei) {
            var el = document.getElementById(rfConfig.idEle)
            var height = el.offsetHeight
            clearInterval(rfConfig.clearInterval)
            if(height == 0){
                return
            }
            rfConfig.clearInterval = setInterval(function () {
                height = height -2
                el.style.height = height + 'px'
                if(height == hei){
                    clearInterval(rfConfig.clearInterval)
                }
            },1)
        }
    };
})()