//	stereoscope.js								2019. 6.20. coded by K. RYOKI
//														2025. 2.16. improved
//														2025.11.13. improved
//
var sT_id;
var value;
var detail_set_activity=0;			//詳細非設定指定
var url_indication_activity=0;		//瞳孔点非設定指定
var point_indication_activity=0;	//固視点非設定指定
var mouseLocation=0;				//0:mouseExit, 1:mouseEnter
var rewriteMethodText1Status=1;
var rewriteMethodText2Status=0;
var rewriteMethodText3Status=0;
var rewriteMethodText4Status=0;
var rewriteMethodText1='dblclick';
var rewriteMethodText2='mouseleave';
var rewriteMethodText3='keydown';
var rewriteMethodText4='mouseup';
var rewriteMethodEvent=rewriteMethodText1;
var rewriteMethodText=rewriteMethodEvent;
//初期の視点位置URL
var param = location.search.substring(1);					// URLパラメータ文字列(?以降)を取得する
var url_hash = location.hash;											// URLパラメータ文字列のアンカー（#以降の部分）を取得
var setting_url=param+url_hash;
var settingURL;
if (setting_url.slice(0,4)=="http") {
	settingURL=new URL(setting_url);
}
var url_default='http://localhost/gsimaps-globe-gh-pages/globe/index_globe.html#3000000/36/140/10/0/-90/0/&base=ort&ls=ort&disp=1&lcd=pale';
var others_default='http://localhost/StereoscopicViewer/img/Calcite_vesta.mp4';
var url_init=url_default;
if (setting_url.indexOf("index_globe.html")>=0) {	//パラメータがglobeの場合
	url_init=setting_url;
}
var URL_init=new URL(url_init);
var others = {	flag:0,
	url:others_default,
	previous_url:url_init
};
var recovery_url_1;
var last_url_0=url_init;
var last_url_1=others_default;
var last_parallax=0;
var last_increments_longitude=0.1;
var last_increments_latitude=0.1;
var url_origin=URL_init.origin;										//視点位置URLのオリジン
var url_pathname=URL_init.pathname;								//視点位置URLのパス
var URL_hash=URL_init.hash.replace("#", "");			//ハッシュデータの分解
var viewpoint_=URL_hash.split('/');								//「/(ダッシュ)」で区切って分割する
var viewpoint1_;
var viewpoint2_;
//視差のパラメータを取得
var viewpoint_parallax;
var map_parameter=viewpoint_[7];	//地理院地図Globeのパラメータ+この後に「&視差の値(km)のパラメータ」で指定
var globe_param=map_parameter.split('&');
var param_parallax=globe_param[globe_param.length-1];
var viewpoint = {																	//初期値定義
	altitude: viewpoint_[0],												//高度
	latitude: viewpoint_[1],												//緯度(°)
	longitude: viewpoint_[2],												//経度(°)
	emphasis: viewpoint_[3],												//高さ強調率
	azimuth: viewpoint_[4],													//方位角(°)
	elevation: viewpoint_[5],												//仰角(°)
	inclination: viewpoint_[6],												//傾斜角(°)
	map_parameter: viewpoint_[7],											//詳細指定
	parallax: -0.5,															//視差(km)
	increments_latitude:0.1,												//Δ↑↓(°)
	increments_longitude:0.1												//Δ←→(°)
};
if (param_parallax.startsWith('parallax=')==true) {			//視差パラメータが有れば
		viewpoint_parallax=param_parallax.replace('parallax=','');
	} else {																						//視差パラメータが無ければ
		viewpoint_parallax=-50.0/3000000.0*viewpoint_[0];		//デフォルト値 (自動計算[交差法])
}
if ((viewpoint_parallax==0)||(viewpoint_parallax==null)) {	//視差パラメータが0または無ければ
	viewpoint_parallax=$('#parallax').val(-50.0/3000000.0*viewpoint_[0]);	//デフォルト値 (自動計算[交差法])
}
viewpoint1_=viewpoint_;
viewpoint2_=viewpoint_;
viewpoint.parallax=viewpoint_parallax;											//視差(km)
var increment;
var googlemap_lati;
var googlemap_longi;
var url;
var url_source2;
var url_source3;
var url_indication_flag=1;
var point_list_flag=1;
var sub_map1="Windows1";
var sub_map2="Windows2";
var window_status1;
var window_status2;
var iframe01_detached='';
var iframe02_detached='';
var iframe11_detached='';
var iframe12_detached='';
var dmsformat=0;
var prec=4;

// GRS80：測地基準系1980楕円体の定数
//var ecc2=0.006694380022903415749574948586289306212443890;
//var ecc=sqrt(ecc2);						//GRS80 離心率：0.081 819 191 042 815 790
//var a=6378137;							//回転楕円体長半径 [m]

function set_interval(){
	interval = document.getElementById("time_interval").value;
}

//event4用 2024.12.27.付加
const moveElm0 = $("#container");
const moveElm1 = $("#iframe01");
const moveElm2 = $("#iframe02");
var timeInterval= document.getElementById("time_interval");
let loopCount = 0;
var interval;
let lastSrc;
let currentSrc;

//HTML書き換え用
var section_0_html='<span id="main_url"><span id="view_index">作成元図</span><span id="title_url_0"><input type="text" class="url" id="url_0" size="10" onchange="url_rewrite(0)"/><br><input type="button" class="button1" id="detail" onclick="detail_set()" value="詳細設定" />  <input type="button" class="button1" id="url_indication" onclick="url_text()" value="瞳孔点表示" />  <input type="button" class="button1" id="point_indication" onclick="point_list()" value="固視点表示" />\n</span><p id="p_blue_color"><p class="span_value" id="sub_url">左図瞳孔位置<input type="text" class="url" id="url_1" onchange="url_rewrite(1)">\n右図瞳孔位置<input type="text" class="url" id="url_2" onchange="url_rewrite(2)"></p><span id="sub_point" ><form name="angle_units">固視点の計算精度<select name="calc_prec" id="calc_id" onchange="change_angle_unit()" size=1><option value="0" selected> 1m 0.00001d 0.1"</option><option value="1"> 100mm 0.01"</option><option value="2"> 10mm 0.001"</option><option value="3"> 1mm 0.0001"</option><option value="4"> 100um 0.00001"</option><option value="5"> 10um 0.000001"</option><option value="6"> 1um 0.0000001"</option><option value="7"> 100nm 0.00000001"</option><option value="8"> 10nm 0.000000001"</option><option value="9"> 1nm 0.0000000001"</option></select>&emsp;&emsp;固視点の地表投影点での緯度,経度,方位角(deg),各瞳孔位置からそれぞれの図中心点までの測地距離(m) : <span id="angles_vmp"></form></span></p></span>';
var section_1_html='<span id="main_url">表示対象<nobr id="title_url_0"><input type="text" class="url" id="url_0" size="10" onchange="url_rewrite(0)"> </nobr></span>';
var p_0_html='<section id="p_0_1"><span class="span_value">&emsp;<input type="button" class="move" id="button_up" onclick="up()" value="↑" >&emsp;瞳孔点&thinsp;&thinsp;&thinsp;高　度<input type="text" class="input_value" id="altitude" onchange="altitude()">(m)&emsp;&emsp;緯　度<input type="text" class="input_value" id="latitude" onchange="latitude()">(deg)&emsp; 経　度<input type="text" class="input_value" id="longitude" onchange="longitude()">(deg)&emsp; 	<!--<input type="checkbox" checked id="auto_parallax" name="autoParallax" class="check0" onclick="check_parallax()" value="autoParallax" >--><input type="checkbox" id="auto_parallax" name="autoParallax" class="check0" onclick="check_parallax()" value="autoParallax" ><label for="auto_parallax">視差指定 </label></input><span id="show_parallax" hidden ><input type="text" class="input_value" id="parallax" onchange="parallax()">(km, <small><small>正：平行法</small></small>)</span>	</span></section><section id="p_0_2"><span class="span_value"><input type="button" class="move" id="button_left" onclick="left()" value="←" > <input type="button" class="move" id="button_right" onclick="right()" value="→" > </span><span class="span_value">&emsp;高度強調率<input type="text" class="input_value" id="emphasis" onchange="emphasis()">&emsp;&emsp;&emsp;&emsp;方位角<input type="text" class="input_value" id="azimuth" onchange="azimuth()">(deg)&emsp; 仰　角<input type="text" class="input_value" id="elevation" onchange="elevation()">(deg)&emsp; 傾斜角<input type="text" class="input_value" id="inclination" onchange="inclination()">(deg) </span><br><span class="span_value"><span class="span_value">  &emsp;<input type="button" class="move" id="button_down" onclick="down()" value="↓" ></span><span class="span_value">&emsp;&emsp;&emsp;Δ↑↓<input type="text" class="input_value" id="increments_latitude" onchange="increments_latitude()">(deg)&thinsp;&thinsp;&thinsp;&emsp;&emsp;&emsp;Δ←→<input type="text" class="input_value" id="increments_longitude" onchange="increments_longitude()">(deg)　  <input type="button" class="button" id="button_drow" onclick="url_rewrite(0)" value="再描画">  <input type="button" class="button" id="google_map" onclick="open_GoogleMap()" value="google map">  <input type="button" class="button" id="google_earth" onclick="open_GoogleEarth()" value="google earth">  <input type="button" class="button" id="button_others" onclick="click_others()" value="others">  <input type="number" id="input_rotate" name="tentacles" min="-180" max="180" value="0" onchange="rotation()"><br></span></section><span id="p_0_4">地図更新方法：<input type="checkbox" id="rewriteMethod1" name="rewriteMethod" class="check" value="dblclick" checked><label for="rewriteMethod1" class="check" >Double Click </label></input><input type="checkbox" id="rewriteMethod2" name="rewriteMethod" class="check" value="mouseleave"><label for="rewriteMethod2" class="check" >Mouse Leave </label></input><input type="checkbox" id="rewriteMethod3" name="rewriteMethod" class="check" value="keydown"><label for="rewriteMethod3" class="check">Shift-Key </label></input><input type="checkbox" id="rewriteMethod4" name="rewriteMethod" class="check" value="mouseup" onchange="mouseMoved()"><label for="rewriteMethod4" class="check">Left Map Moved </label><span id="show_timeInterval" > [interval <input type="number" class="input_value" id="time_interval" min="10" max="5000" value="3000" step="10" onchange="set_interval()" style="width:50px">&nbsp;(msec)]	</input></span></input></span>';
//var p_0_light_html='<section><span class="span_value">&emsp;瞳孔点&thinsp;&thinsp;&thinsp;視　差<input type="text" class="input_value" id="parallax_light" onchange="parallax()">(km, <small><small>正：平行法</small></small>) </span><br>';
var p_1_html='<section id="p_1"><input type="button" class="button" id="button_drow" onclick="url_rewrite(0)" value="再描画">  <input type="button" class="button" id="button_others" onclick="click_others()" value="others"> 　傾斜(deg)&thinsp;<input type="number" id="input_rotate" name="tentacles" min="-180" max="180" value="0" onchange="rotation()">&thinsp;<input type="button" class="button" id="button_innertiles" onclick="click_innertiles()" value="innertiles"> <input type="button" class="button" id="button_innervideo" onclick="video_viewer()" value="SVd(NewTab)"></section>';
var iframe01_html='<iframe class="iframe" id="iframe01" title="Inline Frame Left" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'"></iframe>';
var iframe02_html='<iframe class="iframe" id="iframe02" title="Inline Frame Right" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'" muted></iframe>';
var iframe11_html='<iframe class="iframe" id="iframe11" title="Inline Frame Left" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'"></iframe>';
var iframe12_html='<iframe class="iframe" id="iframe12" title="Inline Frame Right" width=49% sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation" allow="fullscreen \'none\'" muted></iframe>';
//HTMLフォーム読み込み後に実行
jQuery(function() {
	$('#section_0').html(section_0_html);
	$('#p_0').html(p_0_html);
	$('#p_iframe1').html(iframe01_html);
	$('#p_iframe2').html(iframe02_html);
	$('#button_innertiles').css('visibility','hidden');	//内部タイル使用完成時に消す
	$('#sub_url').hide();
	$('#sub_point').hide();
	$('#iframe01').on('load', function() {
		event_act();
	})
	detail_set();
	// 子フレームのイベント
	//表示初期値
	$('#altitude').val(viewpoint.altitude);							//高度
	$('#latitude').val(viewpoint.latitude);							//緯度(°)
	$('#longitude').val(viewpoint.longitude);						//経度(°)
	$('#emphasis').val(viewpoint.emphasis);							//高さ強調率
	$('#azimuth').val(viewpoint.azimuth);							//方位角(°)
	$('#elevation').val(viewpoint.elevation);						//仰角(°)
	$('#inclination').val(viewpoint.inclination);					//傾斜角(°)
	$('#parallax').val(calc_parallax());							//視差(km)
	$('#increments_latitude').val(viewpoint.increments_latitude);	//Δ↑↓(°)
	$('#increments_longitude').val(viewpoint.increments_longitude);	//Δ←→(°)
	//視点位置URL
	$('#url_0').val(make_url_0());									//視点位置URL作成
	set_view_url(0,viewpoint_,viewpoint.parallax);
	$('#iframe01').attr('src',"");									//左図消去
	$('#show_timeInterval').css('visibility','hidden');				//Left Map Movedのintervalを隠しておく
	iframes_change();
	define_event();
	if ((setting_url=="") || (setting_url.indexOf("index_globe.html")>=0)) { 	//パラメータがない，または，globeの場合
			others.flag=0;
			others.url=others_default;
			calc_parallax();
		} else {
			others.flag=0;
			others.url=setting_url;
			click_others();
	}
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
				rewriteMethodText3=rewriteMethod3.value+' ';
			} else {
				rewriteMethodText3Status=0;
				rewriteMethodText3='';
		}
		// もしrewriteMethod4がチェック状態だったら
		if ($(rewriteMethod4).prop('checked')) {
				rewriteMethodText4Status=1;
				rewriteMethodText4=rewriteMethod4.value;
			} else {
				rewriteMethodText4Status=0;
				rewriteMethodText4='';
		}
		rewriteMethodEvent=rewriteMethodText1+rewriteMethodText2+rewriteMethodText3+rewriteMethodText4;
		rewriteMethodText=rewriteMethodText1+rewriteMethodText2+rewriteMethodText3+rewriteMethodText4;
		event_act();
	})
})
//イベントの定義
function define_event() {
	// 子フレームへ入った際のイベント
	$('#iframe01').on('mouseenter', function () {
		mouseLocation=1;							//mouseEnter;
	});
	// 子フレームから出た際のイベント
	$('#iframe01').on('mouseleave', function () {
		mouseLocation=0;							//mouseExit;
	});

	// Shiftキー(keyCode 16)を押したときのイベント
	$(document).on('keydown',function(){	
		if (event.keyCode===16 && rewriteMethodText3Status==1){
			if (mouseLocation==1){
				iframes_redisplay01();
			}
		}
	});
}
//図の更新トリガ
function event_act() {
	$('#header').contents().off();
	$('#header').contents().on('dblclick', iframes_redisplay01);
	$('#iframe01').contents().off();
	$('#iframe01').contents().on(rewriteMethodEvent, iframes_redisplay01);
	$('#iframe02').contents().off();
	$('#iframe02').contents().on('dblclick', iframes_redisplay02);
}
//TextBoxの内容表示更新
function box_change() {
	$('#altitude').val(viewpoint.altitude);					//高度
	$('#latitude').val(viewpoint.latitude);					//緯度(°)
	$('#longitude').val(viewpoint.longitude);				//経度(°)
	$('#parallax').val(viewpoint.parallax);					//視差(km)
	$('#emphasis').val(viewpoint.emphasis);					//高さ強調率
	$('#azimuth').val(viewpoint.azimuth);					//方位角(°)
	$('#elevation').val(viewpoint.elevation);				//仰角(°)
	$('#inclination').val(viewpoint.inclination);			//傾斜角(°)
}
//視点位置項目の変更
function url_change(input_url){
	p_url=new URL(input_url);
	url_origin=p_url.origin;
	url_pathname=p_url.pathname;
	viewpoint_hash=p_url.hash.replace("#", "");
	viewpoint_=viewpoint_hash.split('/');						//「/(ダッシュ)」で区切って分割する
	viewpoint_[0]=viewpoint.altitude;								//高度
	viewpoint_[1]=viewpoint.latitude;								//緯度(°)
	viewpoint_[2]=viewpoint.longitude;							//経度(°)
	viewpoint_[3]=viewpoint.emphasis;								//高さ強調率
	viewpoint_[4]=viewpoint.azimuth;								//方位角(°)
	viewpoint_[5]=viewpoint.elevation;							//仰角(°)
	viewpoint_[6]=viewpoint.inclination;						//傾斜角(°)
	$('#url_0').val(make_url_0());									//視点位置URL作成
	set_view_url(0,viewpoint_,viewpoint.parallax);
}
//再描画
function url_rewrite(url_number) {								//url_number=0:viewpoint, =1:left, =2:right
	switch (url_number) {
		case 0:		//viewpoint　[視点ＵＲＬ入力時]
			if (others.flag==1) {	//動画の場合
				disp_url=decodeURI($('#url_0').val());
				if (disp_url.startsWith('<iframe')){			//YouTubeの埋め込み
					disp_url_float1=disp_url.replace('<iframe','<iframe id="iframe11" style="float: left; "');
					disp_url_float1=disp_url_float1.replace('allowfullscreen>','>');
					dqm = 10;
					disp_url_float1= disp_url_float1.replace(/"/g, function(match){ if(--dqm==0) return '?autoplay=1&mute=1"'; else return match; });
					disp_url_float2=disp_url_float1.replace('iframe11','iframe12');
					$('#p_iframe1').html(disp_url_float1);
						$('#p_iframe2').html(disp_url_float2);
				} else {																	//mp4などの映像の表示
					$('#p_iframe1').html(iframe01_html);
					$('#p_iframe2').html(iframe02_html);
					$('#iframe01').attr('src',disp_url);		//左図再描画
					$('#iframe02').attr('src',disp_url);		//右図再描画
				}
			} else {							//Globeの場合
				if($('#iframe11').length){								//#iframe11が存在するとき
					iframe11_detached=$('#iframe11').detach();
					iframe12_detached=$('#iframe12').detach();
					$('#p_iframe1').html(iframe01_html);
					$('#p_iframe2').html(iframe02_html);
				}
				if (iframe01_detached!='') {							//かつて#iframe01が存在していた場合
						$('#iframe01').replaceWith(iframe01_detached);
						$('#iframe02').replaceWith(iframe02_detached);
					} else {
						$('#p_iframe1').html(iframe01_html);
						$('#p_iframe2').html(iframe02_html);
				}
				viewpoint_=change_viewpoint($('#url_0').val());
				event_act();
				set_view_url(url_number,viewpoint_,viewpoint.parallax);	//緯度・経度を変えて両図URL作成
				iframes_change();													//再描画
			}
		break;
		case 1:		//left　[左図ＵＲＬ入力時]
			iframes_redisplay01();
			$('#url_0').val(make_url_0());
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
			if (rewriteMethodText3Status==1) {					// もしrewriteMethod3がチェック状態だったら
					$('#rewriteMethod3').prop('checked', true);
				} else {
					$('#rewriteMethod3').prop('checked', false);
			}
		break;
		case 2:		//right　[右図ＵＲＬ入力時]
			iframes_redisplay02();
			$('#url_0').val(set_view_url(0,$('#url_2').val(),$('#parallax').val));
			$('#url_1').val(set_view_url(1,$('#url_2').val(),$('#parallax').val));
		break;
	}
	box_change();
	event_act();
}

//視点変更
function change_viewpoint(Previous_url) {					//視点位置変更時の各要素表示，戻り値=各要素の配列
	var p_url=new URL(Previous_url);
	var viewpoint_hash_p_url=p_url.hash.replace("#", "");	//ハッシュデータの分解
	var viewpoint_p_url=viewpoint_hash_p_url.split('/');	//「/(ダッシュ)」で区切って分割する
	//視点位置設定
	viewpoint.altitude=viewpoint_p_url[0];					//高度
	viewpoint.latitude=viewpoint_p_url[1];					//緯度(°)
	viewpoint.longitude=viewpoint_p_url[2];					//緯度(°)
	viewpoint.emphasis=viewpoint_p_url[3];					//高さ強調率
	viewpoint.azimuth=viewpoint_p_url[4];					//方位角(°)
	viewpoint.elevation=viewpoint_p_url[5];					//仰角(°)
	viewpoint.inclination=viewpoint_p_url[6];				//傾斜角(°)
	return viewpoint_p_url;
}
//URL合成
function make_url_0() {
	var result_url = url_origin+url_pathname+"#"+viewpoint_.join('/');	//「/(ダッシュ)」で連結する
	return result_url;
}
//図変更準備および描画
function iframes_change(){
	$('#iframe01').attr('src',"");									//左図消去
	$('#iframe02').attr('src',"");									//右図消去
	window.setTimeout("$('#iframe01').attr('src',$('#url_1').val())", 50);	//左図再描画
	window.setTimeout("$('#iframe02').attr('src',$('#url_2').val())", 50);	//右図再描画
	var s12=$('#altitude').val()/Math.tan(-$('#elevation').val()/180*Math.PI);
	angles_vmp_rewrite(s12);
}
//視点高度 変更
function altitude() {
	value=$('#altitude').val();
	viewpoint.altitude=value;
	if ($('#auto_parallax').prop('checked')==false) {
		calc_parallax();
	}
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
//視差指定　選択
function check_parallax() {
	if ($('#auto_parallax').prop('checked')==true) {
			//視差を入力指定するとき
			$('#show_parallax').show();
		} else {
			//視差を自動計算するとき
			$('#show_parallax').hide();
			calc_parallax();
			parallax();
	}
}
//視差指定
function calc_parallax() {
	$('#parallax').val(-50.0/3000000.0*viewpoint_[0]);
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
	url_0_value=make_url_0();
	$('#url_0').val(url_0_value);
	url_change(url_0_value);
	event_act();
}
//表示切替
function click_others() {
	if (others.flag==0) {
			last_url_0=$('#url_0').val();
		} else {
			last_url_1=$('#url_0').val();
	}
	if (others.flag==0) {											//動画等表示
			if (last_url_0=="") {
				last_url_0=url_default;
			}
			last_parallax=$('#parallax').val();
			last_increments_latitude=$('#increments_latitude').val();
			last_increments_longitude=$('#increments_longitude').val();
			$('#section_0').html(section_1_html);
			$('#p_0').html(p_1_html);
			$('#button_innertiles').css('visibility','hidden');
			$('#input_rotate').css('visibility','visible');
			$('#button_others').val("GIS Globe");
			if (last_url_1==!"") {
					$('#url_0').val(last_url_1);
				} else {
					if(setting_url.indexOf("index_globe.html")==1) {
							$('#url_0').val(setting_url);
						} else {
							$('#url_0').val(others.url);
					}
			}
			iframe01_detached=$('#iframe01').detach();
			iframe02_detached=$('#iframe02').detach();
			$('#p_iframe1').html(iframe11_html);
			$('#p_iframe2').html(iframe12_html);
			if (iframe11_detached!='') {								//以前の#iframe11があれば表示
				$('#iframe11').replaceWith(iframe11_detached);
				$('#iframe12').replaceWith(iframe12_detached);
			}
			others.flag=1;
		} else {
			last_url_1=$('#url_0').val();
			$('#section_0').html(section_0_html);
			$('#p_0').html(p_0_html);
			$('#button_innertiles').css('visibility','hidden');
			$('#sub_url').hide();
			$('#input_rotate').css('visibility','hidden');
			$('#input_rotate').val(0);
			$('iframe').css('transform', 'rotate(0deg)');
			viewpoint_[2]=viewpoint.longitude;
			$('#url_0').val(others.url);
			$('#parallax').val(last_parallax);
			$('#increments_latitude').val(last_increments_latitude);
			$('#increments_longitude').val(last_increments_longitude);
			iframe11_detached=$('#iframe11').detach();
			iframe12_detached=$('#iframe12').detach();
			$('#p_iframe1').html(iframe01_html);
			$('#p_iframe2').html(iframe02_html);
			$('#iframe01').replaceWith(iframe01_detached);
			$('#iframe02').replaceWith(iframe02_detached);
			$('#url_0').val(last_url_0);
			others.flag=0;
	}
	url_rewrite(0);
}
//左図を基に右図を描画
function iframes_redisplay01() {
	const text1=document.getElementById('iframe01').contentDocument.location.href;
	var text1_url=new URL(encodeURI(text1));
	$("#url_1").val(text1);
	var url_1_hash = text1_url.hash;								// URLパラメータ文字列のアンカー（#以降の部分）を取得
	viewpoint1_=url_1_hash.replace("#", "").split('/');				//「/(ダッシュ)」で区切って分割する
	if ($('#auto_parallax').prop('checked')==false) {
		calc_parallax();
		viewpoint.parallax=$('#parallax').val();
	}
	set_view_url(1,viewpoint1_,viewpoint.parallax);
}
//右図を基に左図を描画
function iframes_redisplay02() {
	const text2=document.getElementById('iframe02').contentDocument.location.href;
	var text2_url=new URL(encodeURI(text2));
	$("#url_2").val(text2);
	var url_2_hash = text2_url.hash;								// URLパラメータ文字列のアンカー（#以降の部分）を取得
	viewpoint2_=url_2_hash.replace("#", "").split('/');				//「/(ダッシュ)」で区切って分割する
	set_view_url(2,viewpoint2_,viewpoint.parallax);
}
//瞳孔点表示
function url_text() {
	if (url_indication_flag==0) {										//url_1,url_2を表示しない場合
			$('#url_indication').val("瞳孔点表示");
			$('#sub_url').hide();
			url_indication_flag=1;
		} else {														//url_1,url_2を表示する場合
			$('#url_indication').val("瞳孔点非表示");
			$('#sub_url').show();
			url_indication_flag=0;
	}
}
//Left Map Movedをチェックした場合
function mouseMoved() {
	let element = document.getElementById('rewriteMethod4');
	if (element.checked===true) {										//左図の移動を検出する場合
			$('#show_timeInterval').css('visibility','visible');
			check4Start($("#url_1").val());
		} else {														//左図の移動を検出しない場合
			$('#show_timeInterval').css('visibility','hidden');
			check4End($('iframe01').attr('src'));
	}
}
//othersでのiframe回転
function rotation() {
	angle = $("#input_rotate").val();
	$('iframe').css('transform', 'rotate('+angle+'deg)');
	$('#counter').css('transform', 'rotate(0deg)');
	$('#counter').css('transform', 'rotate(0deg)');
}
//StereoscopicVideoの呼び出し
function video_viewer() {
	window.open("./stereoscopic_video4iframe.html","_blank");
return false;
}
//google mapの表示
function open_GoogleMap() {
	var google_map_azimuth=viewpoint.azimuth;
	if (google_map_azimuth>=360) {
		google_map_azimuth=google_map_azimuth-360;
	}
	set_google_lati_longi(1);
	google_map1_url="https://www.google.co.jp/maps/@"+String(googlemap_lati)+","+String(googlemap_longi)+","+viewpoint.altitude+"a,35y,"+google_map_azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0)+"t,"+viewpoint.inclination+"r/data=!3m1!1e3";
	set_google_lati_longi(2);
	google_map2_url="https://www.google.co.jp/maps/@"+String(googlemap_lati)+","+String(googlemap_longi)+","+viewpoint.altitude+"a,35y,"+google_map_azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0)+"t,"+viewpoint.inclination+"r/data=!3m1!1e3";
	window_status1=window.open(google_map1_url,sub_map1,'width=450,height=500');
	window_status2=window.open(google_map2_url,sub_map2,'left=458,width=450,height=500');
}
//google earthの表示
function open_GoogleEarth() {
	var google_map_azimuth=viewpoint.azimuth;
	if (google_map_azimuth>=360) {
		google_map_azimuth=google_map_azimuth-360;
	}
	set_google_lati_longi(1);
	google_map1_url="https://earth.google.com/web/@"+String(googlemap_lati)+","+String(googlemap_longi)+","+viewpoint.altitude+"a,35y,"+google_map_azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0)+"t,"+viewpoint.inclination+"r?hl=ja";
	set_google_lati_longi(2);
	google_map2_url="https://earth.google.com/web/@"+String(googlemap_lati)+","+String(googlemap_longi)+","+viewpoint.altitude+"a,35y,"+google_map_azimuth+"h,"+String(parseFloat(viewpoint.elevation)+90.0).toString()+"t,"+viewpoint.inclination+"r?hl=ja";
	window_status1=window.open(google_map1_url,sub_map1,'width=450,height=500');
	window_status2=window.open(google_map2_url,sub_map2,'left=458,width=450,height=500');
}
//url_0の緯度lati（度）,経度long（度）と視差(km)から, url_1,url_2の緯度・経度を計算 (google map用)
//	註： google mapの測地系は「世界測地系 WGS84」なので，厳密な位置関係にはなっていない
function set_google_lati_longi(url_number) {
	var lati=$('#latitude').val();
	var longi=$('#longitude').val();
	var parallax_length=$('#parallax').val();
	var distance;
	var azimuth=$('#azimuth').val();
	googlemap_lati=0;
	googlemap_longi=0;
	switch (url_number) {
		case 1:																	//viewpoint1　[視点URL入力時]
			distance=-parallax_length*500;										//	左図視点作成
		break;
		case 2:																	//viewpoint2　[視点URL入力時]
			distance=+parallax_length*500;										//	右図視点作成
		break;
	}
	googlemap_lati=ido(lati,longi,distance,parseFloat(azimuth)+90);		//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
	googlemap_longi=keido(lati,longi,distance,parseFloat(azimuth)+90);	//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
}
function set_googlemap_type() {
	$('#google_map').prop('disabled', false);
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
//URLパラメータの抽出
function url_param(keyname, target_url) {
    if (!target_url) target_url = window.location.href;
    keyname = keyname.replace(/[\[\]]/g, "\$&");
    var regex = new RegExp("[?&]" + keyname + "(=([^&#]*)|&|#|$)");
        results = regex.exec(target_url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//視点URLの作成
function set_view_url(url_number,url_source,parallax_length) {	//視点No., 元のURL, 視差(km)
var url_set;
	url_source2=url_source[1];											//視点位置の緯度・経度を保存
	url_source3=url_source[2];
	switch (url_number) {
		case 0:													//viewpoint　[視点URL入力時]
			increment=parallax_length*500;							//左図視点作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_1').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
			increment=+parallax_length*500;							//右図視点作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4]))+90.0);
				//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4]))+90.0);
				//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_2').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
		break;
		case 1:													//left　     [左図URL入力時]
			increment=-parallax_length*500;							//視点URL作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_0').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
			increment=-parallax_length*1000;						//右図視点作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4])-90.0));
				//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4])-90.0));
				//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_2').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
		break;
		case 2:													//right    　[右図URL入力時]
			increment=+parallax_length*500;							//視点URL作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_0').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
			increment=+parallax_length*1000;						//左図視点作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4]))-90.0);
				//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_1').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
		break;
	}
	change_viewpoint($('#url_0').val());
	box_change();
	iframes_change();
}
function point_list() {
	if (point_list_flag==0) {										//図中の固視点心位置を表示しない場合
			$('#point_indication').val("固視点表示");
			$('#sub_point').css('display','none');
			point_list_flag=1;
		} else {													//図中の固視点心位置を表示する場合
			$('#point_indication').val("固視点非表示");
			$('#sub_point').css('display','inline');
			point_list_flag=0;
			change_angle_unit();
	}
}
function change_angle_unit() {
	var elev1=$('#elevation').val();
	var s12;
	if (elev1==0) {
			s12=0;
		} else {
			s12=$('#altitude').val()/Math.tan(-elev1/180*Math.PI);
	}
	angles_vmp_rewrite(s12);
}
function angles_vmp_rewrite(s12) {
	var set_vmp;
	set_vmp=$("#latitude").val()+" "+$("#longitude").val()+" "+$("#azimuth").val()+" "+s12;
	dmsformat=0;													//角度単位:(deg)
	const accuracy = document.angle_units.calc_prec;
	// 値(数値)を取得
	const num = accuracy.selectedIndex;
	// 値(数値)から値(value値)を取得
	const str = accuracy.options[num].value;
	prec=str;
	var t = GeodesicDirect(set_vmp,dmsformat,prec);
	const t_p2_elements = t.p2.split(' ');
	const t_p2_result=t_p2_elements[0]+", "+t_p2_elements[1]+", "+t_p2_elements[2]+", "+t.s12;
	$("#angles_vmp").html(t_p2_result);
}
function detail_set() {
	if (detail_set_activity==1) {
			$('#p_0_1').show();
			$('#p_0_2').show();
			$('#p_1').show();
			$('#url_indication').show();
			$('#point_indication').show();
			$('#button_down').show();
			$('#detail').val("詳細非設定");
			detail_set_activity=0;
			url_indication_flag=0;
			point_list_flag=0;
			url_text();
			point_list();
		} else {
			$('#p_0_1').hide();
			$('#p_0_2').hide();
			$('#p_1').hide();
			$('#url_indication').hide();
			$('#point_indication').hide();
			$('#button_down').hide();
			$('#detail').val("詳細設定");
			detail_set_activity=1;
			url_indication_flag=0;
			point_list_flag=0;
			url_text();
			point_list();
	}
}
function check4Start(currentSrc){	//610行から呼び出されている　2024.12．27.14:32
	loopCount = 1;
	check4Loop(currentSrc);
}
async function check4Loop(currentSrc){
	interval = document.getElementById("time_interval").value;
	while (rewriteMethodText4Status = 1) {
		await new Promise(resolve => sT_id=setTimeout(resolve, interval));
		currentSrc=document.getElementById('iframe01').contentDocument.location.href;
		if (currentSrc !== lastSrc){
			iframes_redisplay01();
			lastSrc=currentSrc;
		}
	}
}
function check4End(){
	clearTimeout(sT_id);
}
//
//======================================================
//Published subroutines, which　referenced in this sprict
//======================================================
//
/*
Karney, Charles F. F. (2022-05-02): "Geodesic calculations for an ellipsoid done right" ver. 2.0.0., https://geographiclib.sourceforge.io/scripts/geod-calc.html の変数
t.status;
t.p1;				//lat1 lon1 azi1：始点Aでの地理的緯度φ1(楕円体の法線と赤道面の間の角度)，経度λ1，前方方位角α1
t.p2;				//lat2 lon2 azi2：終点Bでの地理的緯度φ2，経度λ2，前方方位角α2
t.s12;			//s12：始点Aから見た終点Bへの測地線長
t.a12;			//a12：地芯における始点Aから見た終点Bのなす角
t.m12;			//m12：始点Aにおける方位角α1(=lat1[ラジアン])がdα1だけ摂動するとき、終点Bが測地線に垂直な方向に
						//　　m12･dα1だけ移動するとして定義される測地線の短縮長(メートル単位)。
						//　　曲面では、短縮長は対称関係m12+m21=0を満たす。平面では、m12=s12となる。
t.M1221;		//M12　M21：測地線スケール。2つの測地線が点1で平行で、小さな距離dtだけ離れている場合、それらは点2で距離M12･dtだけ離れる。
						//　　M21も同様に定義される(測地線は点2で互いに平行)。 M12とM21は無次元量。平らな面では、M12=M21=1となる。
d/t.S12;		//始点Aから終点Bまでの測地線と赤道の間の領域：反時計回りに測定された角(φ1,λ1),(0,λ1),(0,λ2),(φ2,λ2)が成す四角曲面の面積。

(reference)
Karney, Charles F. F. (2013): Algorithms for geodesics, J. Geodesy 87(1), 43–55 (Jan. 2013); DOI: 10.1007/s00190-012-0578-z (pdf).
The MIT License (MIT).


Copyright (c) 2011-2022, Charles Karney
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/
function ido(lat1, lon1, s12, azi_add_90) {
	const input=lat1+" "+lon1+" "+parseFloat(azi_add_90)+" "+s12;
	const point=GeodesicDirect(input, dmsformat, prec);
	const latlon=point.p2.split(' ');
	return latlon[0];
}
function keido(lat1, lon1, s12, azi_add_90) {
	const input=lat1+" "+lon1+" "+parseFloat(azi_add_90)+" "+s12;
	const point=GeodesicDirect(input, dmsformat, prec);
	const latlon=point.p2.split(' ');
	return latlon[1];
}

//======================================================
//The following, quoted
//reference
//	Karney (2022):Geodesic calculations for an ellipsoid done right,  
//	 https://geographiclib.sourceforge.io/scripts/geod-calc.html
//	 (viewed on 2022.1.18.). 

//"use strict";
var g = geodesic.Geodesic,
    geod = g.WGS84,
    dms = DMS;
/*
 * Compute the area of a polygon
 */
g.Geodesic.prototype.Area = function(points, polyline) {
  var poly = this.Polygon(polyline), i;
  for (i = 0; i < points.length; ++i)
    poly.AddPoint(points[i].lat, points[i].lon);
  return poly.Compute(false, true);
}
/*
 * split a geodesic line into k approximately equal pieces which are no
 * longer than about ds12 (but k cannot exceed maxk, default 20), and returns
 * an array of length k + 1 of objects with fields lat, lon, azi.
 */
g.Geodesic.prototype.InversePath =
  function(lat1, lon1, lat2, lon2, ds12, maxk) {
    var line = this.InverseLine(lat1, lon1, lat2, lon2, g.STANDARD),
        k, points, da12, vals, i;
    if (!maxk) maxk = 20;
    if (!(ds12 > 0))
      throw new Error("ds12 must be a positive number");
    k = Math.max(1, Math.min(maxk, Math.ceil(line.s13 / ds12)));
    points = new Array(k + 1);
    da12 = line.a13 / k;
    for (i = 0; i <= k; ++i) {
      vals = line.ArcPosition(i * da12);
      points[i] = {lat: vals.lat2, lon: vals.lon2, azi: vals.azi2};
    }
    return points;
  };
function formatpoint(lat, lon, azi, dmsformat, prec) {
  "use strict";
  var trail;
  prec += 5;
  if (dmsformat) {
    trail = prec < 2 ? dms.DEGREE :
      (prec < 4 ? dms.MINUTE : dms.SECOND);
    prec = prec < 2 ? prec : (prec < 4 ? prec - 2 : prec - 4);
    return (dms.Encode(lat, trail, prec, dms.LATITUDE) + " " +
            dms.Encode(lon, trail, prec, dms.LONGITUDE) + " " +
            dms.Encode(azi, trail, prec, dms.AZIMUTH));
  } else {
    return (lat.toFixed(prec) + " " +
            lon.toFixed(prec) + " " +
            azi.toFixed(prec));
  }
};

function GeodesicInverse(input, dmsformat, prec) {
  "use strict";
  var result = {},
      t, p1, p2;
  try {
    // Input is a blank-delimited line: lat1 lon1 lat2 lon2
    t = input;
    t = t.replace(/^\s+/,"").replace(/\s+$/,"").split(/[\s,]+/,6);
    if (t.length != 4)
      throw new Error("Need 4 input items");
    p1 = dms.DecodeLatLon(t[0], t[1]);
    p2 = dms.DecodeLatLon(t[2], t[3]);
    t = geod.Inverse(p1.lat, p1.lon, p2.lat, p2.lon,
                     g.ALL |
                     g.LONG_UNROLL);
    result.status = "OK";
    result.p1 = formatpoint(t.lat1, t.lon1, t.azi1, dmsformat, prec);
    result.p2 = formatpoint(t.lat2, t.lon2, t.azi2, dmsformat, prec);
    result.s12 = t.s12.toFixed(prec);
    result.a12 = t.a12.toFixed(prec + 5);
    result.m12 = t.m12.toFixed(prec);
    result.M1221 = t.M12.toFixed(prec + 7) + " " + t.M21.toFixed(prec + 6);
    result.S12 = t.S12.toFixed(Math.max(prec - 7, 0));
  }
  catch (e) {
    result.status = "ERROR: " + e.message;
    result.p1 = "";
    result.p2 = "";
    result.s12 = "";
    result.a12 = "";
    result.m12 = "";
    result.M1221 = "";
    result.S12 = "";
  }
  return result;
};
function GeodesicDirect(input, dmsformat, prec) {
  "use strict";
  var result = {},
      t, p1, azi1, s12;
  try {
    // Input is a blank-delimited line: lat1 lon1 azi1 s12
    t = input;
    t = t.replace(/^\s+/,"").replace(/\s+$/,"").split(/[\s,]+/,6);
    if (t.length != 4)
      throw new Error("Need 4 input items");
    p1 = dms.DecodeLatLon(t[0], t[1]);
    azi1 = dms.DecodeAzimuth(t[2]);
    s12 = parseFloat(t[3]);
    t = geod.Direct(p1.lat, p1.lon, azi1, s12,g.ALL | g.LONG_UNROLL);
    result.status = "OK";
    result.p1 = formatpoint(t.lat1, t.lon1, t.azi1, dmsformat, prec);
    result.p2 = formatpoint(t.lat2, t.lon2, t.azi2, dmsformat, prec);
    result.s12 = t.s12.toFixed(prec);
    result.a12 = t.a12.toFixed(prec + 5);
    result.m12 = t.m12.toFixed(prec);
    result.M1221 = t.M12.toFixed(prec + 7) + " " + t.M21.toFixed(prec + 6);
    result.S12 = t.S12.toFixed(Math.max(prec - 7, 0));
  }
  catch (e) {
    result.status = "ERROR: " + e.message;
    result.p1 = "";
    result.p2 = "";
    result.s12 = "";
    result.a12 = "";
    result.m12 = "";
    result.M1221 = "";
    result.S12 = "";
  }
  return result;
};
