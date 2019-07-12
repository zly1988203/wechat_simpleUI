//乘客操作
/**
 *
 * @param obj 入参
 * @param callBack 点击确定按钮后的操作
 */
function passengerHandle(obj,callBack) {
    var objDefault = {
        needIdCard: 1,//是否需要实名制 1-实名制
        personList: [],//选中的乘车人列表
    };
    var reqPassengerFlag = false;
    if(!isEmpty(obj)){
        $.extend(true,objDefault,obj);
    }

    // var personList = [];//所有乘车人信息列表
    var click_tap = isAndroid()?'tap':'click';
    $('#selectPassengerButton').off(clickEvent).on(clickEvent, function () {
        $('#passengerList').show();
        $('body').css({'position':'fixed',"width":"100%"});
        queryPassengerRequest();//请求乘车人列表
    });

    // 取消显示实名制弹窗
    $("#passengerCancel").off(clickEvent).on(clickEvent,function(){
        $('#passengerList').hide();  
        $("body").css({"position":"initial","height":"auto"});
    });

    //确定选中的实名制乘车人按钮
    $('.select-person-container .confirm-btn').on(click_tap,function (e) {
        e.stopPropagation();//阻止事件冒泡
        // showSelectPassenger(personList);
        $('.select-person-container').hide();
        $("body").css({"position":"initial","height":"auto"});

        //回调
        if(typeof callBack == "function"){
            callBack(objDefault.personList);
        }
    });

    // 编辑实名制乘车人
    $('.person-item .edit-btn').on(click_tap,function () {
        $('.select-person-container').hide();

        //动态生成编辑弹窗数据
        var _parent = $(this).parent();
        var name = $(_parent).data('name');
        var idNo = $(_parent).data('showidcardno');
        var id = $(_parent).data('id');
        var selectedFlag = $(_parent).data('selected');
        showEditPersonContainer(name,idNo,id,selectedFlag);
    });

    //添加实名制乘车人
    $('.add-person').on(click_tap,function () {
        $('.select-person-container').hide();
        showEditPersonContainer();

        //强制失去焦点 - 部分手机可以获取焦点
        setTimeout(function () {
            $('#passengerName').blur();
            $('#passengerCode').blur();
        },0)
    });

    //查询乘车人信息
    function queryPassengerRequest(){
        if(!reqPassengerFlag){
            var success_event = function (res) {
                objDefault.personList = [];
                //本地缓存的乘车人信息
                var localPassengerList = JSON.parse(sessionStorage.getItem('passengerList'));
                console.log('localPassengerList:')
                console.log(localPassengerList)
                $.each(res.data,function (index,person) {
                    var tempPerson = person;
                    if(isEmpty(localPassengerList)){
                        tempPerson.selectedFlag = false;
                    }else{
                        for(var i=0;i<localPassengerList.length;i++){
                            var localPassenger = localPassengerList[i];
                            if(localPassenger.id == tempPerson.id){
                                tempPerson.selectedFlag = localPassenger.selectedFlag;
                                break;
                            }else{
                                tempPerson.selectedFlag = false;
                            }
                        }
                    }
                    objDefault.personList.push(tempPerson);
                });
                console.log('objDefault:');
                console.log(objDefault);

                createPersonContent(objDefault.personList);
            };

            var token=$.cookie('token');
            $.showLoading();
            $.post("/bus/passengerContactInfo/passengerList",{token:$.cookie("token")},function(result){
                $.hideLoading();
                if(result){
                    if(result.code == 0){
                        reqPassengerFlag = true;
                        success_event(result);
                    }else{
                        $.toast(result.data.message)
                    }
                }
            },'json');
        }else {
            if(objDefault.personList && objDefault.personList.length > 0){
                //回显
                createPersonContent(objDefault.personList);
            }
        }

    }

    //动态生成实名制乘车人信息
    function createPersonContent(personList) {
        var _personContentHtml = '';
        var personContent = $('.select-person-container .person-content');
        var selectedNo = 0;//选中的人数
        $.each(personList,function (index,person) {
            var activeName = '';
            var idCardType = '身份证：';
            var selectedFlag = false;
            if(person.selectedFlag){
                activeName = ' active'
                selectedFlag = true;
                selectedNo++;
            }
            if(person.idCardType == '1'){
                idCardType = '身份证：'
            }
            if(person.showIdCardNo==undefined){
                person.showIdCardNo = '';
            }
            if(person.idCardNo == undefined){
                person.idCardNo = '';
            }

            _personContentHtml += '<li class="person-item" data-id="' + person.id + '" data-name="' + person.passengerName + '" ' +
                'data-idcardno="' + person.idCardNo + '" data-idcardtype="'+ person.idCardType+'" data-showidcardno="'+person.showIdCardNo+'" ' +
                'data-selected="'+selectedFlag+'">' +
                '<div class="selection'+ activeName +'">' +
                '<i></i>' +
                '<div class="person-box">' +
                '<div class="name">' + person.passengerName + '</div>' +
                '<div class="ID-No">' + idCardType + person.idCardNo + '</div>' +
                '</div>' +
                '</div>' +
                '<div class="edit-btn"></div>' +
                '</li>';
        });
        $(personContent).html(_personContentHtml);
        $('.select-person-main .title #checkPassenger').data('value',selectedNo);//选中的人数
        $('.select-person-main .title #checkPassenger').html(selectedNo);

        $('.selection').off('click').on('click',function () {
            var idNo = $(this).parent().data('showidcardno');
            if(idNo){
                var classNames = $(this).attr('class');
                var selected = $('.select-person-main .title #checkPassenger').data('value');//选中的人数
                var maxNum = $('.select-person-main .title #maxPassenger').data('value');//最大座位数
                if( classNames.indexOf('active') == -1){
                    //选中乘车人
                    if(selected < maxNum){
                        //选中乘车人
                        $(this).addClass('active');
                        $(this).parent().data('selected',true);//选中标记
                        selected++;
                    }else {
                        $.toast('最多'+maxNum+'位哦~');
                        return;
                    }
                }else{
                    $(this).removeClass('active');
                    $(this).parent().data('selected',false);
                    selected--;
                }
                $('.select-person-main .title #checkPassenger').html(selected);
                $('.select-person-main .title #checkPassenger').data('value',selected);

                //总人数中修改选中标记
                var id = $(this).parent().data('id');
                $.each(personList,function (index,person) {
                    if(id == person.id){
                        person.selectedFlag = !person.selectedFlag;
                        return;
                    }
                })
            }else{
                $.toast('请添加该乘车人证件号码');
            }
        });

        // 编辑实名制乘车人
        $('.person-item .edit-btn').on(click_tap,function () {
            $('.select-person-container').hide();

            //动态生成编辑弹窗数据
            var _parent = $(this).parent();
            var name = $(_parent).data('name');
            var idNo = $(_parent).data('showidcardno');
            var id = $(_parent).data('id');
            var selectedFlag = $(_parent).data('selected');
            showEditPersonContainer(name,idNo,id,selectedFlag);
        });
    }

    //动态生成 编辑/添加 实名制乘车人信息
    function showEditPersonContainer(name,idno,id,selectedFlag) {
        var _editPersonContainer = '';
        var _titleHtml = '';
        var editType = 0;//编辑类型 1-新增,2-编辑
        if(name == undefined){
            name = '';
        }
        if(idno == undefined){
            idno = '';
        }
        if( name==''&&  idno==''){
            //添加乘车人
            _titleHtml ='<div class="title">添加乘车人</div>';
            editType = 1;
        }else{
            // 编辑乘车人
            _titleHtml ='<div class="title">编辑乘车人</div>';
            editType = 2;
        }
        _editPersonContainer +=
            '<div class="popup-main">' +
            '<div class="title-content">' +
            '<div class="close-edit">取消</div>'+ _titleHtml +'<div class="confirm-btn" data-confirm="true">确定</div>' +
            '</div>' +
            '<div class="edit-box">' +
            '<div class="edit-item">' +
            '<div class="name">姓名</div><input id="passengerName" class="value" value="' + name + '" placeholder="请输入乘车人姓名" data-id="'+id +'"/>' +
            '</div>' +
            '<div class="edit-item">' +
            '<div class="name">身份证</div><input id="passengerCode" class="value" value="' + idno + '" placeholder="请输入乘车人证件号码"/>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('.edit-person-container').html(_editPersonContainer).show();

        //取消 添加/编辑 乘车人
        $('.edit-person-container .close-edit').on(click_tap,function () {
            $('.select-person-container').show();
            $('.edit-person-container').hide();
        });
        //确定 添加/编辑 乘车人
        $('.edit-person-container .confirm-btn').on(click_tap,function () {
            var flag = $(this).data('confirm');
            if(flag == false)return;
            // 数据提交
            var name = $.trim($('#passengerName').val());
            var IDNo = $.trim($('#passengerCode').val());
            if(name == ''){
                $.toast('请输入乘车人姓名');
            }else if(IDNo == ''){
                $.toast('请输入乘车人证件号码');
            }else if(!(new clsIDCard(IDNo).Valid)){
                $.toast('请输入正确的乘车人证件号码');
            }else if(name !='' && IDNo!='' && (new clsIDCard(IDNo).Valid)){
                confirmEditPerson(editType,selectedFlag);
                $('.select-person-container').show();
                $('.edit-person-container').hide();
            }

            //
        });

        //兼容iPhone input的获取焦点问题
        // if(!isAndroid()){
        //     $('#edit-person-container input').on('touchstart',function () {
        //         $(this).focus();
        //     })
        // }
    }

    /**
     * 提交编辑/添加的乘车人信息
     * @param editType 1-新增,2-编辑，
     */
    function confirmEditPerson(editType,selectedFlag) {
        //  数据提交到后台 后台返回提交数据的后台id号
        if(editType == '1'){
            addPassengerRequest();
        }else if(editType == '2'){
            editPassenger(selectedFlag)
        }
    }

    /**
     * 添加乘乘车人请求
     */
    function  addPassengerRequest(){
        var name = $('#passengerName').val();
        // var phone = $('#addPassengerPhone').val();
        var code = $('#passengerCode').val();

        if(name==""){
            $.toast("姓名不能为空");
            return;
        }
        if(!/^[\u4E00-\u9FA5]{0,10}$/.test(name)){
            $.toast('请输入10位以内中文姓名');
            return;
        }
        /*if(phone==""){
            $.toast("手机号不能为空");
            return;
        }
        if(!checkTel(phone)){
            $.toast("手机号格式错误");
            return;
        }*/
        if($('#amount').data('type') === "1" ){
            if(code==""){
                $.toast("身份证号不能为空");
                return;
            }
            if (code&& !new clsIDCard(code).Valid )
            {
                $.toast('请填写正确的身份证');
                return;
            }
        }

        $('.edit-person-container .confirm-btn').data('confirm',false);
        $.showLoading();
        // $.post("/bus/passengerContactInfo/addContact",{passengerName:name,mobile:phone,idCardNo:code,token:$.cookie("token")},function(result){
        $.post("/bus/passengerContactInfo/addContact",{passengerName:name,idCardNo:code,token:$.cookie("token")},function(result){
            $.hideLoading();
            $('.edit-person-container .confirm-btn').data('confirm',true);
            if(result.code == 0){
                var maxNo = $('.select-person-container .title-box #maxPassenger').data('value');//最大座位数
                var selected = $('.select-person-container .title-box #checkPassenger').data('value');//已选中人数

                //数据回显到选择乘车人页面
                var person = result.data;
                if(selected >= maxNo){
                    person.selectedFlag = false;
                }else{
                    person.selectedFlag = true;
                    //选择人数变化
                    var selected = $('.select-person-container .title-box #checkPassenger').data('value');
                    selected++;
                    $('.select-person-container .title-box #checkPassenger').data('value',selected);
                    $('.select-person-container .title-box #checkPassenger').html(selected);
                }

                objDefault.personList.push(person);
                createPersonContent(objDefault.personList);
            }else{
                $.alert(result.message);
                return;
            }
        },'json');
    }

    //编辑乘车人
    function editPassenger(selectedFlag){
        var urlStr = '/bus/passengerContactInfo/update';
        var _editName = $('#passengerName').val(),
            _currentEditPassengerId = $('#passengerName').data('id'),
            // _phoneName = $('#editPassengerPhone').val(),
            _codeName = $('#passengerCode').val();

        if(_editName==""){
            $.toast("姓名不能为空");
            return;
        }
        if(!/^[\u4E00-\u9FA5]{0,10}$/.test(_editName)){
            $.toast('请输入10位以内中文姓名');
            return;
        }

        /*if(_phoneName==""){
            $.toast("手机号不能为空");
            return;
        }
        if(!checkTel(_phoneName)){
            $.toast("请填写正确的手机号");
            return;
        }*/

        if($('#amount').data('type') === "1"){
            if(_codeName==""){
                $.toast("身份证不能为空");
                return;
            }
            var flag = new clsIDCard(_codeName);
            if(!flag.Valid){
                $.toast('请填写正确的身份证');
                return false;
            }
        }
        $('.edit-person-container .confirm-btn').data('confirm',false);
        var dataObj = {
            id: _currentEditPassengerId,
            passengerName: _editName,
            // mobile: _phoneName,
            idCardNo: _codeName,
            token:$.cookie('token')
        };
        $.ajaxService({
            type: 'POST',
            url:urlStr,
            data:dataObj,
            dataType:  "json",
            success: function(result){
                $('.edit-person-container .confirm-btn').data('confirm',true);
                if(result&&result.code==0){
                    // 数据回显到选择乘车人页面
                    var editPerson = result.data;
                    $.each(objDefault.personList,function (index,person) {
                        if(_currentEditPassengerId == person.id){
                            if(selectedFlag){
                                editPerson.selectedFlag = true;
                                objDefault.personList[index] = editPerson;
                            }else{
                                //选中之前编辑 选择人数变化
                                editPerson.selectedFlag = true;//默认选中
                                objDefault.personList[index] = editPerson;
                            }
                            return false;
                        }
                    });
                    createPersonContent(objDefault.personList);
                }else{
                    $.alert((result&&result.message) || "未知错误");
                }
            }
        });
    }

    //非实名制乘客人数运算
    $('.operation .icon-minus').off('click').on('click', function () {
        //减
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);
            var _v = parseInt(el.next().text());
            if(_v <= orderInfo.ticketMaxBuyNumber) {
                el.siblings('.icon-plus').removeClass('out');
            }
            if(_v == 1) {
                //TODO
                //$.alert('人数至少为1');
            } else {
                el.next().text(_v - 1);
                $("#passengerNumber").attr('data-passengerNum',_v - 1);
                sessionStorage.setItem('passengerNumber',(_v - 1));
                calculateTotalPrice();
                if(el.next().text() == 1) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });
    //非实名制乘客人数运算
    $('.operation .icon-plus').off('click').on('click', function () {
        //加
        var el = $(this);

        if(!el.data('clock')) {
            el.data('clock', true);
            var _v = parseInt(el.prev().text());

            if(_v == 1) {
                el.siblings('.icon-minus').removeClass('out');
            }

            if(_v == orderInfo.ticketMaxBuyNumber) {

            } else {
                el.prev().text(_v + 1);
                $("#passengerNumber").attr('data-passengerNum',_v + 1);
                sessionStorage.setItem('passengerNumber',(_v + 1));
                calculateTotalPrice();
                if(el.prev().text() == orderInfo.ticketMaxBuyNumber) {
                    el.addClass('out');
                }
            }

            el.data('clock', false);
        }
    });
}