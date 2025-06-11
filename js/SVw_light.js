//------------------------------------------------------------------------------
//
// SVw_light.js
//              for 3D test og GIS GLOBE
//              coded by K.Ryoki//
//              2024.10.1.
//
//------------------------------------------------------------------------------

var dmsformat=0;
var prec=4;
var mouseEnter=1;
var mouseExit=0;
var mouseLocation=0;
var rewriteMethodText1Status=1;
var rewriteMethodText2Status=0;
var rewriteMethodText3Status=0;
var rewriteMethodText1='dblclick';
var rewriteMethodText2='';
var rewriteMethodText3='';
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
var url_default='http://localhost/globe/index_globe.html#3000000/36/140/10/0/-90/0/&base=std&ls=std&disp=1&lcd=pale';
var others_default='http://localhost/StereoscopicViewer/img/Calcite_vesta.mp4';
var url_init=url_default;
if (setting_url.indexOf("index_globe.html")>=0) {	//パラメータがglobeの場合
	url_init=setting_url;
}
var URL_init=new URL(url_init);
var others = {
	flag:0,
	url:others_default,
	previous_url:url_init
};
var last_url_0=url_init;
var last_url_1=others_default;
var last_parallax=-50;
var last_increments_longitude=0.01;
var last_increments_latitude=0.01;
var url_origin="localhost";										//視点位置URLのオリジン
var url_pathname=URL_init.pathname;								//視点位置URLのパス
var URL_hash=URL_init.hash.replace("#", "/");			//ハッシュデータの分解
var viewpoint_=URL_hash.split('/');								//「/(ダッシュ)」で区切って分割する
var viewpoint=URL_hash.split('/');								//「/(ダッシュ)」で区切って分割する
var viewpoint1_;
var viewpoint2_;
//視差のパラメータを取得
var viewpoint_parallax;
var map_parameter=viewpoint[7];	//地理院地図Ｇｌｏｂｅのパラメータ+この後に「&視差の値(km)のパラメータ」で指定
var globe_param=map_parameter.split('&');
var param_parallax=globe_param[globe_param.length-1];
//change_angle_unit()" size=1><option value="0"

var element = document.getElementById("iframe01");

var section_0_html='<span id="main_url"><span id="view_index">作成元図</span><span id="title_url_0"><input type="text" class="url" id="url_0" size="10"onchange="url_rewrite(0)"/><input type="button" class="button1" id="url_indication" onclick="url_text()" value="瞳孔点表示" /><input type="button" class="button1" id="point_indication" onclick="point_list()" value="固視点表示" />\n</span><p id="p_blue_color"><p class="span_value" id="sub_url">左図瞳孔位置<input type="text" class="url" id="url_1">\n右図瞳孔位置<input type="text" class="url" id="url_2"></p><span id="sub_point" ><form name="angle_units">&emsp;&emsp;&emsp;&thinsp;&thinsp;固視点の計算精度<select name="calc_prec" id="calc_id" onchange="change_angle_unit()" size=1><option value="0" selected> 1m 0.00001d 0.1"</option><option value="1"> 100mm 0.01"</option><option value="2"> 10mm 0.001"</option><option value="3"> 1mm 0.0001"</option><option value="4"> 100um 0.00001"</option><option value="5"> 10um 0.000001"</option><option value="6"> 1um 0.0000001"</option><option value="7"> 100nm 0.00000001"</option><option value="8"> 10nm 0.000000001"</option><option value="9"> 1nm 0.0000000001"</option></select>&emsp;&emsp;固視点の地表投影点での緯度,経度,方位角(deg),各瞳孔位置からそれぞれの図中心点までの測地距離(m) : <span id="angles_vmp"></form></span></span></p></span>';

/*var section_0_html='<span id="main_url"><span id="view_index">作成元図</span><span id="title_url_0"><input type="text" class="url" id="url_0" size="10"onchange="url_rewrite(0)"/><input type="button" class="button1" id="url_indication" onclick="url_text()" value="瞳孔点表示" />\n</span><p id="p_blue_color"><p class="span_value" id="sub_url">左図瞳孔位置<input type="text" class="url" id="url_1">\n右図瞳孔位置<input type="text" class="url" id="url_2"></p>';
*/
var url_0;
var url_1;
var url_2;
var URL1;
var URL2;
var URL1_hash;
var parallax;
var iframeElement;
var url_source2;
var url_source3;

/*
element.addEventListener("load", function(event) {
	let url = document.getElementById("iframe01").contentWindow.location.href;
});
*/
window.addEventListener("DOMContentLoaded", () => {
	parallax=10.0;
alert("86: DOMContentLoaded");
	iframeElement = document.getElementById("iframe01");
	iframeElement.contentWindow.addEventListener("click", () => {
		//alert("clickを検知しました");
//	iframeElement.contentWindow.addEventListener("dblclick", () => {
		URL1 = document.getElementById("iframe01").contentWindow.location.href;
		alert("90 現在のiframe01のURLは"+URL1);
		$('#url_1').val(URL1);
		$('#url_2').val(URL1);
		URL_pathname=URL1.pathname;								//視点位置URLのパス
		viewpoint=URL1.split('/');								//「/(ダッシュ)」で区切って分割する
		set_view_url(1,viewpoint,parallax);
		URL2=url_2;
		$('#url_2').val(url_2);
		$('#iframe02').attr("src",url_2);
	})
})

const iframe_change = document.getElementById('iframe01');
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.attributeName === 'src') {
			alert('108: iframe_change src has changed to:', iframe_change.src);
			// ここにイベント処理を追加
			//alert("133 OK!");
		}
	});
});
observer.observe(iframe_change, { attributes: true, attributeFilter: ['src'] });

function set_view_url(url_number,url_source,parallax_length) {	//視点No., 元のURL, 視差(km)
alert("115: "+url_source[0]+url_source[1]);
	url_source2=url_source[1];											//視点位置の緯度・経度を保存
	url_source3=url_source[2];
	switch (url_number) {
		case 0:																				//viewpoint　[視点URL入力時]
			increment=parallax_length*500;							//左図視点作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4])));		//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4])));	//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_1').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
			url_0=decodeURI(url_origin+url_pathname+"#"+url_source.join('/'));
			url_1=decodeURI(url_origin+url_pathname+"#"+url_source.join('/'));
			increment=-parallax_length*500;							//右図視点作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4])));		//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4])));	//url_0の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_2').val(decodeURI(url_origin+url_pathname+url_source.join('/')));
			url_2=decodeURI("localhost"+url_pathname+url_source.join('/'));
		break;
		case 1:																				//left　     [左図URL入力時]
			increment=-parallax_length*500;								//視点URL作成
//			url_source[0]=increment;
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4])));		//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）+90
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4])));	//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
//			$('#url_0').val(decodeURI(url_source.join('/')));
//			$('#url_0').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
//			url_0=decodeURI(url_origin+url_pathname+"#"+url_source.join('/'));
//			url_0=url_source.join('/');
//alert("141  url_0: "+url_0);
url_0=url_0.replace('http:///','http://localhost/');
url_0=url_0.replace('#///','#');
			url_0=decodeURI(url_0);
alert("144  url_0: "+url_0);
			increment=-parallax_length*1000;							//右図視点作成
//			url_source[0]=increment;
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4])));		//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4])));	//url_1の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
//		$('#url_2').val(decodeURI(url_source.join('/')));
//		url_2=decodeURI(url_source.join('/'));
url_2=url_2.replace('http:///','http://localhost/');
url_2=url_2.replace('#///','#');
//		url_source[2]='localhost';
//		url_2=url_source.join('/');
//			url_2=decodeURI(url_origin+url_pathname+"#"+url_source.join('/'));
			url_2=decodeURI(url_2);
url_rewrite(0);
url_rewrite(1);
		break;
		case 2:																				//right    　[右図URL入力時]
			increment=+parallax_length*500;								//視点URL作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4])));		//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4])));	//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_0').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
			url_0=decodeURI(url_origin+url_pathname+"#"+url_source.join('/'));
			increment=+parallax_length*1000;							//左図視点作成
			url_source[1]=ido(url_source2,url_source3,increment,(parseFloat(url_source[4])));		//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の緯度（度）
			url_source[2]=keido(url_source2,url_source3,increment,(parseFloat(url_source[4])));	//url_2の緯度（度）,経度（度）から距離（ｍ）,方位（度）の地点の経度（度）
			$('#url_1').val(decodeURI(url_origin+url_pathname+"#"+url_source.join('/')));
			url_1=decodeURI(url_source.join('/',4));
		break;
	}
alert("160  url_0: "+url_0+" <<<>>> url_2: "+url_2);

}
function ido(lon1, lat1, s12, azi_add_90) {
	const input=lon1+" "+lat1+" "+parseFloat(azi_add_90-90)+" "+s12;
	const point=GeodesicDirect(input, dmsformat, prec);
	const latlon=point.p2.split(' ');
	return latlon[0];
}
function keido(lon1, lat1, s12, azi_add_90) {
	const input=lon1+" "+lat1+" "+parseFloat(azi_add_90-90)+" "+s12;
	const point=GeodesicDirect(input, dmsformat, prec);
	const latlon=point.p2.split(' ');
	return latlon[1];
}
function GeodesicDirect(input, dmsformat, prec) {
	"use strict";
	var result = {},t, p1, azi1, s12;
	try {
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
}
//視点変更
function change_viewpoint(Previous_url) {					//視点位置変更時の各要素表示，戻り値=各要素の配列
//	var p_url=new URL(Previous_url);
alert("207: "+Previous_url);
	var p_url=new URL(Previous_url);
	var viewpoint_hash_p_url=p_url.hash.replace("#", "");	//ハッシュデータの分解
	var viewpoint_p_url=viewpoint_hash_p_url.split('/');	//「/(ダッシュ)」で区切って分割する
/*
	//視点位置設定
	viewpoint.altitude=viewpoint_p_url[0];					//高度
	viewpoint.latitude=viewpoint_p_url[1];					//緯度(°)
	viewpoint.longitude=viewpoint_p_url[2];					//緯度(°)
	viewpoint.emphasis=viewpoint_p_url[3];					//高さ強調率
	viewpoint.azimuth=viewpoint_p_url[4];						//方位角(°)
	viewpoint.elevation=viewpoint_p_url[5];					//仰角(°)
	viewpoint.inclination=viewpoint_p_url[6];				//傾斜角(°)
*/
	return viewpoint_p_url;
}

