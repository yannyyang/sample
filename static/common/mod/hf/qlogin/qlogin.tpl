<div id="qLoginFrame" class="qlogin_frame">
	<div class="content">
		<div class="line mobile">
			<div class="input_frame">
				<input type="text" class="mobile_input" id="mobile" placeholder="请输入手机号码"/>
			</div>
			<div id="mobileStatus" class="mobile_status status">请输入正确的手机号码</div>
		</div>
		<div class="line imgcaptcha">
			<div class="input_frame">
				<input type="text" class="imgcaptcha_input" id="imgcaptcha" placeholder="请输入图形验证码"/>
				<img src="" class="refresh_img" id="refreshImg"/>
			</div>
			<div id="imgcaptchaStatus" class="imgcaptcha_status status">请输入正确的图形验证码</div>
		</div>
		<div class="line smscaptcha">
			<div class="input_frame">
				<input type="text" class="smscaptcha_input" id="smscaptcha" placeholder="请输入短信验证码"/>
				<a href="javascript:;" class="sendsms_btn" id="sendSms">发送验证码</a>
			</div>
			<div id="smscaptchaStatus" class="smscaptcha_status status">请输入正确的短信验证码</div>
			<div id="serverStatus" class="server_status status"></div>
		</div>
		<div class="agree_check">
			<input type="checkbox" checked="checked" class="agree_box" id="agreement"/>我同意
			<a href="http://about.pinganfang.com/public/agreement/" target="_blank">平安好房协议</a>
		</div>
		<a href="javascript:;" class="submit" id="submit">提交</a>
	</div>
</div>