var adDomain='${adDomain!}';
var domain = adDomain;
var version = '${version!}';
var positionCode='${positionCode!}';
var providerId='${providerId!}';
var operatorId='${operatorId!""}';
if (positionCode === 'index-banner') {
	if ($.cookie('show_ad') != 'show') {
			if (adDomain.indexOf('osp')<0) {
				document.write('<script src="//osp.${adDomain!}/pub/vert.js?position_code=${positionCode!}&provider_id=${providerId!}&operator_id=${operatorId!}&v=${version!}"></script>');
			}
            else {
				document.write('<script src="//${adDomain!}/pub/vert.js?position_code=${positionCode!}&provider_id=${providerId!}&operator_id=${operatorId!}&v=${version!}"></script>');
			}
			var now_date=new Date();
			now_date.setTime(now_date.getTime()+30*60*1000); //设置date为当前时间+30
			$.cookie('show_ad','show',{
			path : '/',//cookie的作用域
			expires:now_date
			});
	}
}
else {
		if (adDomain.indexOf('osp')<0) {
			document.write('<script src="//osp.${adDomain!}/pub/vert.js?position_code=${positionCode!}&provider_id=${providerId!}&operator_id=${operatorId!}&v=${version!}"></script>');
		}
		else {
			document.write('<script src="//${adDomain!}/pub/vert.js?position_code=${positionCode!}&provider_id=${providerId!}&operator_id=${operatorId!}&v=${version!}"></script>');
		}
}
