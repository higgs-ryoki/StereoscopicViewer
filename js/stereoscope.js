//	stereoscope.js								2019.6.20. coded by K. RYOKI
//												2021.9.20. improved
//
var mouseEnter=1;
var mouseExit=0;
var mouseLocation=0;
var rewriteMethodText1Status=1;
var rewriteMethodText2Status=0;
var rewriteMethodText3Status=0;
var rewriteMethodText1='dblclick';
var rewriteMethodText3='';
var rewriteMethodEvent=rewriteMethodText1;
var rewriteMethodText=rewriteMethodEvent;
//初期の視点位置URL
var url_init=new URL('http://localhost/globe/index_globe.html#3000000/36/140/10/360/-90/0/&base=pale&ls=pale%7Cseamlessphoto&disp=11&lcd=pale');
var others = {
	flag:0,
	url:'http://localhost/StereoscopicViewer/img/Calcite.vesta.mp4'
	};
var last_url_0=url_init;
var last_url_1=others.url;
var url_origin=url_init.origin;					//視点位置URLのオリジン
var url_pathname=url_init.pathname;				//視点位置URLのパス
var url_hash=url_init.hash.replace("#", "");	//ハッシュデータの分解
var viewpoint_=url_hash.split('/');				//「/(ダッシュ)」で区切って分割する
var viewpoint = {								//初期値定義
	altitude: viewpoint_[0],					//高度
	latitude: viewpoint_[1],					//緯度(°)
	longitude: viewpoint_[2],					//経度(°)
	emphasis: viewpoint_[3],					//高さ強調率
	azimuth: viewpoint_[4],						//方位角(°)
	elevation: viewpoint_[5],					//仰角(°)
	inclination: viewpoint_[6],					//傾斜角(°)
	map_parameter: viewpoint_[7],				//詳細指定
	parallax: -0.5,								//視差(°)
	increments_latitude:0.01,					//Δ↑↓(°)
	increments_longitude:0.01					//Δ←→(°)
	};
var url_indication_flag=1;
var google_earth_flag=0;
var iframe01_detached='';
var iframe02_detached='';
var iframe11_detached='';
var iframe12_detached='';
//HTML書き換え用
var section_0_html='<div id="main_url">視点位置<nobr id="title_url_0"><input type="text" class="url" id="url_0" size="10" onchange="url_rewrite(0)"> <input type="button" class="button1" id="url_indication" size="6" onclick="url_text()" value="眼点表示"> </nobr></div><div class="span_value" id="sub_url"> &emsp;&emsp;左眼位置<input type="text" class="url" id="url_1" onchange="url_rewrite(1)"> <br>&emsp;&emsp;右眼位置<input type="text" class="url" id="url_2" onchange="url_rewrite(2)"> </div>';
var section_1_html='<div id="main_url">表示対象<nobr id="title_url_0"><input type="text" class="url" id="url_0" size="10" onchange="url_rewrite(0)"> </nobr></div>';
var p_0_html='<section><span class="span_value">&emsp;&emsp;&emsp;&emsp;&thinsp;&thinsp;&thinsp;高　&thinsp;度<input type="text" class="input_value" id="altitude" onchange="altitude()">(m) &emsp;&thinsp;&thinsp;緯　度<input type="text" class="input_value" id="latitude" onchange="latitude()">(deg)&emsp; 経　度<input type="text" class="input_value" id="longitude" onchange="longitude()">(deg)&emsp; 視　差<input type="text" class="input_value" id="parallax" onchange="parallax()">(deg) </span><br></section><section><span class="span_value">&emsp;<input type="button" class="move" id="button_up" onclick="up()" value="↑" > </span><span class="span_value">&emsp; 高度強調率<input type="text" class="input_value" id="emphasis" onchange="emphasis()">&emsp;&emsp;&emsp;&thinsp;&thinsp; 方位角<input type="text" class="input_value" id="azimuth" onchange="azimuth()">(deg)&emsp; 仰　角<input type="text" class="input_value" id="elevation" onchange="elevation()">(deg)&emsp; 傾斜角<input type="text" class="input_value" id="inclination" onchange="inclination()">(deg) </span><br><span class="span_value"><input type="button" class="move" id="button_left" onclick="left()" value="←" > <input type="button" class="move" id="button_right" onclick="right()" value="→" > </span><span class="span_value">&thinsp;Δ↑↓<input type="text" class="input_value" id="increments_latitude" onchange="increments_latitude()">(deg)&thinsp; &emsp;&emsp;&emsp;Δ←→<input type="text" class="input_value" id="increments_longitude" onchange="increments_longitude()">(deg)　　 </span><br><span class="span_value">&emsp;<input type="button" class="move" id="button_down" onclick="down()" value="↓" > </span><span>&emsp;&thinsp;<input type="button" class="button" id="button_drow" onclick="url_rewrite(0)" value="再描画">  <input type="button" class="button" id="google_map" onclick="mygoogle_map()" value="google view"> <input type="radio" id="googleMethod1" name="googleChoice" class="check" value="0" checked> <label for="googleMethod1" class="check" >Maps </label><input type="radio" id="googleMethod2" name="googleChoice" class="check" value="1"> <label for="googleMethod2" class="check" >Earth </label><input type="button" class="button" id="button_others" onclick="click_others()" value="others"> <input type="number" id="input_rotate" name="tentacles" min="-180" max="180" value="0" onchange="rotation()"> <span class="check">&thinsp;地図更新方法：</span><input type="checkbox" id="rewriteMethod1" name="rewriteMethod" class="check" value="dblclick" checked> <label for="rewriteMethod1" class="check" >Double Click</label><input type="checkbox" id="rewriteMethod2" name="rewriteMethod" class="check" value="mouseleave"> <label for="rewriteMethod2" class="check" >Mouse Leave</label><input type="checkbox" id="rewriteMethod3" name="rewriteMethod" class="check" value="keydown"> <label for="rewriteMethod3" class="check" >Key Down</label></span> <input type="button" class="button" id="button_innertiles" onclick="click_innertiles()" value="innertiles"></section> ';
var p_1_html='<section><input type="button" class="button" id="button_drow" onclick="url_rewrite(0)" value="再描画">  <input type="button" class="button" id="button_others" onclick="click_others()" value="others"> 　傾斜(deg)&thinsp;<input type="number" id="input_rotate" name="tentacles" min="-180" max="180" value="0" onchange="rotation()">&thinsp;<input type="button" class="button" id="button_innertiles" onclick="click_innertiles()" value="innertiles"> <input type="button" class="button" id="button_innervideo" onclick="video_viewer()" value="LocalFile(NewTab)"></section>';
var iframe01_html='<iframe class="iframe" id="iframe01" title="Inline Frame Left" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'"></iframe>';
var iframe02_html='<iframe class="iframe" id="iframe02" title="Inline Frame Right" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'"></iframe>';
var iframe11_html='<iframe class="iframe" id="iframe11" title="Inline Frame Left" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'"></iframe>';
var iframe12_html='<iframe class="iframe" id="iframe12" title="Inline Frame Right" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'"></iframe>';

//HTMLフォーム読み込み後に実行
jQuery(function ($) {
	$('#section_0').html(section_0_html);
	$('#p_0').html(p_0_html);
	$('#p_iframe1').html(iframe01_html);
	$('#p_iframe2').html(iframe02_html);
	$('#button_innertiles').css('visibility','hidden');		//内部タイル使用完成時に消す
	$('#sub_url').css('visibility','hidden');
	$('#iframe01').on('load', function() {
		event_act();
	});
	// 子フレームへ入った際のイベント
	$('#p_iframe1').on('mouseenter', function () {
		mouseLocation=mouseEnter;
	});
	// 子フレームから出た際のイベント
	$('#p_iframe1').on('mouseleave', function () {
		mouseLocation=mouseExit;
	});
	// Shiftキー(keyCode 16)を押したときのイベント
	$(document).on('keydown',function(){	
		if (event.keyCode===16 && rewriteMethodText3Status==1){
			if (mouseLocation==mouseEnter){
				iframes_redisplay01();
			}
		}
	});
	// 地図更新方法のチェックボックスをチェックしたら発動
	$('input[name="rewriteMethod"]').change(function() {
		// もしrewriteMethod1がチェック状態だったら
		if ($(rewriteMethod1).prop('checked')) {
				rewriteMethodText1Status=1;
				rewriteMethodText1=rewriteMethod1.value+' ';
			} else {
				rewriteMethodText1Status=0;
				rewriteMethodText1='';
		} 
		// もしrewriteMethod2がチェック状態だったら
		if ($(rewriteMethod2).prop('checked')) {
				rewriteMethodText2Status=1;
				rewriteMethodText2=rewriteMethod2.value+' ';
			} else {
				rewriteMethodText2Status=0;
				rewriteMethodText2='';
		}
		// もしrewriteMethod3がチェック状態だったら
		if ($(rewriteMethod3).prop('checked')) {
				rewriteMethodText3Status=1;
				rewriteMethodText3=rewriteMethod3.value;
			} else {
				rewriteMethodText3Status=0;
				rewriteMethodText3='';
		}
		rewriteMethodEvent=rewriteMethodText1+rewriteMethodText2;
		rewriteMethodText=rewriteMethodText1+rewriteMethodText2+rewriteMethodText3;
		event_act();
	});
// 子フレームのイベント
	//表示初期値
	$('#altitude').val(viewpoint.altitude);							//高度
	$('#latitude').val(viewpoint.latitude);							//緯度(°)
	$('#longitude').val(viewpoint.longitude);						//経度(°)
	$('#emphasis').val(viewpoint.emphasis);							//高さ強調率
	$('#azimuth').val(viewpoint.azimuth);							//方位角(°)
	$('#elevation').val(viewpoint.elevation);						//仰角(°)
	$('#inclination').val(viewpoint.inclination);					//傾斜角(°)
	$('#parallax').val(viewpoint.parallax);							//視差(°)
	$('#increments_latitude').val(viewpoint.increments_latitude);	//Δ↑↓(°)
	$('#increments_longitude').val(viewpoint.increments_longitude);	//Δ←→(°)
																	//視点位置URL
	$('#url_0').val(url_origin+url_pathname+"#"+viewpoint_.join('/'));					//視点位置URL作成
	viewpoint_[2]=String(parseFloat(viewpoint_[2])-parseFloat(viewpoint.parallax/2));	//経度を変えて左眼URL作成
	$('#url_1').val(url_origin+url_pathname+"#"+viewpoint_.join('/'));
	viewpoint_[2]=String(parseFloat(viewpoint_[2])+parseFloat(viewpoint.parallax));		//経度を変えて右眼URL作成
	$('#url_2').val(url_origin+url_pathname+"#"+viewpoint_.join('/'));
	viewpoint_[2]=String(parseFloat(viewpoint_[2])-parseFloat(viewpoint.parallax/2));	//経度を視点位置に戻しておく
	iframes_change();
});
function difine_event() {
	// 子フレームへ入った際のイベント
	$('#iframe01').on('mouseenter', function () {
		mouseLocation=mouseEnter;
	});
	// 子フレームから出た際のイベント
	$('#iframe01').on('mouseleave', function () {
		mouseLocation=mouseExit;
	});
	// Shiftキー(keyCode 16)を押したときのイベント
	$(document).on('keydown',function(){	
		if (event.keyCode===16 && rewriteMethodText3Status==1){
			if (mouseLocation==mouseEnter){
				iframes_redisplay01();
			}
		}
	});
	// 地図更新方法のチェックボックスをチェックしたら発動
	$('input[name="rewriteMethod"]').change(function() {
		// もしrewriteMethod1がチェック状態だったら
		if ($(rewriteMethod1).prop('checked')) {
				rewriteMethodText1Status=1;
				rewriteMethodText1=rewriteMethod1.value+' ';
			} else {
				rewriteMethodText1Status=0;
				rewriteMethodText1='';
		} 
		// もしrewriteMethod2がチェック状態だったら
		if ($(rewriteMethod2).prop('checked')) {
				rewriteMethodText2Status=1;
				rewriteMethodText2=rewriteMethod2.value+' ';
			} else {
				rewriteMethodText2Status=0;
				rewriteMethodText2='';
		}
		// もしrewriteMethod3がチェック状態だったら
		if ($(rewriteMethod3).prop('checked')) {
				rewriteMethodText3Status=1;
				rewriteMethodText3=rewriteMethod3.value;
			} else {
				rewriteMethodText3Status=0;
				rewriteMethodText3='';
		}
		rewriteMethodEvent=rewriteMethodText1+rewriteMethodText2;
		rewriteMethodText=rewriteMethodText1+rewriteMethodText2+rewriteMethodText3;
	});
		event_act();
}
//図の更新トリガ
function event_act() {
	$('#body').contents().on('dblclick', iframes_redisplay01);
	$('#iframe01').contents().off();
	$('#iframe01').contents().on(rewriteMethodEvent, iframes_redisplay01);
	$('#iframe02').contents().off();
	$('#iframe02').contents().on('dblclick', iframes_redisplay02);
}
//TextBoxの内容表示更新
function box_change() {
	$('#altitude').val(viewpoint.altitude);							//高度
	$('#latitude').val(viewpoint.latitude);							//緯度(°)
	$('#longitude').val(viewpoint.longitude);						//経度(°)
	$('#emphasis').val(viewpoint.emphasis);							//高さ強調率
	$('#azimuth').val(viewpoint.azimuth);							//方位角(°)
	$('#elevation').val(viewpoint.elevation);						//仰角(°)
	$('#inclination').val(viewpoint.inclination);					//傾斜角(°)
}
//視点位置項目の変更
function url_change(input_url){
	p_url=new URL(input_url);
	url_origin=p_url.origin;
	url_pathname=p_url.pathname;
	viewpoint_hash=p_url.hash.replace("#", "");
	viewpoint_=viewpoint_hash.split('/');				//「/(ダッシュ)」で区切って分割する
	viewpoint_[0]=viewpoint.altitude;								//高度
	viewpoint_[1]=viewpoint.latitude;								//緯度(°)
	viewpoint_[3]=viewpoint.emphasis;								//高さ強調率
	viewpoint_[4]=viewpoint.azimuth;								//方位角(°)
	viewpoint_[5]=viewpoint.elevation;								//仰角(°)
	viewpoint_[6]=viewpoint.inclination;							//傾斜角(°)
	//経度(°)の作成と各図のURL作成
	viewpoint_[2]=String(parseFloat(viewpoint.longitude)-parseFloat(viewpoint.parallax)*0.5);
	$('#url_1').val(make_url());
	viewpoint_[2]=String(parseFloat(viewpoint.longitude)+parseFloat(viewpoint.parallax)*0.5);
	$('#url_2').val(make_url());
	viewpoint_[2]=viewpoint.longitude;
	$('#url_0').val(make_url());
}
//再描画
function url_rewrite(url_number) {//url_number=0:viewpoint, =1:left, =2:right
	switch (url_number) {
		case 0:		//viewpoint　[視点ＵＲＬ入力時]
			if (others.flag==1) {	//動画の場合
				disp_url=$('#url_0').val();
				if (disp_url.startsWith('<iframe')){	//YouTubeの埋め込み
					disp_url_float1=disp_url.replace('<iframe','<iframe id="iframe11" style="float: left; "');
					disp_url_float1=disp_url_float1.replace('allowfullscreen>','>');
					dqm = 10;
					disp_url_float1= disp_url_float1.replace(/"/g, function(match){ if(--dqm==0) return '?autoplay=1&mute=1"'; else return match; });
					disp_url_float2=disp_url_float1.replace('iframe11','iframe12');
					$('#p_iframe1').html(disp_url_float1);
						$('#p_iframe2').html(disp_url_float2);
				} else {								//mp4などの映像の表示
					$('#p_iframe1').html(iframe01_html);
					$('#p_iframe2').html(iframe02_html);
					$('#iframe01').attr('src',disp_url);					//左図再描画
					$('#iframe02').attr('src',disp_url);					//右図再描画
				}
			} else {				//Globeの場合
				if($('#iframe11').length){	//#iframe11が存在するとき
					iframe11_detached=$('#iframe11').detach();
					iframe12_detached=$('#iframe12').detach();
					$('#p_iframe1').html(iframe01_html);
					$('#p_iframe2').html(iframe02_html);
				}
				if (iframe01_detached!='') {//かつて#iframe01が存在していた場合
					$('#iframe01').replaceWith(iframe01_detached);
					$('#iframe02').replaceWith(iframe02_detached);
				} else {
					$('#p_iframe1').html(iframe01_html);
					$('#p_iframe2').html(iframe02_html);
				}
				viewpoint_=change_viewpoint($('#url_0').val());
				viewpoint.longitude=viewpoint_[2];	
				$('#longitude').val(viewpoint.longitude);
				box_change();
				viewpoint_[2]=String(parseFloat(viewpoint.longitude)-parseFloat(viewpoint.parallax)*0.5);
				$('#url_1').val(make_url());
				viewpoint_[2]= String(parseFloat(viewpoint.longitude)+parseFloat(viewpoint.parallax)*0.5);
				$('#url_2').val(make_url());
				viewpoint_[2]= String(parseFloat(viewpoint.longitude));
				$('#url_0').val(make_url());
				if (rewriteMethodText1Status==1) {					// もしrewriteMethod1がチェック状態だったら
					$('#rewriteMethod1').prop('checked', true);
				} else {
					$('#rewriteMethod1').prop('checked', false);
				}
				if (rewriteMethodText2Status==1) {					// もしrewriteMethod2がチェック状態だったら
					$('#rewriteMethod2').prop('checked', true);
				} else {
					$('#rewriteMethod2').prop('checked', false);
				}
				if (rewriteMethodText3Status==1) {				// もしrewriteMethod1がチェック状態だったら
					$('#rewriteMethod3').prop('checked', true);
				} else {
					$('#rewriteMethod3').prop('checked', false);
				}
				iframes_change();										//再描画
				difine_event();
			}
			difine_event();
		break;
		case 1:		//left　[左図ＵＲＬ入力時]
			viewpoint_=change_viewpoint($('#url_1').val());
			viewpoint_[2]=String(parseFloat(viewpoint_[2])+parseFloat(viewpoint.parallax)*0.5);
			viewpoint.longitude=viewpoint_[2];
			box_change();
			$('#url_0').val(make_url());
			viewpoint_[2]=String(parseFloat(viewpoint_[2])+parseFloat(viewpoint.parallax)*0.5);
			$('#url_2').val(make_url());
			iframes_change();										//再描画
		break;
		case 2:		//right　[右図ＵＲＬ入力時]
			viewpoint_=change_viewpoint($('#url_2').val());
			viewpoint_[2]=String(parseFloat(viewpoint_[2])-parseFloat(viewpoint.parallax)*0.5);
			viewpoint.longitude=viewpoint_[2];
			box_change();
			$('#url_0').val(make_url());
			viewpoint_[2]=String(parseFloat(viewpoint_[2])-parseFloat(viewpoint.parallax)*0.5);
			$('#url_1').val(make_url());
			iframes_change();										//再描画
		break;
	};
}
//視点変更
function change_viewpoint(Previous_url) {
	p_url=new URL(Previous_url);
	url_origin=p_url.origin;							//視点位置URLのオリジン
	url_pathname=p_url.pathname;						//視点位置URLのパス
	viewpoint_hash=p_url.hash.replace("#", "");			//ハッシュデータの分解
	viewpoint_=viewpoint_hash.split('/');				//「/(ダッシュ)」で区切って分割する
	//視点位置設定
	viewpoint.altitude=viewpoint_[0];					//高度
	viewpoint.latitude=viewpoint_[1];					//緯度(°)
	viewpoint.emphasis=viewpoint_[3];					//高さ強調率
	viewpoint.azimuth=viewpoint_[4];					//方位角(°)
	viewpoint.elevation=viewpoint_[5];					//仰角(°)
	viewpoint.inclination=viewpoint_[6];				//傾斜角(°)
	return viewpoint_;
}
//URL合成
function make_url() {
	result_url = url_origin+url_pathname+"#"+viewpoint_.join('/');	//「/(ダッシュ)」で連結する
	return result_url;
}
//図変更準備および描画
function iframes_change(){
	$('#iframe01').attr('src',"");											//左図消去
	$('#iframe02').attr('src',"");											//右図消去
	window.setTimeout("$('#iframe01').attr('src',$('#url_1').val())", 50);	//左図再描画
	window.setTimeout("$('#iframe02').attr('src',$('#url_2').val())", 50);	//右図再描画
}
//視点高度 変更
function altitude() {
	value=$('#altitude').val();
	viewpoint.altitude=value;
	change_element(0,value);
}
//緯度 変更
function latitude() {
	value=$('#latitude').val();
	viewpoint.latitude=value;
	change_element(1,value);
}
//経度 変更
function longitude() {
	value=$('#longitude').val();
	viewpoint.longitude=value;
	change_element(2,value);
}
//高度強調率 変更
function emphasis() {
	value=$('#emphasis').val();
	viewpoint.emphasis=value;
	change_element(3,value);
}
//方位角 変更
function azimuth() {
	value=$('#azimuth').val();
	viewpoint.azimuth=value;
	change_element(4,value);
}
//仰角 変更
function elevation() {
	value=$('#elevation').val();
	viewpoint.elevation=value;
	change_element(5,value);
}
//傾斜角 変更
function inclination() {
	value=$('#inclination').val();
	viewpoint.inclination=value;
	change_element(6,value);
}
//視差 変更
function parallax() {
	value=$('#parallax').val();
	viewpoint.parallax=value;
	url_0_value=$('#url_0').val();
	url_change(url_0_value);
	iframes_change();
}
//Δ↑↓ 変更
function increments_latitude() {
	value=$('#increments_latitude').val();
	viewpoint.increments_latitude=value;
}
//Δ←→ 変更
function increments_longitude() {
	value=$('#increments_longitude').val();
	viewpoint.increments_longitude=value;
}
//↑↓←→ 変更
function up() {
	viewpoint.latitude=String(parseFloat(viewpoint.latitude)+parseFloat(viewpoint.increments_latitude));
	$('#latitude').val(viewpoint.latitude);
	latitude();
}
function down() {
	viewpoint.latitude=String(parseFloat(viewpoint.latitude)-parseFloat(viewpoint.increments_latitude));
	$('#latitude').val(viewpoint.latitude);
	latitude();
}
function left() {
	viewpoint.longitude=String(parseFloat(viewpoint.longitude)-parseFloat(viewpoint.increments_longitude));
	$('#longitude').val(viewpoint.longitude);
	longitude();
}
function right() {
	viewpoint.longitude=String(parseFloat(viewpoint.longitude)+parseFloat(viewpoint.increments_longitude));
	$('#longitude').val(viewpoint.longitude);
	longitude();
}
//視点URL項目変更
function change_element(oder,value) {
	viewpoint_[oder]=value;
	$('#url_0').val(url_origin+url_pathname+"#"+viewpoint_.join('/'));
	url_rewrite(0);													//再描画
}
//表示切替
function click_others() {
	if (others.flag==0) {											//動画等表示
			last_url_0=$('#url_0').val();
			last_parallax=$('#parallax').val();
			last_increments_latitude=$('#increments_latitude').val();
			last_increments_longitude=$('#increments_longitude').val();
			$('#section_0').html(section_1_html);
			$('#p_0').html(p_1_html);
			$('#button_innertiles').css('visibility','hidden');
			$('#input_rotate').css('visibility','visible');
			$('#button_others').val("GIS Globe");
			$('#url_0').val(last_url_1);
			others.flag=1;
			iframe01_detached=$('#iframe01').detach();
			iframe02_detached=$('#iframe02').detach();
			$('#p_iframe1').html(iframe11_html);
			$('#p_iframe2').html(iframe12_html);
			if (iframe11_detached!='') {					//以前の#iframe11があれば表示
				$('#iframe11').replaceWith(iframe11_detached);
				$('#iframe12').replaceWith(iframe12_detached);
			}
			url_rewrite(0);
		} else {
			last_url_1=$('#url_0').val();
			$('#section_0').html(section_0_html);
			$('#p_0').html(p_0_html);
			difine_event();
			$('#button_innertiles').css('visibility','hidden');
			$('#sub_url').css('visibility','hidden');
			$('#input_rotate').css('visibility','hidden');
			$('#input_rotate').val(0);
			$('iframe').css('transform', 'rotate(0deg)');
			others.flag=0;
			viewpoint_[2]=viewpoint.longitude;
			$('#url_0').val(last_url_0);
			$('#parallax').val(last_parallax);
			$('#increments_latitude').val(last_increments_latitude);
			$('#increments_longitude').val(last_increments_longitude);
			iframe11_detached=$('#iframe11').detach();
			iframe12_detached=$('#iframe12').detach();
			$('#p_iframe1').html(iframe01_html);
			$('#p_iframe2').html(iframe02_html);
			$('#iframe01').replaceWith(iframe01_detached);
			$('#iframe02').replaceWith(iframe02_detached);
			url_rewrite(0);
	}
}
//左図を基に右図を描画
function iframes_redisplay01() {
	text1=document.getElementById('iframe01').contentDocument.location.href;
	$("#url_1").val(text1);
	url_rewrite(1);
}
//右図を基に左図を描画
function iframes_redisplay02() {
	text2=document.getElementById('iframe02').contentDocument.location.href;
	$("#url_2").val(text2);
	url_rewrite(2);
}
//眼点表示
function url_text() {
	if (url_indication_flag==0) {	//url_1,url_2を表示しない場合
		$('#url_indication').val("眼点表示");
		$('#sub_url').css('visibility','hidden');
		$('#url_1').css('visibility','hidden');
		$('#url_2').css('visibility','hidden');
		url_indication_flag=1;
	} else {						//url_1,url_2を表示する場合
		$('#url_indication').val("眼点非表示");
		$('#sub_url').css('visibility','visible');
		$('#url_1').css('visibility','visible');
		$('#url_2').css('visibility','visible');
		url_indication_flag=0;
	}
}
//othersでのiframe回転
function rotation() {
	angle = $("#input_rotate").val();
	$('iframe').css('transform', 'rotate('+angle+'deg)');
}
//StereoscopicVideoの呼び出し
function video_viewer() {
	window.open("./stereoscopic_video.html","_blank");
return false;
}
//google mapの準備
function mygoogle_map() {
	windowname1='window1';
	windowname2='window2';
	$('input:radio[name="googleChoice"]').change(function() {
		google_earth_flag= $('input:radio[name="googleChoice"]:checked').val();
	});
	if (google_earth_flag=="0") {	//google map
			google_map1_url="https://www.google.co.jp/maps/@"+viewpoint.latitude+","+String(parseFloat(viewpoint.longitude)-parseFloat(viewpoint.parallax)/2.0).toString()+","+viewpoint.altitude+"a,35y,"+viewpoint.azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0).toString()+"t,"+viewpoint.inclination+"r/data=!3m1!1e3";
			google_map2_url="https://www.google.co.jp/maps/@"+viewpoint.latitude+","+String(parseFloat(viewpoint.longitude)+parseFloat(viewpoint.parallax)/2.0).toString()+","+viewpoint.altitude+"a,35y,"+viewpoint.azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0).toString()+"t,"+viewpoint.inclination+"r/data=!3m1!1e3";
		} else {					//google earth
			google_map1_url="https://earth.google.com/web/@"+viewpoint.latitude+","+String(parseFloat(viewpoint.longitude)-parseFloat(viewpoint.parallax)/2.0).toString()+","+viewpoint.altitude+"a,35y,"+viewpoint.azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0)+"t,"+viewpoint.inclination+"r?hl=ja";
			google_map2_url="https://earth.google.com/web/@"+viewpoint.latitude+","+String(parseFloat(viewpoint.longitude)+parseFloat(viewpoint.parallax)/2.0).toString()+","+viewpoint.altitude+"a,35y,"+viewpoint.azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0).toString()+"t,"+viewpoint.inclination+"r?hl=ja";
	}
	google_map_open(google_map1_url,windowname1,'width=450,height=500');
	google_map_open(google_map2_url,windowname2,'left=458,width=450,height=500');
}
//google map　popup windowの表示
function google_map_open(url, windowName, windowFeatures) {
	sub_map=open(url, windowName, windowFeatures);
	retun=sub_map;
}
//内部地図タイル使用
function click_innertiles() {
	script0 = document.createElement("script");
	script0.src = "./../js/jquery-3.4.1.slim.min.js";
	head[0].appendChild(script0);
	script1 = document.createElement("script");
	script1.src = "./../js/JapanGSITerrainProvider_inner.js";
	head = document.getElementsByTagName("head");
	head[0].appendChild(script1);
	script2 = document.createElement("script");
	script2.src = "./../js/gsiglobe_inner.js";
	head[0].appendChild(script2);
}