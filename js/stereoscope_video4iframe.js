/*	stereoscope_video4iframe.js      2022. 9. 6. coded by K. RYOKI
                                     2024. 7. 2. improved
                                     2025. 9.13. improved
               (stereoscope_video.js 2022. 2. 8. coded by K. RYOKI)
*/

const speed_min=0.25;
const speed_max=15;
const speed_step=0.25;
const speed_init=1;
const speed_yt_min=0.25;
const speed_yt_max=2;
const speed_yt_step=0.25;
const speed_yt_init=1;
const default_dir="https://higgs-ryoki.github.io/StereoscopicViewer";		//公開用pass
//const default_dir="http:./../img";		//Local用pass
const default_source=default_dir+"/img/BIPS.mp4";
const default_vrsource=default_dir+"/img/kujira_20231104_480.mp4";
const menu=$('.menu').get(0);
const left_active=$('#checkbox0').get(0);
const loops=$('#checkbox1').get(0);
const menu_off=$('#checkbox2').get(0);
const vr_select=$('#checkbox3').get(0);
const vr_sound=$('#checkbox4').get(0);
const checkbox4_title=$('#checkbox4_title').get(0);;
const speed_number=$('#speed_number').get(0);
const speed_range=$('#speed_range').get(0);
const startTime=$('#start_time').get(0);
const endTime=$('#end_time').get(0);
const sampledropArea=$('#sampleDropA').get(0);
const textURI=$('#text_uri').get(0);
const input_width=$('#input_width').get(0);
const input_height=$('#input_height').get(0);
const file_span_id=$('#file_span_id').get(0);
const image_video1='<video id="video1" class="video" width="48vw" height="50vh" controls controlsList="nofullscreen" muted playsinline src=default_source ondragenter="video_hide()" ></video>'
const image_video2='<video id="video2" class="video" width="48vw" height="50vh" controls controlsList="nofullscreen" muted playsinline src=default_source ondragenter="video_hide()" ></video>'
const video1=$('#video1').get(0);
const video2=$('#video2').get(0);
const iframe1=$('#iframeId1').get(0);
const iframe2=$('#iframeId2').get(0);
const vr1=$('#video_A_Frame01').get(0);
const vr2=$('#video_A_Frame02').get(0);
const vr1_a_scene=$('#a-scene1').get(0);
const vr2_a_scene=$('#a-scene2').get(0);
const file_drop_area=$('#drop_area').get(0);		//ドラッグ&ドロップエリア
const file_input=$('#filename').get(0);				//input[type=file]
const input_rotate=$('#input_rotate').get(0);

var blobUrl;
var iframe_street;
var movie_time;
var stop_time;
var url_Specified=default_dir;
var YouTube_iframe;
var ytID;
var ytID0;
var ytID1;
var angle=0;
var repeat_start_time=0;
var startYT=0;
var endYT=10;
var left_op=1;
var param1=location.search.substring(1);			// URLパラメータ文字列(?以降)を取得する
var param_url=param1;
var street_sw=0;
var yt_change_status=0;
var yt_sw=0;
var ytiframeCompo1='<iframe class="iframe1" id="iframeId1" width="48vw" height="50vh" src="https://www.youtube.com/embed/';
var ytiframeCompo2='" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" ondragenter="iframe_hide()" ></iframe>';
var youtube_parameter='?enablejsapi=1&autoplay=0&mute=1&fs=0&modestbranding=1&rel=0';
var iframe1_area=$('#span_12').get(0);
var iframe2_area=$('#span_22').get(0);
var cTime;
var display_type;
var endTime_non_VR;
var previous_type="video";
var video_filename='BIPS';
var iframe_filename;
var vr_filename='kujira_20231104_480';

// appended 20250715
	const url = window.location.href;
	const queryString = window.location.search;
	if (queryString=='') {
		} else {
			youtuneNo2=queryString.replace("?", "");
	}
function tooltip_rewrite(tooltip_name) {
	$('#file_span_id').text(basename(tooltip_name));
}
//HTMLフォーム読込後実行
jQuery(function ($) {
	var select_file;
	var tooltip_file;
	var uri_basement;
	var urlHash;
	var video_speed;
	var st=$('#start_time').get(0);
	$('#damy_margin1').toggle();
	$('#damy_margin2').toggle();
	startTime.visibility='visible';
	endTime.visibility='visible';
	input_rotate.visibility='visible';
	init_speed();
	video_set_leave();
	// URLアンカー（#以後，映像ファイル名）取得
	urlHash=location.hash.slice(1) ;
//alert("107 location.hash, urlHash = "+location.hash+", "+urlHash);
if (urlHash==!""){
//alert("109 urlHash = "+urlHash);
	video_speed=speed_range.value;
} else{
}
//2025.9.7. append
var thisURL;
// URL取得
thisURL=new URL(window.location.href);

// URLのsearchParamsオブジェクト作成
var urlParams=thisURL.searchParams;

// getメソッドで表示用ファイル(またはURL)を取得
var iframe_src;
//iframe_src=urlParams.get('file');
iframe_src=thisURL.searchParams.get("file");
//alert("125 iframe_src = "+iframe_src);
if (iframe_src!=null){
		document.getElementById('text_uri').value = iframe_src;
$('#file_span_id').text(basename(tooltip_file));
		outer_uri1();
	} else {
		if(urlHash){							// URL hash (#) あり
//alert("131 URL hash (#) あり");
				video1.src=urlHash;
				video2.src=urlHash;
				vr1_a_scene.src=urlHash;
				vr2_a_scene.src=urlHash;
				var uri_this=urlHash;
			} else {							// URL hash (#) なし
//alert("138 URL hash (#) なし");
				video1.src=default_source;
				video2.src=default_source;
				vr1_a_scene.src=default_vrsource;
				vr2_a_scene.src=default_vrsource;
				var uri_this=default_source;
		}
		uri_basement=basename(uri_this);
		tooltip_file=decodeURI(video1.src);
		select_file=decodeURI(basename(video1.src));
		$('#file_span_id').text(basename(tooltip_file));
		tooltip_rewrite(tooltip_file);
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
		display_type="video";
		display_choise(display_type);
		//videoの再生終了時に繰り返すとき
		video1.addEventListener('ended', (event) => {
			if (loops.checked==true) {
				video1.currentTime=startTime.value;
				video2.currentTime=startTime.value;
				start();
			}
		})
		//iframeの再生終了時に繰り返すとき
		/*
			video1.addEventListener("timeupdate", function(){
				cTime = video1.currentTime;//現在のvideo再生位置
				if( endTime.value <= cTime) {//もしも再生停止位置以上になったら
					video1.pause();// 再生停止
					video2.pause();
					video1.currentTime = startTime.value;//再生開始位置セット
					video2.currentTime = startTime.value;
					setTimeout(function(){
						video1.play();
					},1000);//再生実行
					setTimeout(function(){
						video2.play();
					},1000);
				}
			})
		*/
	}
//-----------------------------------------------------------add 20251008
//	window.addEventListener("load", setCurTime(), false);
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
		} else {
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
//再生速度range設定
function set_speed_range() {
	player1.setPlaybackRate(parseFloat(speed_range.value));
	player2.setPlaybackRate(parseFloat(speed_range.value));
	player1.playVideo();
	player2.playVideo();
document.getElementById("speed_range").disabled = false;
}
//再生開始時刻設定
function set_start() {
	stop();
	if (startTime.value=="") {
		startTime.value=0;
	}
	preset_startTime(startTime.value);
	if (yt_sw==0) {																	//iframe以外
		} else {																	//YouTube
			player1.cueVideoById({
				videoId:ytID,
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
			player2.cueVideoById({
				videoId:ytID,
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
			if (startTime.value=="") {
				startTime.value=0;
				startYT=startTime.value;
			}
/*			if (endTime.value!==player1.getDuration()) {
				endTime.value=player1.getDuration();
				endYT=endTime.value;
			}
*/
	}
}
//再生終了時刻設定
function set_end() {
	stop();
preset_endTime(endTime.value);
	if (yt_sw==0) {																	//iframe以外
			video1.pause();														//再生停止
			video2.pause();
			if (endTime.value=="") {
/*
			if (endTime.value=="" || video1.duration!==NaN) {
alert("320 video1.duration = "+video1.duration);
*/
				endTime.value=video1.duration;
			}
		} else {																	//YouTube
			endYT=endTime.value;
//alert("322 endYT = "+endYT);
			player1.cueVideoById({
				videoId:ytID,
				playlist: ytID,													//再生する動画のリスト
				startSeconds: startTime.value,
//				endSeconds: endTime.value
				endSeconds: endYT
			});
//alert("330 endYT = "+endYT);
			player2.cueVideoById({
				videoId:ytID,
				playlist: ytID,													//再生する動画のリスト
				startSeconds: startTime.value,
//				endSeconds: endTime.value
				endSeconds: endYT
			});
			
//endTime.value=endYT;
//alert("341 endYT = "+endYT);
endTime.value=endYT;
	}
}
//再生開始
function start() {
	if (yt_sw==0) {																	//iframe以外
			if (vr_select.checked==false){						//通常のvideo

					video1.currentTime=startTime.value;	//再生開始位置セット
					video2.currentTime=startTime.value;
/*
					setTimeout(
						function(){
							video1.play();
						},100
					);															//再生
					setTimeout(
						function(){
							video2.play();
						},100
					);
					timeup();
*/
//							video1.play();
							video2.play();

//        startTime = document.getElementById("start_time").value;
        video1.currentTime = startTime.value;
        video2.currentTime = startTime.value;
        video1.play();
        video2.play();
				} else {															//VR動画
					vr1.currentTime=startTime.value;	//再生開始位置セット
					vr2.currentTime=startTime.value;
					vr1.play();
					vr2.play();
			}
		} else {																	//YouTubeの場合
			playbutton();														//YouTube再生開始
	}
}
//動画ファイル再生
function timeup() {
	if (yt_sw==0) {																	//iframe以外
		if (vr_select.checked==false){						//通常のvideo
/*
*/				var presentTime=video1.currentTime;				//動画ファイル再生位置
				if( parseFloat(presentTime)<=parseFloat(endTime.value)) {		//再生停止位置以上なら
					video1.pause(); 										//再生停止
					video2.pause();
					video1.currentTime=startTime.value;						//再生開始位置セット
					video2.currentTime=startTime.value;
					if(loops.checked==true){
						setTimeout(function(){
							video1.play();
						},100);													//動画ファイル再生開始
						setTimeout(function(){
							video2.play();
						},100);
					}
				}
/*
*/
			} else {																//VR動画
				var presentTime=vr1.currentTime;				//動画ファイル再生位置
				if( parseFloat(presentTime)<=parseFloat(endTime.value)) {		//再生停止位置以上なら
					vr1.pause(); 								//再生停止
					vr2.pause();
					vr1.currentTime=startTime.value;			//再生開始位置セット
					vr2.currentTime=startTime.value;
					if(loops.checked==true){
							vr1.play();
							vr2.play();
					}
				}
		}
	}
}
//YouTube反復再生
function yt_loop() {
	if (yt_sw==1) {																	//iframeの場合
		pausebutton();
		if(loops.checked==true){
			playbutton();															//YouTube再生開始
		}
	}
}
//再生再開
function replay(set_replay) {
	if (yt_sw==0) {																	//iframe以外
			if (vr_select.checked==false){						//通常のvideo
					if (set_replay===undefined){
							video1.currentTime=repeat_start_time;	//引数なし
							video2.currentTime=repeat_start_time;
						} else {
							video1.currentTime=set_replay;			//引数あり
							video2.currentTime=set_replay;
					}
					setTimeout(function(){						//再生
						video1.play();
					},100);
					setTimeout(function(){
						video2.play();
					},100);
setCurTime();
				} else {										//VR動画
					vr1.currentTime=repeat_start_time;	//再生開始位置セット
					vr2.currentTime=repeat_start_time;
					vr1.play();
					vr2.play();
			}
		} else {																			//YouTub
			if (set_replay==null){
					yt_seek(ytcurrentTime);								//引数なし
				} else {
					yt_seek(set_replay);									//引数あり
			}
			replaybutton();														//再生
	}
}
//再生停止
function stop() {
	if (yt_sw==0) {																			//iframe以外
			if (vr_select.checked==false){												//通常のvideo
					video1.pause();													//動画ファイルの中断
					video2.pause();
					repeat_start_time=video1.currentTime;
				} else {																//VR動画
					vr1.pause();													//VRファイルの中断
					vr2.pause();
					repeat_start_time=vr1.currentTime;
			}
		} else {																			//YouTube
			pausebutton();															//YouTubeの中断
	}
}
//全再生停止
function all_stop() {
	video1.pause();																	//動画ファイルの中断
	video2.pause();
	vr1.pause();																//VRファイルの中断
	vr2.pause();
	player1.pauseVideo();														//YouTubeの中断
	player2.pauseVideo();
}
//左図で操作
function check_start() {
	if (yt_sw==0) {																	//iframe以外
			if (vr_select.checked==false){										//通常のvideo
					video1.pause();													//再生停止
					video2.pause();
					if (left_active.checked == true) {
							left_op=1;
							video1.currentTime=startTime.value;				//再生開始位置セット
							video2.currentTime=startTime.value;
						} else {
							left_op=0;
							$('#video1').attr('loop',false);
							$('#video2').attr('loop',false);
					}
				} else {															//VR動画
					vr1.pause();														//再生停止
					vr2.pause();
					if (left_active.checked == true) {
							left_op=1;
							vr1.currentTime=startTime.value;							//再生開始位置セット
							vr2.currentTime=startTime.value;
						} else {
							left_op=0;
//							$('#video_A_Frame01').attr('loop',false);
//							$('#video_A_Frame02').attr('loop',false);
							vr1.loop=false;
							vr2.loop=false;
					}
			}
		} else {																	//YouTube
			pausebutton();
			if (left_active.checked == true) {
					left_op=1;
				} else {
					left_op=0;
			};
	}
	start();
}
//loop表示
function check_loop(){
	if (yt_sw==0) {																	//iframe以外
			if (vr_select.checked==false){										//通常のvideo
					video1.pause();													//再生停止
					video2.pause();
					if (loops.checked == true) {							//loopさせるとき
							video1.currentTime=startTime.value;					//再生開始位置セット
							video2.currentTime=startTime.value;
							$('#video1').attr('loop',true);
							$('#video2').attr('loop',true);
						} else {											//loopさせないとき
							$('#video1').attr('loop',false);
							$('#video2').attr('loop',false);
					}
//					start();
				} else {
					vr1.pause();												//再生停止
					vr2.pause();
					if (loops.checked == true) {								//loopさせるとき
							vr1.currentTime=startTime.value;				//再生開始位置セット
							vr2.currentTime=startTime.value;
//							$('#video_A_Frame01').attr('loop',true);
//							$('#video_A_Frame02').attr('loop',true);
							vr1.loop=true;
							vr2.loop=true;
						} else {												//loopさせないとき
//							$('#video_A_Frame01').attr('loop',false);
//							$('#video_A_Frame02').attr('loop',false);
							vr1.loop=false;
							vr2.loop=false;
					}
			}
		} else {																	//YouTube
					if (loops.checked == true) {								//loopさせるとき
							iframe1.currentTime=startTime.value;			//再生開始位置セット
							iframe2.currentTime=startTime.value;
							$('#iframeID1').attr('loop',true);
							$('#iframeID2').attr('loop',true);
						} else {												//loopさせないとき
							$('#iframeID1').attr('loop',false);
							$('#iframeID2').attr('loop',false);
					}
	}
}
//動画範囲の幅
function set_width() {
	var w_str=String($('#input_width').val())+"vw";
	if (yt_sw==0) {
			if (street_sw==1) {
					iframe_street =url_Specified;
					iframe_street.width=Math.trunc($("#drop_area").width()*$("#input_width").val()/100.0);
					street_append(iframe_street);
				} else {
					$('#video1').css("width", w_str);
					$('#video2').css("width", w_str);
			}
		}　else {
			$("#iframeId1").css("width", w_str);
			$("#iframeId2").css("width", w_str);
	}
}
//動画範囲の高さ
function set_height() {
	var h_str=String($('#input_height').val())+"vh";
	$('#drop_area').css("height", h_str);
	if (yt_sw==0) {
			if (street_sw==1) {
					iframe_street =url_Specified;
					iframe_street.width=Math.trunc($("#drop_area").width()*$("#input_width").val()/100.0);
					street_append(iframe_street);
				} else {
					$('#video1').css("height", h_str);
					$('#video2').css("height", h_str);
			}
		} else {
			$("#iframeId1").css("height", h_str);
			$("#iframeId2").css("height", h_str);
	}
}
//映像再生
function video_to_show(blobUrl){
	if (vr_select.checked==false){
			yt_sw=0;
			startTime.value=0;
			display_type='video';
			display_choise(display_type);
			$('#video1').attr('src',blobUrl);
			$('#video2').attr('src',blobUrl);
			startTime.value=0;
		} else {
			$('#video_A_Frame01').attr('src',blobUrl);
			$('#video_A_Frame02').attr('src',blobUrl);
	}
//	var select_file=$('#filename').prop('files')[0].name;
	select_file=$('#filename').prop('files')[0].name;
	var tooltip_file2=document.getElementById('filename').value;
	if(tooltip_file2.indexOf("C:\\fakepath\\" || "C:/fakepath/")>-1){
		var tooltip_file3=tooltip_file2.replace(("C:\\fakepath\\" || "C:/fakepath/"),"");
	};
	tooltip_rewrite(tooltip_file3);
	if (vr_select.checked==false){
			video_fileneme=tooltip_file3;
		} else {
			vr_fileneme=tooltip_file3;
	}
}
//iframe再生
function iframe_to_show(blobUrl){
	display_type="iframe";
	display_choise(display_type);
	$('#iframeId1').attr('src',blobUrl);
	$('#iframeId2').attr('src',blobUrl);
//	var select_file=file_input.prop('files')[0].name;
	select_file=file_input.prop('files')[0].name;
	var tooltip_file2=file_input.value;
	if(tooltip_file2.indexOf("C:\\fakepath\\" || "C:/fakepath/")>-1) {
		var tooltip_file3=tooltip_file2.replace(("C:\\fakepath\\" || "C:/fakepath/"),"");
	}
	tooltip_rewrite(tooltip_file3);
	iframe_fileneme=tooltip_file3;
	init_speed();
}
//URIからファイル名の取出
function basename(path) {
	var filename=path.split("/" || "\\").reverse()[0].split('.')[0];		//名前
	var extend=path.split("/" || "\\").reverse()[0].split('.')[1];			//拡張子
	var ret;

	if (extend==""){
			ret=filename;
		} else{
			ret=filename+"."+extend;
	}

	return ret;
}
//映像ファイル名入力(TextBox)
function outer_uri1() {
	url_Specified=textURI.value;
	outer_uri();
//start();
}
//映像ファイル選択(Button>>選択画面)
function outer_uri2() {
	vr_sound.checked=false;
	url_Specified=file_input.value;
	outer_uri();
}
//映像ファイル名orYouTubeURL作成
function outer_uri() {
	var url_Specified_array;
	var yt_num;
	var iframe_streerView='src="https:\/\/www.google.com\/maps\/embed';
	startTime.value="";
	endTime.value="";
//alert("649 url_Specified = "+url_Specified);
	if ((url_Specified.endsWith('.mp4') || url_Specified.endsWith('.mov')|| url_Specified.endsWith('.webm') || url_Specified.endsWith('.ogv')|| url_Specified.endsWith('.html'))==true)
		{																//mp4, mov, webm, ogvの場合
			if (vr_select.checked==true){
					display_type="vr";
					display_choise(display_type);
					vr_filename=basename(url_Specified);
					$('#file_span_id').text(vr_filename);
					input_enabled();
					startTime.value=0;
					street_remove();		//google street 削除
					yt_sw=0;
					drag_and_drop_event(file_drop_area);
					init_speed();
					$('#file_span_id').text(vr_filename);
					const basen =  url_Specified.split('/').pop().split('.').shift();
					if (vr_sound.checked==true){
						check_vr_sound();
					}
				} else {
					input_rotate.visibility='visible';
					display_type="video";
					display_choise(display_type);
					video_filename=basename(url_Specified);
//alert("673 basename(url_Specified) = "+basename(url_Specified));
//alert("673 url_Specified = "+url_Specified);
//alert("674 url_Specified = "$('#file_span_id').text($('#file_span_id')[0].files[0].name));
//$('#file_span_id').text(basename(url_Specified));//$('#file_span_id').text(video_filename.pathname.split('/')[video_filename.pathname.split('/').length-1]);
//$('#file_span_id').text(basename(url_Specified));//$('#file_span_id').text(video_filename.pathname.split('/')[video_filename.pathname.split('/').length-1]);
//$('#file_span_id').text(video_filename.location.pathname.split('/')[video_filename.location.pathname.split('/').length-1]);
//location.pathname;　// パス部分だけ取得
//var paths = location.pathname.split('/');　// スラッシュで分解して配列にする
//var file = location.pathname.split('/')[location.pathname.split('/').length-1]; // 最後の要素を取得する

					input_enabled();
					startTime.value=0;
					street_remove();		//google street 削除
					yt_sw=0;
					drag_and_drop_event(file_drop_area);
					video1.src=url_Specified;
					video2.src=url_Specified;
					init_speed();
			}
		} else {														//<iframe> or YouTubeの埋め込み
			display_type="iframe";
			display_choise(display_type);
			iframe_filename=basename(url_Specified);
			$('#file_span_id').text(iframe_filename);
			if (url_Specified.startsWith('<iframe')==true) {			//<iframe>型の場合
					display_type="iframe";
					display_choise(display_type);
					if (url_Specified.search(iframe_streerView)!==-1) {	//Google Map Street Viewのとき
							startTime.value=null;
							yt_sw=0;
							street_append(url_Specified);
							$('#file_span_id').text("Google Street");
						} else {										//YouTube <iframe>のとき
							street_remove();					//google street 削除
							input_enabled();
							startTime.value=0;
							yt_change_status=0;
							drag_and_drop_event(file_drop_area);
							yt_sw=1;
							url_Specified_array=GetUrlInText(url_Specified);
							url_Specified=url_Specified_array[0];
							ytID0=url_Specified.replace('https:\/\/www.youtube.com\/embed\/','');
							ytID0=ytID0.replace('https:\/\/www.youtube.com\/watch?t=','');
							ytID=ytID0;
							url_Specified=url_Specified.replace('https:\/\/www.youtube.com\/embed\/','');
							$('#file_span_id').text(basename(url_Specified));
							startTime.value=0;
							yt_set();
					}
					startTime.value=0;
				} else {
					yt_sw=1;
					display_type="iframe";
					street_remove();							//google street 削除
					input_enabled();
					startTime.value=0;
					iframe_show();
					input_rotate.visibility='visible';
					if (url_Specified.startsWith('https:\/\/youtu.be\/')==true){	//URL https://youtu.be/型の場合
							ytID0=url_Specified.replace('https:\/\/youtu.be\/','');
							if (ytID0.indexOf('?')==-1 ) {		//動画のURLの場合
									ytID=ytID0;
									startYT=0;
								} else {										//現時点の動画のURLの場合	
									ytID1=ytID0.replace(ytID0.substring(ytID0.indexOf('?t=')+3),'');
									ytID=ytID1.replace('?t=','');
									startYT=ytID0.replace(ytID+'?t=','');
							}
						} else {												//URL www.youtube.com型
							ytID0=url_Specified;
							ytID0=url_Specified.replace('https:\/\/www.youtube.com\/embed\/','');
							ytID0=ytID0.replace('https:\/\/www.youtube.com\/shorts\/','');
							ytID0=ytID0.replace('?feature=share','');
							ytID0=ytID0.replace('https:\/\/www.youtube.com\/watch?v=','');
							ytID=ytID0.replace('https:\/\/www.youtube.com\/watch?v=','');
							if (ytID.indexOf('&')!==-1) {
								ytID=ytID.substring(0, ytID.indexOf('&'));
							}
							if (ytID.indexOf('?')!==-1) {
								ytID=ytID.substring(0, ytID.indexOf('?'));
							}
							ytID0=ytID0.replace(ytID,'');
							ytID0=ytID0.replace('&feature=share','');
							ytID0=ytID0.replace('?t=','');
					$('#file_span_id').text(basename(url_Specified).replace('watch?v=',''));
					}
					startTime.value=0;
					yt_set();
			}
			init_speed();
	}
	check_loop();
	set_width();
	set_height();
	set_start();
	set_end();
}
function yt_set() {
	var k=0;
	drag_and_drop_event(iframe1_area);
	drag_and_drop_event(iframe2_area);
	ytID1=ytID0.replace(ytID,'');
	ytID1=ytID1.replace('?t=','');
	ytID1=ytID1.replace('?v=','');
	startYT=ytID1;
	if (startYT=="" || startYT<0) {
		startYT=0;
	}
	$('#file_span_id').text(ytID);
	if (loops.checked==true) {
			onPlayerReady1();
			onPlayerReady2();
			player1.loop=1;
			player2.loop=1;
		} else {
			player1.videoId=ytID;
			player2.videoId=ytID;
			player1.loop=0;
			player2.loop=0;
			player1.pauseVideo();
			player2.pauseVideo();
	}
	movie_time=player1.getDuration();
	startTime.value=startYT;
	if (endTime.value==""){
		endTime.value=movie_time;
	}
	drag_and_drop_event(iframe1_area);
	drag_and_drop_event(iframe2_area);
	rotation();
	display_type="iframe";
	display_choise(display_type);
	check_loop();
}
// ドラッグ&ドロップエリアのイベント
function drag_and_drop_event(file_area) {
	file_area.removeEventListener('drop', drop_func);
	file_area.addEventListener('drop', drop_func);			//ドロップ
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
//file読み込み
function readfile_func(readfile){
	readfile.preventDefault();
	var files=readfile.dataTransfer.files;					//ファイル取得
	file_input.files=files;									//取得ファイル→input[type=file]
	URL.revokeObjectURL(blobUrl);
	blobUrl=window.URL.createObjectURL(files[0]);
	if(typeof files[0] !== 'undefined') {					//ファイル取得成功ならvideoを表示
		const reader = new FileReader();
		yt_sw=0;
		video_to_show(blobUrl);
	}
}
//menu一時消去
function check_menu(){
	$('#set').toggle();
	$('#damy_margin1').toggle();
	$('#damy_margin2').toggle();
	$('#ending_text').toggle();
}
//再生継続時間
function playback_duration(){
 //alert("866 endTime.value = "+endTime.value);
	if (yt_sw==0) {
			var videoElem = document.getElementById('video1');
			videoElem.addEventListener('loadedmetadata', function() {
//				endTime.value=videoElem.duration;
				movie_time=endTime.value;
			})
		} else {
			startTime.value=startYT;
			movie_time=endTime.value;
	}
}
//再生開始時刻セット
function preset_startTime(preset_start) {
	if (parseFloat(preset_start)<0){
			startTime.value=0;
		} else {
			if (parseFloat(startTime.value)<parseFloat(preset_start)){
				startTime.value=parseFloat(preset_start);
			}
	}
	if (parseFloat(startTime.value)>parseFloat(endTime.value)){
		startTime.value=parseFloat(endTime.value)-1.0;
	}
}
//再生終了時刻セット
function preset_endTime(preset_end) {
//alert("892 preset_end, endTime.value = "+preset_end+", "+endTime.value);
	if (parseFloat(endTime.value)>=parseFloat(preset_end)){
//alert("892 preset_end = "+preset_end);
		endTime.value=parseFloat(preset_end);
	}
	if (parseFloat(endTime.value)<parseFloat(startTime.value)){
		endTime.value=parseFloat(startTime.value)+1.0;
	}
}
//iframe表示
function iframe_show() {
	$('#iframeId1').show();
	$('#iframeId2').show();
	iframe_set_leave();
document.getElementById("input_rotate_title").style = "color:black";
document.getElementById("input_rotate").disabled = false;
document.getElementById("end_time_title").style = "color:black";
document.getElementById("end_time").disabled = false;
document.getElementById("checkbox0").disabled = false;
document.getElementById("checkbox0_title").style = "color:black";
document.getElementById("speed_title").style = "color:black";
document.getElementById("speed_range").disabled = false;
document.getElementById("speed_x").style = "color:black";
document.getElementById("speed_number").style = "color:black";
document.getElementById("video_A_Frame01").muted=true;
document.getElementById("video_A_Frame02").muted=true;
}
//video表示
function video_show() {
	$('#video1').show();
	$('#video2').show();
	video_set_leave();
document.getElementById("input_rotate_title").style = "color:black";
document.getElementById("input_rotate").disabled = false;
document.getElementById("end_time_title").style = "color:black";
document.getElementById("end_time").disabled = false;
document.getElementById("checkbox0").disabled = false;
document.getElementById("checkbox0_title").style = "color:black";
document.getElementById("speed_title").style = "color:black";
document.getElementById("speed_range").disabled = false;
document.getElementById("speed_x").style = "color:black";
document.getElementById("speed_number").style = "color:black";
document.getElementById("video_A_Frame01").muted=true;
document.getElementById("video_A_Frame02").muted=true;
}
//vr表示
function vr_show() {
document.getElementById("input_rotate_title").style = "color:gray";
document.getElementById("input_rotate").disabled = true;
document.getElementById("end_time_title").style = "color:gray";
document.getElementById("end_time").disabled = true;
document.getElementById("checkbox0").disabled = true;
document.getElementById("checkbox0_title").style = "color:gray";
document.getElementById("a-scene1").style.display='block';
document.getElementById("a-scene2").style.display='block';
document.getElementById("checkbox4").checked=false;
document.getElementById("speed_title").style = "color:gray";
document.getElementById("speed_range").disabled = true;
document.getElementById("speed_x").style = "color:gray";
document.getElementById("speed_number").style = "color:gray";
document.getElementById("video_A_Frame01").muted=true;
document.getElementById("video_A_Frame02").muted=true;
}
//google street表示
function street_append(iframe_street) {
	startTime.value=null;
	street_remove();
	street_sw=1;
	iframe_street=iframe_street.replace('width="600"','width='+Math.trunc($("#drop_area").width()*$("#input_width").val()/100.0)+'"');
	iframe_street=iframe_street.replace('height="450"','height='+Math.trunc($("#drop_area").height()*$("#input_height").val()/100.0)+'"');
	iframe_street=iframe_street.replace('<iframe ','<iframe id="street1" ')
	$('#span_11').append(iframe_street);
	iframe_street=iframe_street.replace('id="street1"','id="street2"')
	$('#span_12').append(iframe_street);
}
//iframe非表示
function iframe_hide() {
	$('#iframeId1').hide();
	$('#iframeId2').hide();
}
//video非表示
function video_hide() {
	video1.pause();							//動画ファイルの中断
	video2.pause();
	video1.muted=true;
	video2.muted=true;
	$('#video1').hide();
	$('#video2').hide();
}
//vr非表示
function vr_hide() {
	document.getElementById("a-scene1").style.display='none';
	document.getElementById("a-scene2").style.display='none';
	document.getElementById("speed_range").disabled = false;
}
//google street削除
function street_remove() {
	street_sw=0;
	startTime.value=0;
	$('#street1').remove();
	$('#street2').remove();
}
//video再生開始位置のクリックイベント
function video_set_leave() {
	video1.addEventListener('mouseleave', (event) => {
		if (left_active.checked==true) {
			if ((parseInt(video2.currentTime)!==parseInt(video1.currentTime))) {
				startTime.value=parseInt(video1.currentTime);
			}
			video1.currentTime=startTime.value;
			video2.currentTime=startTime.value;
			start();
		}
	})
}
//iframe再生開始位置のクリックイベント
function iframe_set_leave() {
	iframe1_area.addEventListener('mouseleave', (event) => {
		if (left_active.checked==true) {
			if (parseInt(player2.getCurrentTime())!==parseInt(player1.getCurrentTime())) {
				startTime.value=parseInt(player1.getCurrentTime());
			}
			player1.seekTo(startTime.value);
			player2.seekTo(startTime.value);
			start();
		}
	})
}
//vr再生開始位置のクリックイベント
function vr_set_leave() {
	vr1_a_scene.addEventListener('mouseleave', (event) => {
		if (left_active.checked==true) {
			if ((parseInt(vr2_a_scene.currentTime)!==parseInt(vr1_a_scene.currentTime))) {
				startTime.value=parseInt(vr1_a_scene.currentTime);
			}
			vr1_a_scene.currentTime=startTime.value;
			vr2_a_scene.currentTime=startTime.value;
			start();
		}
	})
}
//動画操作要素表示
function input_enabled() {
	$(".video_parameter").prop("disabled", false);
	$('.video_parameter').css('color','black');
}
//動画操作要素非表示
function input_disabled() {
	startTime.value="";
	endTime.value="";
	$(".video_parameter").prop("disabled", true);
	$('.video_parameter').css('color','Gray');
}
//ondropイベント
// (引用)
// alphasis(2017):ondropイベント, JavaScriptリファレンス, http://alphasis.info/2014/03/javascript-dom-event-ondrop/
function sampleADrop( $event, $this ){
	var $data = $event.dataTransfer.getData( "Text" );
	if ($data!=='') {
		url_Specified=$data;
		outer_uri();
		start();
	}
}
//VR動画の指定
function check_vr(){
all_stop();
	yt_sw=0;
	if(vr_select.checked==true) {						//VRの場合
			previous_type=display_type;
			display_type="vr";
			endTime_non_VR=endTime.value;
			endTime.value="";
			checkbox4.disabled=true;
			checkbox4_title.color="gray";
			input_width.disabled=true;
			input_width_title.color="gray";
			input_height.disabled=true;
			input_height_title.color="gray";
			$('#file_span_id').text(vr_filename.replace("C:\\fakepath\\",""));
		} else {
			display_type=previous_type;
			endTime.value=endTime_non_VR;
			checkbox4.disabled=false;
			checkbox4_title.color="";
			input_width.disabled=false;
			input_width_title.color="black";
			input_height.disabled=false;
			input_height_title.color="black";
					if (display_type=="video"){			//videoの場合
							yt_sw=0;
							$('#file_span_id').text(video_filename.replace("C:\\fakepath\\",""));
						} else {											//iframeの場合
							display_type="iframe";
							yt_sw=1;
							$('#file_span_id').text(iframe_filename.replace("watch?v=",""));
					}
	}
	display_choise(display_type);
}
//VR動画音声の出力
function check_vr_sound(){
	if((vr_select.checked==true)&&(vr_sound.checked==true)) {
			vr1.muted=false;
		} else {
			vr1.muted=true;
	}
}
//URL抽出
// (参考・引用)
// ginpei(2007):文字列中のURLを探してリンクにするJavaScript, https://ginpei.hatenablog.com/entry/20070811/1186846446
// Sato, K. (2019):[JavaScript] テキスト文字列からURLを検索し取得する, https://noknow.info/it/javascript/get_url_from_text_string?lang=ja
function GetUrlInText(text) {
	const matches = text.match(/((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g);
	if(matches != null) {
			return matches;
		} else {
			return [];
	}
}
//映像の表示選択
function display_choise(disp_type) {
	stop();
	vr1.muted=true;
	switch (disp_type){
		case 'video':
			video_show();
			iframe_hide();
			vr_hide();
			vr_select.checked=false;
			vr_sound.disabled=true;
			checkbox4_title.color="gray";
		break;
		case 'iframe':
			video_hide();
			iframe_show();
			vr_hide();
			vr_select.checked=false;
			vr_sound.disabled=true;
			checkbox4_title.color="gray";
		break;
		case 'vr':
			video_hide();
			iframe_hide();
			vr_show();
			vr_select.checked=true;
			vr_sound.disabled=false;
			checkbox4_title.color="black";
			break;
		default:
		console.log('表示はその他です');
	}
stop();
}
//-----------------------------------------------------------add 20251008
function setCurTime() {
//		video1.play();
//		video2.play();
//		repeat_start_time = 5; //再生開始位置
//		stopTime = 15; //再生停止位置
//		startTime = document.getElementById("start_time").value; //再生開始位置
	if (yt_sw==0) {																	//iframe以外
		repeat_start_time = document.getElementById("start_time").value; //再生開始位置
		stop_time  = document.getElementById("end_time").value;   //再生停止位置
		video1.addEventListener("timeupdate", function(){
			currentTime = this.currentTime; //再生位置
			if( stop_time <= currentTime) { //もしも再生停止位置以上になったら
				video1.pause(); // いったん再生を止めて
				video2.pause();
				video1.currentTime = repeat_start_time; //再生開始位置をセットしてから
				video2.currentTime = repeat_start_time;
				video1.play(); //再生する
				video2.play();
			}
		});
	} else {																	//YouTube
//再生開始時刻設定
			player1.cueVideoById({
				videoId:ytID,
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
			player2.cueVideoById({
				videoId:ytID,
				playlist: ytID, // 再生する動画のリスト
				startSeconds: startTime.value,
				endSeconds: endTime.value
			});
			if (startTime.value=="") {
				startTime.value=0;
				startYT=startTime.value;
			}
/*			if (endTime.value!==player1.getDuration()) {
				endTime.value=player1.getDuration();
				endYT=endTime.value;
			}
*/

//再生終了時刻設定
	stop();
preset_endTime(endTime.value);
			endYT=endTime.value;
//alert("322 endYT = "+endYT);
			player1.cueVideoById({
				videoId:ytID,
				playlist: ytID,													//再生する動画のリスト
				startSeconds: startTime.value,
//				endSeconds: endTime.value
				endSeconds: endYT
			});
//alert("330 endYT = "+endYT);
			player2.cueVideoById({
				videoId:ytID,
				playlist: ytID,													//再生する動画のリスト
				startSeconds: startTime.value,
//				endSeconds: endTime.value
				endSeconds: endYT
			});
			
//endTime.value=endYT;
//alert("341 endYT = "+endYT);
endTime.value=endYT;

	}
}
