/*
	yt_readymadeiframe_control2.js				2022. 2.25. coded by K. RYOKI
	                              				2023.10.22. improved
	
	(引用文献)
	中村享世(2021):YouTube IFrame Player APIの使い方 2021, https://tech.arms-soft.co.jp/entry/2021/07/21/090000 (2022.8.13. 閲覧)
*/

// IFrame Player API の読み込みタグを挿入
var tag = document.createElement('script');                     	// scriptタグを生成
tag.src = "https://www.youtube.com/iframe_api";                 	// APIのURLを付与
var firstScriptTag = document.getElementsByTagName('script')[0];	// 生成したタグをセット
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);    	// HTML上に挿入

// 関数onYouTubeIframeAPIReadyでYoutubeプレイヤーを作成
var players={
	start: 0,
	end: 0
};
var ytcurrentTime;
var yt_startTime;
var x=false;
var playbutton_sw=0;
var player1;
var player2;

//Youtube用iframeの作成
function onYouTubeIframeAPIReady() {
	player1 = new YT.Player('iframeId1', {	//左図
		playerVars: {
			'autoplay': 0,
			'mute': 1,
			'clipboard-write': 1,
			'fs': 0,
			'modestbranding':1,
			'accelerometer': 1,
			'encrypted-media':1,
			'gyroscope': 1,
			'allowfullscreen': 0
		},
		events: {
			onReady: onPlayerReady1,
			onStateChange: onPlayerStateChange1
		}
	});
	player2 = new YT.Player('iframeId2', {	//右図
		playerVars: {
			'autoplay': 0,
			'mute': 1,
			'clipboard-write': 1,
			'fs': 0,
			'modestbranding':1,
			'accelerometer': 1,
			'encrypted-media':1,
			'gyroscope': 1,
			'allowfullscreen': 0
		},
		events: {
			onReady: onPlayerReady2,
			onStateChange: onPlayerStateChange2
		}
	});
}
// 動画の操作
function pausebutton() {
	ytcurrentTime=player1.getCurrentTime();
	player1.pauseVideo();
	player2.pauseVideo();
}
function playbutton() {
	if (yt_sw==1) {
		if (startTime.value=="") {startTime.value=0;}
		yt_startTime=startTime.value;
		if ((endTime.value=="") && (playbutton_sw==0)) {
				endTime.value=player1.getDuration();
				playbutton_sw=1;
			} else {
				preset_endTime(player1.getDuration());
		}
		player1.seekTo(yt_startTime);
		player2.seekTo(yt_startTime);
		player1.playVideo();
		player2.playVideo();
		player2.playVideo();
	}
}
function replaybutton() {
	if (ytcurrentTime<=endTime.value) {
			yt_seek(ytcurrentTime);
		} else {
			yt_seek(startTime.value);
	}
	player1.setPlaybackRate(parseFloat(speed_number.value));
	player2.setPlaybackRate(parseFloat(speed_number.value));
	player1.playVideo();
	player2.playVideo();
}
function yt_seek(seekTime) {
	player1.seekTo(seekTime);
	player2.seekTo(seekTime);
}
function onPlayerReady1() {
	player1.cueVideoById({
		videoId:ytID,
		playlist: ytID // 再生する動画のリスト
	});
	playbutton_sw=0;
}
function onPlayerReady2() {
	player2.cueVideoById({
		videoId:ytID,
		playlist: ytID // 再生する動画のリスト
	});
	playbutton_sw=0;
	player2.autoplay=0;
}
function onPlayerStateChange1(event) {
	var ytStatus = event.target.getPlayerState();
	if (ytStatus == YT.PlayerState.UNSTARTED) {		// 未再生のとき
	}
	movie_time=player1.getCurrentTime();
	if (ytStatus==YT.PlayerState.PAUSED && parseInt(movie_time) !== 0) {
		ytcurrentTime=movie_time;
	}
	if (ytStatus == YT.PlayerState.ENDED) {		// 再生終了したとき
		if (loops.checked==true) {
			player1.startSeconds=startTime.value;
			player1.endSeconds=endTime.value;
			player2.startSeconds=startTime.value;
			player2.endSeconds=endTime.value;
			player1.seekTo(startTime.value);
			player2.seekTo(startTime.value);
		}
	}
	if (ytStatus==YT.PlayerState.CUED) {
		endTime.value=player1.getDuration();
	}
	if (endTime.value=="") {
		endTime.value=player1.getDuration();
	}
}
function onPlayerStateChange2(event) {
}
function yt_url() {
	const text=textURI.val();
	const matches = text.toString().match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/:\@&=+\$,%#]+/g);
	if(matches != null) {
		textURI.val(matches);
		return matches;
	}
}

