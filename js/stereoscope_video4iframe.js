/*	stereoscope_video4iframe.js      2022. 9. 6. coded by K. RYOKI
                                     2023. 5. 5. improved
               (stereoscope_video.js 2022. 2. 8. coded by K. RYOKI)
*/

const wait = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
    //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
  });
}
const speed_min=0.25;
const speed_max=15;
const speed_step=0.25;
const speed_init=1;
const speed_yt_min=0.25;
const speed_yt_max=2;
const speed_yt_step=0.25;
const speed_yt_init=1;
const default_source="./../img/BIPS.mp4";
const about_blank="about:blank";
const menu_off=$('#checkbox2').get(0);
const menu=$('.menu').get(0);
const loops=$('#checkbox1').get(0);
const speed_number=$('#speed_number').get(0);
const speed_range=$('#speed_range').get(0);
const startTime=$('#start_time').get(0);
const endTime=$('#end_time').get(0);
const sampledropArea=$('#sampleDropA').get(0);
var image_video1='<video id="video1" class="video" controls controlsList="nofullscreen" muted loop playsinline"></video>';
var image_video2='<video id="video2" class="video" controls controlsList="nofullscreen" muted loop playsinline"></video>';
var video1=$('#video1').get(0);
var video2=$('#video2').get(0);
var iframe1=$('#iframeId1').get(0);
var iframe2=$('#iframeId2').get(0);
var file_drop_area=$('#drop_area').get(0);		//ドラッグ&ドロップエリア
var file_input=$('#filename').get(0);		//input[type=file]
var movie_time;
var repeat_start_time=0;
var angle=0;
var startYT=0;
var endYT=10;
var yt_sw=0;
var loop_sw=1;
var ytStart_sw=0;
var yt_change_status=0;
var blobUrl;
var url_Specified;
var ytID;
var YouTube_iframe;
var iframe1_area=$('#span_12').get(0);
var iframe2_area=$('#span_22').get(0);
var ytiframeCompo1='<iframe class="iframe1" id="iframeId1" width="49%" height="480" src="https://www.youtube.com/embed/';
var ytiframeCompo2='" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" ondragenter="iframe_hide()" ></iframe>';
var youtube_parameter='?enablejsapi=1&autoplay=1&mute=1&fs=0&modestbranding=1&rel=0';
var param1=location.search.substring(1);					// URLパラメータ文字列(?以降)を取得する
var param_url=param1;

function tooltip_rewrite(tooltip_name) {
	$('#file_span_id').removeAttr('title');
	$('#file_span_id').attr('title',tooltip_name);
}
function span_text_rewrite(file_name) {
	$('#file_span_id').text(basename(file_name));
	video_show();
}
//HTMLフォーム読込後実行
jQuery(function ($) {
	$('#damy_margin').toggle();
	$('#damy_margin2').toggle();
	$('#start_time').css('visibility','visible');
	$('#end_time').css('visibility','visible');
	$('#input_rotate').css('visibility','visible');
	init_speed();
	// URLアンカー（#（?も可）以後，映像ファイル名）取得
	var urlHash=location.hash.slice(1) ;
	var video_speed=speed_range.value;
	if(urlHash){							// アンカーあり
			video1.src=urlHash;
			video2.src=urlHash;
			var uri_this=urlHash;
		} else {							// アンカーなし
			video1.src=default_source;
			video2.src=default_source;
			var uri_this=default_source;
	};
	var uri_basement=basename(uri_this);
	var tooltip_file=decodeURI(video1.src);
	var select_file=decodeURI(basename(video1.src));
	$('#file_span_id').text(tooltip_file);
	tooltip_rewrite(tooltip_file);
	span_text_rewrite(select_file);
	//ファイル読込
	$('#filename').change(function() {
		const fileList=this.files ;
		blobUrl=window.URL.createObjectURL( fileList[0] ) ;
		video_to_show(blobUrl);
	init_speed();
	});
	//再生開始・停止時刻初期設定
	$('#video1').on('loadedmetadata',function() {
		startTime.value=0;
		endTime.value=video1.duration;
		movie_time=endTime.value;
		check_loop();
	});
	//速さ調整
	$('#speed_range').change(function() {
		if (yt_sw==0) {
				video_speed=speed_range.value;
				speed_number.value=video_speed;
				video1.playbackRate=video_speed;
				video2.playbackRate=video_speed;
			} else {
				video_speed=speed_range.value;
				speed_number.value=video_speed;
		}
	});
	// テキストボックスフォーカス時
	$('#text_uri').focusin(function(e) {
		$('#text_uri').val("");
	});
	drag_and_drop_event(file_drop_area);
	if (param_url !== '') {
		url_Specified=param_url;
		outer_uri();
	}
	iframe_hide();
	//videoの再生開始位置のクリックイベント
	video1.addEventListener('mouseleave', (event) => {
		if (parseInt(video2.currentTime)!==parseInt(video1.currentTime)) {
			startTime.value=parseInt(video1.currentTime);
			video1.currentTime=startTime.value;
			video2.currentTime=startTime.value;
		}
		video1.currentTime=startTime.value;
		video2.currentTime=startTime.value;
		start();
	});
	video1.addEventListener('ended', (event) => {
		if (loops.checked==true) {
			video1.currentTime=startTime.value;
			video2.currentTime=startTime.value;
			start();
		}
	})
})
//videoフレームの回転
function rotation() {
	angle=$('#input_rotate').val();
	$('video').css('transform', 'rotate('+angle+'deg)');
	$('#iframeId1').css('transform', 'rotate('+angle+'deg)');
	$('#iframeId2').css('transform', 'rotate('+angle+'deg)');
	$('.span_draw').css('transform', 'rotate('+angle+'deg)');
}
//再生速度初期設定
function init_speed() {
	if (yt_sw==0) {
			speed_range.min=speed_min;
			speed_range.max=speed_max;
			speed_range.step=speed_step;
			speed_range.value=speed_init;
			speed_number.step=speed_step;
			speed_number.value=speed_init;
		} else{
			speed_range.min=speed_yt_min;
			speed_range.max=speed_yt_max;
			speed_range.step=speed_yt_step;
			speed_range.value=speed_yt_init;
			speed_number.step=speed_yt_step;
			speed_number.value=speed_yt_init;
	}
	set_speed();
}
//再生速度設定
function set_speed() {
	if (yt_sw==0) {
			if (parseFloat(speed_number.value)>parseFloat(speed_max)) {
				speed_number.value=speed_max;
			}
			if (parseFloat(speed_number.value)<=0) {
				speed_number.value=speed_min;
			}
			speed_range.value=speed_number.value;
			video1.playbackRate=speed_number.value;
			video2.playbackRate=speed_number.value;
		} else {
			if (parseFloat(speed_number.value)>parseFloat(speed_yt_max)) {
				speed_number.value=speed_yt_max;
			}
			if (parseFloat(speed_number.value)<=0) {
				speed_number.value=speed_yt_min;
			}
			speed_range.value=speed_number.value;
			player1.setPlaybackRate(parseFloat(speed_number.value));
			player2.setPlaybackRate(parseFloat(speed_number.value));
			player1.playVideo();
			player2.playVideo();
	}
}
function set_speed_renge() {
	player1.setPlaybackRate(parseFloat(speed_range.value));
	player2.setPlaybackRate(parseFloat(speed_range.value));
	player1.playVideo();
	player2.playVideo();
}
//再生開始時刻設定
function set_start() {
	stop();
	preset_startTime(startTime.value);
	if (yt_sw==0) {
		} else{
			startYT=startTime.value;
			player1.cueVideoById({
				videoId:ytID,
				loop:0, // ループの設定
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
			player2.cueVideoById({
				videoId:ytID,
				loop:0, // ループの設定
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
	}
}
//再生終了時刻設定
function set_end() {
	stop();
	if (yt_sw==0) {
			preset_endTime(movie_time);
			video1.pause();	//再生停止
			video2.pause();
		} else {
			pausebutton();
			endYT=endTime.value;
			player1.cueVideoById({
				videoId:ytID,
				loop:0, // ループの設定
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
			player2.cueVideoById({
				videoId:ytID,
				loop:0, // ループの設定
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
	}
}
//再生開始
function start() {
	if (yt_sw==0) {
			ytStart_sw=0;
			video1.pause();								//再生停止
			video2.pause();
			video1.currentTime=startTime.value;			//再生開始位置セット
			video2.currentTime=startTime.value;
			video1.play();								//再生
			video2.play();
			timeup();
		} else {
			ytStart_sw=1;
			playbutton();							//YouTube再生開始
	}
}
//mp4再生
function timeup() {
	if (yt_sw==0) {
		video1.addEventListener('timeupdate', function(){
			var presentTime=video1.currentTime;			//mp4再生位置
			if( parseFloat(presentTime)>=parseFloat(endTime.value)) {			//再生停止位置以上なら
				video1.pause(); 						//再生停止
				video2.pause();
				video1.currentTime=startTime.value;		//再生開始位置セット
				video2.currentTime=startTime.value;
				if(loops.checked==true){
					video1.play();					//mp4再生開始
					video2.play();
				}
			}
		},false);
	}
}
//YouTube反復再生
function yt_loop() {
	pausebutton();
	if(loops.checked==true){
		playbutton();						//YouTube再生開始
	}
}
//再生再開
function replay(set_replay) {
	if (yt_sw==0) {
			if (set_replay===undefined){
					video1.currentTime=repeat_start_time;		//引数なし
					video2.currentTime=repeat_start_time;
				} else {
					video1.currentTime=set_replay;			//引数あり
					video2.currentTime=set_replay;
			}
			video1.play();									//再生
			video2.play();
		} else {
			if (set_replay==null){
					yt_seek(startTime.value);				//引数なし
				} else {
					yt_seek(set_replay);					//引数あり
				}
			replaybutton();									//再生
	}
}
//再生停止
function stop() {
	if (yt_sw==0) {
			video1.pause();							//mp4の中断
			video2.pause();
			repeat_start_time=video1.currentTime;
		} else {
			pausebutton();								//YouTubeの中断
	}
}
//loop表示
function check_loop(){
	if (yt_sw==0) {
			video1.pause(); //再生停止
			video2.pause();
			if (loops.checked == 'checked') {
					loop_sw=1;
					$('#video1').attr('loop',true);
					$('#video2').attr('loop',true);
					video1.currentTime=startTime.value;			//再生開始位置セット
					video2.currentTime=startTime.value;
				} else {
					loop_sw=0;
					$('#video1').attr('loop',false);
					$('#video2').attr('loop',false);
			}
			replay();
		} else {
			pausebutton();
			if (loops.checked == 'checked') {
					loop_sw=1;
				} else {
					loop_sw=0;
			};
	}
}
//映像再生
function video_to_show(blobUrl){
	startTime.value=0;
	endTime.value=video1.duration;
	video_show();
	$('#video1').attr('src',blobUrl);
	$('#video2').attr('src',blobUrl);
	var select_file=$('#filename').prop('files')[0].name;
	var tooltip_file2=document.getElementById('filename').value;
	if(tooltip_file2.indexOf("C:\\fakepath\\" || "C:/fakepath/")>-1){
		var tooltip_file3=tooltip_file2.replace(("C:\\fakepath\\" || "C:/fakepath/"),"local file: ");
	};
	tooltip_rewrite(tooltip_file3);
	span_text_rewrite(select_file);
	init_speed();
	set_speed()
}
//iframe再生
function iframe_to_show(blobUrl){
	video_hide();
	iframe_show();
	$('#iframeId1').attr('src',blobUrl);
	$('#iframeId2').attr('src',blobUrl);
	var select_file=$('#filename').prop('files')[0].name;
	var tooltip_file2=document.getElementById('filename').value;
	if(tooltip_file2.indexOf("C:\\fakepath\\" || "C:/fakepath/")>-1) {
		var tooltip_file3=tooltip_file2.replace(("C:\\fakepath\\" || "C:/fakepath/"),"local file: ");
	}
	tooltip_rewrite(tooltip_file3);
	span_text_rewrite(select_file);
	init_speed();
}
//URIからファイル名の取出
function basename(path) {
	var filename=path.split("/" || "\\").reverse()[0].split('.')[0];		//名前
	var extend=path.split("/" || "\\").reverse()[0].split('.')[1];			//拡張子
	var ret;
	if (extend="undefined"){ret=filename;} else{ret=filename+"."+extend;}
	return ret;
}
//映像ファイル名入力
function outer_uri1() {
	url_Specified=$('#text_uri').val();
	outer_uri();
}
//YouTubeのURL作成
function outer_uri() {
	startTime.value=null;
	endTime.value=null;
	if (param_url !== '') {
		url_Specified=param_url;
	}
	var url_Specified_array
	var yt_num;
	var ytID0;
	var YouTube_iframe1;
	var YouTube_iframe2;
	init_speed();
	if (url_Specified.endsWith('.mp4')==true){			//mp4の場合
			iframe_hide();
			video_show();
			yt_sw=0;
			ytStart_sw=0;
			drag_and_drop_event(file_drop_area);
			video1.src=url_Specified;
			video2.src=url_Specified;
			$('#file_span_id').text(url_Specified);
			init_speed();
			set_speed();
			playback_duration();
		} else {														//YouTubeの埋め込み
			yt_change_status=0;
			video_hide();
			iframe_show();
			drag_and_drop_event(file_drop_area);
			yt_sw=1;
			if (url_Specified.startsWith('<iframe')==true){				//<iframe>型の場合
				url_Specified_array=GetUrlInText(url_Specified);
				url_Specified=url_Specified_array[0];
			}
			if (url_Specified.startsWith('https://youtu.be/')==true){	//URL https://youtu.be/型の場合
					ytID=url_Specified.replace('https://youtu.be/','');
					YouTube_iframe1=ytiframeCompo1+ytID+youtube_parameter+ytiframeCompo2;
				} else {													//URL www.youtube.com型
					ytID0=url_Specified.replace('https:\/\/www.youtube.com\/embed\/','');
					ytID0=ytID0.replace('https:\/\/www.youtube.com\/watch?v=','');
					ytID=ytID0;
					if (ytID.indexOf('&')!==-1) {
						ytID=ytID.substring(0, ytID.indexOf("&"));
					}
					YouTube_iframe1=ytiframeCompo1+ytID+youtube_parameter+ytiframeCompo2;
					ytID0=ytID0.replace(ytID,'');
					ytID0=ytID0.replace('&t=','');
					ytID0=ytID0.replace('s','');
			}
			YouTube_iframe2=YouTube_iframe1.replace('iframe1','iframe2');
			YouTube_iframe2=YouTube_iframe2.replace('iframeId1','iframeId2');
			drag_and_drop_event(iframe1_area);
			drag_and_drop_event(iframe2_area);
			$('#file_span_id').text(ytID);
			player1.cueVideoById(ytID);
			player2.cueVideoById(ytID);
			rotation();
			if(ytID0!==''||ytID0=='NaN') {
					startTime.value=parseInt(ytID0);
				} else {
					startTime.value=0;
			}
	}
	init_speed();
	drag_and_drop_event(file_drop_area);
}
// ドラッグ&ドロップエリアのイベント
function drag_and_drop_event(file_area) {
	file_area.addEventListener('dragover', function(e){				//ドラッグオーバー
		e.preventDefault();
		file_area.classList.add('dragover');
	});
	file_area.addEventListener('dragleave', function(e){			//ドラッグアウト
		e.preventDefault();
		file_area.classList.remove('dragover');
	});
	file_area.removeEventListener('drop', drop_func);
	file_area.addEventListener('drop', drop_func);					//ドロップ
}
function drop_func(e){					//ドロップ
	e.preventDefault();
	file_drop_area.classList.remove('dragover');
	var files=e.dataTransfer.files;							//ドロップファイル取得
	file_input.files=files;									//取得ファイル→input[type=file]
	URL.revokeObjectURL(blobUrl);
	blobUrl=window.URL.createObjectURL(files[0]);
	if(typeof files[0] !== 'undefined') {					//ファイル取得成功ならvideoを表示
			const reader = new FileReader();
			yt_sw=0;
			video_to_show(blobUrl);
		} else {											//取得失敗
			yt_sw=1;
			iframe_to_show(blobUrl);
	}
}
//menu一時消去
function check_menu(){
	$('#set').toggle();
	$('#damy_margin').toggle();
	$('#damy_margin2').toggle();
	$('#ending_text').toggle();
}
function playback_duration(){
	if (yt_sw==0) {
			var videoElem = document.getElementById('video1');
			videoElem.addEventListener('loadedmetadata', function() {
				endTime.value=videoElem.duration;
				movie_time=endTime.value;
			});
		} else {
			startTime.value=0;
			endTime.value=player1.duration;
			movie_time=endTime.value;
	}
}
//再生開始時刻セット
function preset_startTime(preset_start) {
	if (parseFloat(preset_start)<0){
			startTime.value=0;
		} else {
			if (parseFloat(startTime.value)<parseFloat(preset_start)){
				startTime.value=preset_start;
			}
	}
	if (parseFloat(startTime.value)>parseFloat(endTime.value)){
		startTime.value=parseFloat(endTime.value)-1.0;
	}
}
//再生終了時刻セット
function preset_endTime(preset_end) {
	if (parseFloat(endTime.value)>=parseFloat(preset_end)){
		endTime.value=preset_end;
	}
	if (parseFloat(endTime.value)<parseFloat(startTime.value)){
		endTime.value=parseFloat(startTime.value)+1.0;
	}
}
//iframe表示
function iframe_show() {
	$('#iframeId1').show();
	$('#iframeId2').show();
}
//video表示
function video_show() {
	$('#video1').show();
	$('#video2').show();
}
//iframe非表示
function iframe_hide() {
	$('#iframeId1').hide();
	$('#iframeId2').hide();
}
//video非表示
function video_hide() {
	$('#video1').hide();
	$('#video2').hide();
}
//ondropイベント
//(引用)
//alphasis(2017):ondropイベント, JavaScriptリファレンス, http://alphasis.info/2014/03/javascript-dom-event-ondrop/
function sampleADrop( $event, $this ){
	var $data = $event.dataTransfer.getData( "Text" );
	if ($data!=='') {
		url_Specified=$data;
		outer_uri();
		start();
		stop();
	}
}
//URL抽出
//(参考・引用)
//ginpei(2007):文字列中のURLを探してリンクにするJavaScript, https://ginpei.hatenablog.com/entry/20070811/1186846446
//Sato, K. (2019):[JavaScript] テキスト文字列からURLを検索し取得する, https://noknow.info/it/javascript/get_url_from_text_string?lang=ja
function GetUrlInText(text) {
	const matches = text.match(/((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g);
	if(matches != null) {
			return matches;
		} else {
			return [];
	}
}
/*
//遅延実行
//(引用)
//labo(2016,2023):JavaScriptで一定時間待ってから処理を開始する方法, https://laboradian.com/js-wait/
async function wait_main() {	//for replay()
	try {
			await wait(100); // 100ms休止
			// 目的の処理の記述
		} catch (err) {
			console.error(err);
	}
}
function video_click_test() {
	alert("638  video_click_test() OK!");
}
*/
