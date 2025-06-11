//	down_loader.js								2019.9.11. coded by K. RYOKI
//
var range = {																//初期値定義
	url_source: 'http://cyberjapandata.gsi.go.jp/xyz/',					//サーバーのURL
	tile_type: 'std',														//タイルの種類
	tile_extension: '.png',													//画像の拡張子
	latitude_min: '35.440',													//緯度(°)最小値
	latitude_max: '35.448',													//緯度(°)最大値
	longitude_min: '139.132',												//経度(°)最小値
	longitude_max: '139.137',												//経度(°)最大値
	zoom_min: '12',															//ズーム最小値
	zoom_max: '17',															//ズーム最大値
	saving_folder: 'C://inetpub/wwwroot/StereoscopicViewer/temp/xyz/'			//保存先フォルダ
	//saving_folder: 'd://temp/xyz/'
	};
window.onload = function(){													//初期値
	document.getElementById('url_source').value=range.url_source;			//サーバーのURL
	document.getElementById('tile_type').value=range.tile_type;				//タイルの種類
	document.getElementById('tile_extension').value=range.tile_extension;	//画像の拡張子
	document.getElementById('latitude_min').value=range.latitude_min;		//緯度(°)最小値
	document.getElementById('latitude_max').value=range.latitude_max;		//緯度(°)最大値
	document.getElementById('longitude_min').value=range.longitude_min;		//経度(°)最小値
	document.getElementById('longitude_max').value=range.longitude_max;		//経度(°)最大値
	document.getElementById('zoom_min').value=range.zoom_min;				//ズーム最小値
	document.getElementById('zoom_max').value=range.zoom_max;				//ズーム最大値
	document.getElementById('saving_folder').value=range.saving_folder;		//保存先フォルダ
}
function std() {
	document.getElementById('tile_type').readOnly = true;
	range.tile_type='std';
	document.getElementById('tile_type').value=range.tile_type;
	document.getElementById('tile_extension').readOnly = true;
	range.tile_extension='.png';
	document.getElementById('tile_extension').value=range.tile_extension;
}
function pale() {
	document.getElementById('tile_type').readOnly = true;
	range.tile_type='pale';
	document.getElementById('tile_type').value=range.tile_type;
	document.getElementById('tile_extension').readOnly = true;
	range.tile_extension='.png';
	document.getElementById('tile_extension').value=range.tile_extension;
}
function blank() {
	document.getElementById('tile_type').readOnly = true;
	range.tile_type='blank';
	document.getElementById('tile_type').value=range.tile_type;
	document.getElementById('tile_extension').readOnly = true;
	range.tile_extension='.png';
	document.getElementById('tile_extension').value=range.tile_extension;
}
function english() {
	document.getElementById('tile_type').readOnly = true;
	range.tile_type='english';
	document.getElementById('tile_type').value=range.tile_type;
	document.getElementById('tile_extension').readOnly = true;
	range.tile_extension='.png';
	document.getElementById('tile_extension').value=range.tile_extension;
}
function ort() {
	document.getElementById('tile_type').readOnly = true;
	range.tile_type='ort';
	document.getElementById('tile_type').value=range.tile_type;
	document.getElementById('tile_extension').readOnly = true;
	range.tile_extension='.jpg';
	document.getElementById('tile_extension').value=range.tile_extension;
}
function others() {
	document.getElementById('tile_type').readOnly = false;
	range.tile_type='';
	document.getElementById('tile_type').value=range.tile_type;
	document.getElementById('tile_extension').readOnly = false;
	range.tile_extension='.';
	document.getElementById('tile_extension').value=range.tile_extension;
}
function latitude_max() {
	range.latitude_max=document.getElementById('latitude_max').value;
}
function latitude_min() {
	range.latitude_min=document.getElementById('latitude_min').value;
}
function longitude_max() {
	range.longitude_max=document.getElementById('longitude_max').value;
}
function longitude_min() {
	range.longitude_min=document.getElementById('longitude_min').value;
}
function zoom_max() {
	range.zoom_max=document.getElementById('zoom_max').value;
}
function zoom_min() {
	range.zoom_min=document.getElementById('zoom_min').value;
}
function saving_folder() {
	range.saving_folder=document.getElementById('saving_folder').value;
}

