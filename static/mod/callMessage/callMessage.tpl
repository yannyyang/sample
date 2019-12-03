<div id="qLoginFrame" style="display: none;">
<div class="login_mask">
	<div class="login_box">
		<div class="login_content">
			<p class="login_tit"><span>提醒我</span></p>
			<p class="login_text">我们会在秒杀开始前提醒您</p>
			<!-- 输入框 -->
			<ul class="login_form">
				<li class="login_tel"><input type="text" id="loginMobile" placeholder="请输入手机号码" maxlength="15" value="" /></li>
				<li class="login_yzm J_imgcaptcha">
					<img src="" class="login_yzmimg" id="refreshImg" />
					<input type="text" id="loginImgYzm" placeholder="请输入图片验证码" maxlength="10" class="login_minw" value="" />
				</li>
				<li class="login_sms">
					<button class="login_smsbtn" id="sendSms">发送验证码</button>
					<input type="text" id="loginSms" placeholder="请输入短信验证码" maxlength="10" class="login_minw" value="" />
				</li>
			</ul>
			<p class="login_wrong_tip" id="loginWrongTip"></p>
			<!-- 登陆 -->
			<p class="login_submit"><button id="loginSubmit">提交</button></p>
		</div>
		<p class="close_icon"><a class="login_close" id="loginClose"></a></p>
	</div>
	
</div>
</div>