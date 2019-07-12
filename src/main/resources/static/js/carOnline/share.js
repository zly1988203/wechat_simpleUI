$(function() {
    function parseTimeToHMS(costTime){
        //总秒数
        var totalsecond=parseInt(costTime/1000);
        //秒数
        var second=totalsecond%60;
        //总分钟
        var totalminite=parseInt(totalsecond/60);
        //分钟
        var minite=totalminite%60;
        //总小时
        var hour=parseInt(totalminite/60);
        if(hour<1){
            return (minite+"分钟"+second+"秒");
        }
        return (hour+"小时"+minite+"分钟"+second+"秒");
    }



    //map
    AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
        initMap(SimpleMarker)
    })

    var departLng = $("#departLng").val();
    var departLat = $("#departLat").val();
    var tripStatus = $("#tripStatus").val();
    var arriveLng = $("#arriveLng").val();
    var arriveLat = $("#arriveLat").val();
    if(tripStatus == 7 || tripStatus == 8){
        $("#costTime").html("已完成");
    }else{
        var tinestr=parseTimeToHMS(costTime);
        var timestamp=new Date().getTime();
        var ptab=$("#costTime");
        var auto = setInterval(function () {
            var curtimestamp=new Date().getTime();
            var thiscosttime=costTime+(curtimestamp-timestamp)
            var timestr=parseTimeToHMS(thiscosttime);
            ptab.html("已行驶："+timestr)
        }, 1000);
    }


    function initMap(SimpleMarker) {
        var map = new AMap.Map('allmap', {
            resizeEnable: true,
            zoom: 16,
            center: [departLng, departLat]
        });

        /**
         *@param policy         驾车路线规划策略
         *@param map            AMap.Map对象, 展现结果的地图实例
         *@param hideMarkers    是否隐藏线路规划点图标
         */
        var driving = new AMap.Driving({
            policy: AMap.DrivingPolicy.LEAST_TIME,
            map: map,
            hideMarkers: true
        });

        /**
         *@param    origin          起点
         *@param    destination     目的地
         *@param    waypoints       途径点：也许有，也许没有，可以选填{waypoints: waypoints}
         */
        var origin = new AMap.LngLat(departLng, departLat),
            destination = new AMap.LngLat(arriveLng, arriveLat),
            waypoints = [new AMap.LngLat(113.870732, 22.568868), new AMap.LngLat(113.880646, 22.560853), new AMap.LngLat(113.887276, 22.554591), new AMap.LngLat(113.894679, 22.547418), new AMap.LngLat(113.897962, 22.537132), new AMap.LngLat(113.92354, 22.523952), new AMap.LngLat(113.942465, 22.518382)]

        driving.search(origin, destination, function (status, result) {
            if(status == 'complete') {
                //规划成功 - 标注点
                // markerPoints(waypoints)
                markerPoints(origin, 'start')
                markerPoints(destination, 'end')

                //设置起点为中心点
                map.setCenter(origin)
            } else if(status == 'no_data') {
                //返回0结果
            } else if(status == 'error') {
                //规划错误
                console.log(status)
                console.log(result)
            }
        });

        /**
         *@param    position    坐标
         *@param    icon        图标
         *@param    offset      图标偏移量
         */
        function markerPoints(points, mark) {
            if(points instanceof Array) {
                //途径点
                for (var i = 0; i < points.length; i++) {
                    new AMap.Marker({
                        map: map,
                        position: points[i],
                        icon: new AMap.Icon({
                            image: "/res/images/bus/map-4.png",
                            size: new AMap.Size(26, 26),  //图标大小
                            imageSize: new AMap.Size(13, 13),
                            imageOffset: new AMap.Pixel(0, 0)
                        }),
                        offset: new AMap.Pixel(0, 0)
                    })
                }
            } else if(typeof points == 'object' && typeof mark == 'string') {
                //起点和目的地
                new AMap.Marker({
                    map: map,
                    position: points,
                    icon: new AMap.Icon({
                        image: "/res/images/bus/map-" + mark + ".png",
                        size: new AMap.Size(50, 72),  //图标大小
                        imageSize: new AMap.Size(25, 36),
                        imageOffset: new AMap.Pixel(0, 0)
                    })
                })
            }
        }
    }

    //拨打电话
    $('.tel').on('click.tel', function() {
        var tel = $(this).data('tel')

        $.alert('您的电话号码已做加密处理，<br />联系司机师傅，请您通过页面按键拨打。', '温馨提示', ['知道了'], function() {
            window.location.href = 'tel:' + tel
        })
    });
});