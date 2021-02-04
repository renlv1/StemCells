/*eslint-disable*/
export function MP() {
	let ak = 'NqYwtHbrPbvKFAorAUdrYcvIwg3f1qAt'
	return new Promise(function (resolve, reject) {
		window.init = function () {
			resolve(BMap)
		}
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
		script.onerror = reject;
		document.head.appendChild(script);
	})

}
