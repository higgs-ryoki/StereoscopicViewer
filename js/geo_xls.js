//ヒュベニの式を用いた、緯度・経度と距離・方位の相互変換の解説
//	M,Yokota　(2014/2/22)
//		http://hp.vector.co.jp/authors/VA002244/yacht/geo.htm
//		http://hp.vector.co.jp/authors/VA002244/yacht/geo.pdf
//
//			translated Excel VBA to JavaScript by K.,RYOKI(2022.7.27.)
//
//
//多精度計算化の引用文献
/// <reference path="./konpeito.d.ts" />
//		JavaScriptの数値計算ライブラリkonpeito (なたで, 2020):
//			https://blog.natade.net/2020/02/16/javascript-math-library/
//			https://github.com/natade-jp/konpeito/releases
//----------------------------------------------------------------
//i0：出発点緯度（度）
//k0：出発点経度（度）
//d ：目標点距離（ｍ）
//a ：目標点方位（度）
//di：緯度偏移（ラジアン） di=d*cos(a*π/180)/M
//dk：経度偏移（ラジアン） dk=d*sin(a*π/180)/(N*cos(I))
//（注）角度、緯度経度の小文字（a,i,j）の単位:度、大文字（A,I,K）の単位:ラジアン
const Pi=Math.PI;								//円周率π
const Rx=6378137.0;								//赤道半径(m)
const E2=6.69437999019758E-03;					//第2離心率(e^2)
function ido(i0, k0, d, a){			//出発点から距離d、方位a地点の緯度（度）
	//i0：出発点緯度（度）,k0：出発点経度（度）,d ：目標点距離（ｍ）,a ：目標点方位（度）
	const WT= Math.sqrt(1.0-E2*Math.sin(i0*Pi/180.0)^2.0);	//仮のW（第１近似）
	const MT=Rx*(1.0-E2)/WT^3.0;				//仮のM（第１近似）
	const diT=d*Math.cos(a*Pi/180.0)/MT;			//仮のdi（第１近似）
	const I=Number(i0*Pi/180.0)+Number(diT/2);
	const W=Math.sqrt(1.0-E2*Math.sin(I)^2);
	const M=Rx*(1.0-E2)/W^3.0;
	const dI=d*Math.cos(a*Pi/180.0)/M;
	return Number(dI*180.0/Pi)+Number(i0);
}
function keido(i0, k0, d, a) {		//出発点から距離d、方位a地点の経度（度）
	//i0：出発点緯度（度）,k0：出発点経度（度）,d：目標点距離（ｍ）,a：目標点方位（度）
	const WT=Math.sqrt(1.0-E2*Math.sin(i0*Pi/180.0)^2.0);	//仮のW（第１近似)
	const MT=Rx*(1.0-E2)/WT^3.0;				//仮のM（第１近似）
	const diT=d*Math.cos(a*Pi/180.0)/MT;			//仮のdi（第１近似）
	const I=Number(i0*Pi/180.0)+Number(diT/2.0);
	const W=Math.sqrt(1.0-E2*Math.sin(I)^2.0);
	const N=Rx/W;
	const dk=d*Math.sin(a*Pi/180.0)/(N*Math.cos(I));
//console.log(i0, k0, d, a,WT,MT,diT,I,W,N,dk,result_keido);
	return Number(dk*180.0/Pi)+Number(k0);
}
/*
function keido(i0, k0, d, a) {		//出発点から距離d、方位a地点の経度（度）
	//i0：出発点緯度（度）,k0：出発点経度（度）,d：目標点距離（ｍ）,a：目標点方位（度）
//const Fraction = konpeito.Fraction;
//const sin = konpeito.sin;
const ksin = ""+konpeito.BigDecimal.create(i0).mul(konpeito.BigDecimal.PI)
.div(180.0).sin().pow(2.0).mul(0.01).sqrt();
alert(ksin);
	const WT=konpeito.sqrt(BigNumber(0.01).sub(BigNumber(BigNumber(E2).times(konpeito.BigDecimal(BigNumber(BigNumber(i0).times(Pi)).div(180.0)).sin()).pow(2.0))));	//仮のW（第１近似)
console.log(WT);
	const MT=Rx*(1.0-E2)/WT^3.0;				//仮のM（第１近似）
	const diT=d*Math.cos(a*Pi/180.0)/MT;			//仮のdi（第１近似）
	const I=Number(i0*Pi/180.0)+Number(diT/2.0);
	const W=Math.sqrt(1.0-E2*Math.sin(I)^2.0);
	const N=Rx/W;
	const dk=d*Math.sin(a*Pi/180.0)/(N*Math.cos(I));
//console.log(i0, k0, d, a,WT,MT,diT,I,W,N,dk,result_keido);
	return Number(dk*180.0/Pi)+Number(k0);
}
*/

//ヒュベニの公式 2点間の距離 d=sqr((dI*M)^2+(dK*N*cos(I))^2)
//dI：２点の緯度の差
//dK：２点の経度の差
//I ：２点の緯度の平均
//WGS84 (GPS)の定数
//Rx:赤道半径(m) 6378137.0000000
//E2:離心率(e^2) 0.00669437999019758000
//I ：２点の緯度の平均（ラジアン）
//W ：子午線・卯酉線曲率半径の分母 W= sqr(1-E2*sin(I)^2)
//M ：子午線曲率半径 M= Rx(1-E2)/W^3
//N ：卯酉線曲率半径 N= Rx/W
function Dist(i0, k0, i1, k1) {		//Dist：２点の距離（ｍ）
	//i0：出発点緯度（度）,k0：出発点経度（度）,i1：到達点緯度（度）,k1：到達点経度（度）
	const di=(i1-i0);
	const dk=(k1-k0);
	const i=(Number(i0)+Number(i1))/2;
	const W=Math.sqrt(1-E2*Math.sin(i*Pi/180)^2);
	const M=Rx*(1-E2)/W^3;
	const N=Rx/W;
	const result_Dist=Number(Math.sqrt(((di*Pi/180*M)^2))+Number(dk*Pi/180*N*Math.cos(i*Pi/180))^2);
	return result_Dist;
}
function Dir(i0, k0, i1, k1) {		//Dir：出発点からみた到達点の方位（度）
	//i0：出発点緯度（度）,k0：出発点経度（度）,i1：到達点緯度（度）,k1：到達点経度（度）
	const di=(i1- i0);
	const dk=(k1-k0);
	const i=(Number(i0)+Number(i1))/2;
	const W=Math.sqrt(1-E2*Math.sin(i*Pi/180)^2);
	const M=Rx*(1-E2)/W^3;
	const N=Rx/W;
	const ddI=di*Pi/180*M;
	const ddK=dk*Pi/180*N*Math.cos(i*Pi/180);
	let a_Dir=(Number(Math.atan2(ddK,ddI)*180/Pi)+Number(360));
	if (a_Dir>=360){a_Dir-=360;};
	return a_Dir;
}