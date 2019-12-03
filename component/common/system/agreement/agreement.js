require.async(['common:dialog', 'common:zepto'], function(Dialog, $){
	var dialog = new Dialog({
		title: '平安好房用户协议',
		scroll: true,
		width: '85%',
		height: '70%',
		autoOpen: false,
		dom: '#user_agreement_content'
	});

	$('#user_agreement_content').show();

	$(document).bind('show_user_agreement', function(){
		dialog.open();
	});
});