//初始化参数
var personList = [];//所有乘车人信息列表
var click_tap = isAndroid()?'tap':'click';

// 弹出框关闭
$('.popup-container .close').on(click_tap,function () {
    $('.popup-container').hide();
});

$('#closeButton').on(click_tap,function () {
    $('.price-detail-container').closePopup();
});
$('#closePopup').on(click_tap,function () {
    $('.market-rule-container').closePopup();
});

//选择人数
$('#amount').on(click_tap,function () {
    $('.select-person-container').show();
    showSelectPicker();
});

//添加实名制乘车人
$('.add-person').on(click_tap,function () {
    $('.select-person-container').hide();
    showEditPersonContainer();
});

//确定选中的实名制乘车人按钮
$('.select-person-container .confirm-btn').on(click_tap,function () {
    var selected = $('.select-person-main .title .selected').data('value');//选中的人数
    var selectedList = [];//选中的乘客列表
    var _selectedInputHtml = '';
    if(selected <= 0){
        $.toast('请选择乘车人');
        return;
    }else {
        $('#amount').val(selected);
        var allList = $('.select-person-container .person-content .person-item');
        $.each(allList,function (index, item) {
            var person = {};
            if($(item).data('selected')){
                if($(item).data('showidcardno')){
                    person.name = $(item).data('name');
                    person.showIdCardNo = $(item).data('showidcardno');
                    selectedList.push(person);
                    _selectedInputHtml += '<div class="item" data-id="'+ $(item).data('id') +'" data-idcard="'+ $(item).data('idcardno') +'">' +
                    '  <div class="handle-minus"></div>' +
                    '  <div class="info">' +
                    '    <p><span class="label passenger-name">姓名：'+ $(item).data('name') +'</span></p>' +
                    '    <p><span class="label passenger-name">身份证：'+ $(item).data('idcardno') +'</span></p>' +
                    '  </div>' +
                    '</div>'+
                    '<input type="hidden" data-id="" data-name="'+ $(item).data('name') +'" data-showidcardno="'+ $(item).data('showidcardno') +'" />';
                }else{
                    $.toast('请添加乘车人证件号码');
                    return;
                }
            }
        });
        //添加到页面
        $('#personList').html(_selectedInputHtml);
        $('.select-person-container').hide();
    }
});

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

    $.showLoading();
    // $.post("/bus/passengerContactInfo/addContact",{passengerName:name,mobile:phone,idCardNo:code,token:$.cookie("token")},function(result){
    $.post("/bus/passengerContactInfo/addContact",{passengerName:name,idCardNo:code,token:$.cookie("token")},function(result){
        $.hideLoading();
        if(result.code == 0){
            var maxNo = $('.select-person-container .title-box .total').data('value');//最大座位数
            var selected = $('.select-person-container .title-box .selected').data('value');//已选中人数

            //数据回显到选择乘车人页面
            var person = result.data;
            if(selected >= maxNo){
                person.selectedFlag = false;
            }else{
                person.selectedFlag = true;
                //选择人数变化
                var selected = $('.select-person-container .title-box .selected').data('value');
                selected++;
                $('.select-person-container .title-box .selected').data('value',selected);
                $('.select-person-container .title-box .selected').html(selected);
            }

            personList.push(person);
            createPersonContent(personList);
        }else{
            $.alert(result.message);
            return;
        }
    },'json');
}

/**
 * 查询乘车人列表请求
 */
function queryPassengerRequest(){
    var token=$.cookie('token');
    $.post("/bus/passengerContactInfo/passengerList",{token:$.cookie("token")},function(result){
        if(null!=result){
            if(result.code == 0){
                personList = [];
                $.each(result.data,function (index,person) {
                    var tempPerson = person;
                    tempPerson.selectedFlag = false;
                    personList.push(tempPerson);
                });
                createPersonContent(personList);
            }
        }
    },'json');
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
            if(result&&result.code==0){
                // 数据回显到选择乘车人页面
                var editPerson = result.data;
                $.each(personList,function (index,person) {
                    if(_currentEditPassengerId == person.id){
                        if(selectedFlag){
                            editPerson.selectedFlag = true;
                            personList[index] = editPerson;
                        }else{
                            //选中之前编辑 选择人数变化
                            editPerson.selectedFlag = true;//默认选中
                            personList[index] = editPerson;
                        }
                        return false;
                    }
                });
                createPersonContent(personList);
            }else{
                $.alert((result&&result.message) || "未知错误");
            }
        }
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
        '<div class="close-edit">取消</div>'+ _titleHtml +'<div class="confirm-btn">确定</div>' +
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
    });
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

        _personContentHtml += '<div class="person-item" data-id="' + person.id + '" data-name="' + person.passengerName + '" ' +
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
            '</div>';
    });
    $(personContent).html(_personContentHtml);
    $('.select-person-main .title .selected').data('value',selectedNo);//选中的人数
    $('.select-person-main .title .selected').html(selectedNo);

    $('.selection').on(click_tap,function () {
        var idNo = $(this).parent().data('showidcardno');
        if(idNo){
            var classNames = $(this).attr('class');
            var selected = $('.select-person-main .title .selected').data('value');//选中的人数
            var maxNum = $('.select-person-main .title .total').data('value');//最大座位数
            if( classNames.indexOf('active') == -1){
                //选中乘车人
                if(selected < maxNum){
                    //选中乘车人
                    $(this).addClass('active');
                    $(this).parent().data('selected',true);//选中标记
                    selected++;
                }else {
                    $.toast('最多'+maxNum+'位哦~')
                }
            }else{
                $(this).removeClass('active');
                $(this).parent().data('selected',false);
                selected--;
            }
            $('.select-person-main .title .selected').html(selected);
            $('.select-person-main .title .selected').data('value',selected);

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

//选择乘车人 非实名制人数/实名制乘车人
function showSelectPicker(){
    console.log("加判断");
    // 乘车人信息列表
    queryPassengerRequest();
}

// 动态生成实名制乘车人信息
function showSelectPerson() {
    $('.select-person-container').show();
}

var winHeight = $(window).height();   //获取当前页面高度
$(window).resize(function(){
    var thisHeight = $(this).height();
    if(winHeight - thisHeight > 50){
        //当软键盘弹出，在这里面操作
        $('.confirm-container').hide();
    }else{
        //当软键盘收起，在此处操作
        $('.confirm-container').show();
    }
});