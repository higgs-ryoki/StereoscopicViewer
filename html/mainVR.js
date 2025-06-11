"use strict";

// Window
window.onload = (e)=>{
	const video01 = document.getElementById("video_A_Frame01");
	const video02 = document.getElementById("video_A_Frame02");
//	const btn01 = document.getElementById("my_btn01");
//	const btn02 = document.getElementById("my_btn02");
	const draw_All = document.getElementById("draw_area");
/*
	btn01.addEventListener("click", (e)=>{
//check_vr();
		if(video01.paused){
				video01.play();
				e.target.setAttribute("src", "#img_play");
			}else{
				video01.pause();
				e.target.setAttribute("src", "#img_pause");
		}
	});
function check_vr(){
	video01.pause();
}
	btn02.addEventListener("click", (e)=>{
		if(video02.paused){
				video02.play();
				e.target.setAttribute("src", "#img_play");
			}else{
				video02.pause();
				e.target.setAttribute("src", "#img_pause");
		}
	});
*/
	draw_All.addEventListener("click", (e)=>{
//check_vr();
		if(video01.paused){
				video01.play();
				video02.play();
//				e.target.setAttribute("src", "#img_play");
			}else{
				video01.pause();
				video02.pause();
//				e.target.setAttribute("src", "#img_pause");
		}
//		if(video02.paused){
//				video02.play();
//				e.target.setAttribute("src", "#img_play");
//			}else{
//				video02.pause();
//				e.target.setAttribute("src", "#img_pause");
//		}
	});
}
