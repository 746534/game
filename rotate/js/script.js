window.onload = function () {
	//获取页面上的dd和dl
	var dds = document.getElementsByTagName('dd');
	var dl = document.getElementsByTagName('dl')[0];
	console.log(dds)
	//设置显示页面x轴顺时针旋转10度
	dl.style.transform = "rotateX(-10deg) rotateY(0deg)";
	//添加阴影显示效果
	for (var i = 0; i < dds.length; i++) {
		//创建阴影显示大盒子元素
		var inverteds = document.createElement('div');
		//创建阴影显示小盒子元素
		var inverted = document.createElement('div');
		//创建阴影显示图片元素
		var img = document.createElement('img');
		//让显示图片跟阴影图片对应
		img.src = dds[i].getElementsByTagName('img')[0].src;

		inverted.appendChild(img);
		//添加inverted类名
		inverted.className = 'inverted';
		inverteds.appendChild(inverted)
		//添加inverteds类名
		inverteds.className = 'inverteds';
		dds[i].appendChild(inverteds);
	}
	deal(dds, dds.length - 1);
	//鼠标点击移动位置
	window.onmousedown = function (e) {
		e = e || window.event;
		//获取鼠标初始位置
		var mouseX = e.clientX, mouseY = e.clientY;
		var transform = dl.style.transform;
		console.log(transform.indexOf('rotateY('))
		console.log(transform.substr(24))
		//拆分获取到的transform的初始位置的值
		var rotateX = transform.substr(transform.indexOf('rotateX(') + 8);
		var rotateY = transform.substr(transform.indexOf('rotateY(') + 8);

		// console.log(rotateX)
		//拿到拆分好的值
		rotateX = parseInt(rotateX.substring(0, rotateX.indexOf('deg')));
		console.log(rotateX)
		rotateY = parseInt(rotateY.substring(0, rotateY.indexOf('deg')));
		//移动事件
		window.onmousemove = function (e) {
			e = e || window.event;
			//e.clientY - mouseY 鼠标移动位置
			// console.log("当前鼠标",e.clientY)
			// console.log("点击鼠标",mouseY)
			//计算移动的距离
			var x = rotateX - (e.clientY - mouseY);
			var y = rotateY + (e.clientX - mouseX);
			//判断是否旋转一圈
			if (x > 360 || x < -360)
				x %= 360;
			if (y > 360 || y < -360)
				y %= 360;
			//设置dl旋转角度
			dl.style.transform = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
		}
		//鼠标弹起不是
		window.onmouseup = function () {
			window.onmousemove = null;
		}
	}
	//盒子初始移动位置
	function deal(dds, n) {

		var speed = 100;
		//z轴的偏移量
		var translateZTerminus = 400;
		// console.log(dds.length,n)
		//图片的y轴旋转角度
		var angle = 360 / dds.length * n;//36*9 324
		var translateZ = 0;
		var rotateY = 0;
		var time = setInterval(function () {
			//计算z轴位移步长
			translateZ += translateZTerminus / speed * 10;//40
			//计算y轴旋转的步长
			rotateY += angle / speed * 10;//32.4+0  32.4
			//改变位置
			dds[n].style.transform = 'rotateY(' + rotateY + 'deg) translateZ(' + translateZ + 'px)';
			//判断如果达到目标值
			if (rotateY >= angle && translateZ >= translateZTerminus) {
				clearInterval(time);
				//达到目标值设置位置
				dds[n].style.transform = 'rotateY(' + angle + 'deg) translateZ(' + translateZTerminus + 'px)';
				//递归单个移动
				if (n > 0)
					deal(dds, n - 1);
			}
		}, 10);
	}
}