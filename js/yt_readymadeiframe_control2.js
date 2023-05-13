/*
	yt_readymadeiframe_control2.js				2022. 2. 8. coded by K. RYOKI
												2023. 5. 5. improved
	
	(引用文献)
中村享世(2021):YouTube IFrame Player APIの使い方 2021, https://tech.arms-soft.co.jp/entry/2021/07/21/090000 (2022.8.13. 閲覧)
*/

// IFrame Player API の読み込みタグを挿入

var tag = document.createElement('script');							// scriptタグを生成
tag.src = "https://www.youtube.com/iframe_api";						// APIのURLを付与
var firstScriptTag = document.getElementsByTagName('script')[0];	// 生成したタグをセット
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);		// HTML上に挿入
// 関数onYouTubeIframeAPIReadyでYoutubeプレイヤーを作成
var player1;
var player2;
var players={
	start: 0,
	end: 0
};
var currentTime;
var x=false;

function onYouTubeIframeAPIReady() {
	player1 = new YT.Player('iframeId1', {
		videoId: '',
		events: {
			onReady: onPlayerReady1,
			onStateChange: onPlayerStateChange1
		}
	});
	player2 = new YT.Player('iframeId2', {
		videoId: '',
		events: {
			onReady: onPlayerReady2,
			onStateChange: onPlayerStateChange2
		}
	});
}
// 動画の操作
function pausebutton() {
	currentTime=player1.getCurrentTime();
	player1.pauseVideo();
	player2.pauseVideo();
}
function playbutton() {
	currentTime=startTime.value;
	if　(endTime.value=="") {
			endTime.value=player1.getDuration();
		} else {
			preset_endTime(player1.getDuration());
	}
	replaybutton();
}
function replaybutton() {
	if (currentTime<=endTime.value) {
			yt_seek(currentTime);
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
function onPlayerReady1(event) {
	event.target.mute();
	movie_time=player1.getDuration();
	endTime.value=movie_time;
	player1.cueVideoById({
		videoId:ytID,
		playlist: ytID, // 再生する動画のリスト
		startSeconds: startTime.value,
		endSeconds: endTime.value
	});
}
function onPlayerReady2(event) {
	event.target.mute();
	player2.cueVideoById({
		videoId:ytID,
		playlist: ytID, // 再生する動画のリスト
		startSeconds: startTime.value,
		endSeconds: endTime.value
	});
}
function onPlayerStateChange1(event) {
	var ytStatus = event.target.getPlayerState();
	movie_time=player1.getCurrentTime();
	if (ytStatus==2 && parseInt(movie_time) !== 0) {
		startTime.value=movie_time;
	}
	player2.seekTo(movie_time);
	if (ytStatus == YT.PlayerState.ENDED) {		// 再生終了したとき
		if (loops.checked==true) {
			player1.startSeconds=startTime.value;
			player1.endSeconds=endTime.value;
			player2.startSeconds=startTime.value;
			player2.endSeconds=endTime.value;
			player1.seekTo(startTime.value);
			player2.seekTo(startTime.value);
			player1.playVideo();
			player2.playVideo();
		}
	}

}
function onPlayerStateChange2(event) {
}
function yt_url() {
	const text=$("#text_uri").val();
	const matches = text.toString().match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/:\@&=+\$,%#]+/g);
	if(matches != null) {
		$("#text_uri").val(matches);
		return matches;
	}
}
