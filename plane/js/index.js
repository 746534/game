$(function(){
	// 开始按钮
	var btn = $('button');

	//游戏页面  使用jq 获取节点
	var game =$('.game');
	// 获取透明层
	var layout = $('.layout');

	// 我方飞机 
	var plan = $('.plan');
	myWidth = plan.width();
	myHeight = plan.height();

	// 鼠标的坐标
	var x,y;

	// 飞机的左上角坐标
	var planX;
	var planY;

	//飞机的移动距离  最小为0  最大为 页面宽度 - 飞机宽度
	var maxX = game.width() - myWidth;
	var maxY = game.height() - myHeight;



	// plan.position().top,plan.position().left 只读

	var bgy = 0; //背景图片在Y轴上的偏移

	// 计时器
	var bgInterval = null;
	var createBulletInterval = null;
	var moveBulletInterval = null;

	// 创建每一个敌方飞机的计时器
	var createEveryEnemyInterval = null;

	//创建移动子弹的计时器
	var moveEveryEnemyInterval = null;
	

	//给 开始游戏 按钮  绑定一个点击事件
	$('button').click(function(){
		// body....
		$('.star').hide(); //开始页面隐藏  .hide()
		game.show(); //游戏页面显示  .show()

		// 调用背景偏移的方法
		movebg();
		
		// 调用鼠标事件的方法
		movemouse();

		//调用创建子弹的方法
		createEveryBullet();
		// //调用移动子弹的方法
		moveEveryBullet()

		// //调用创建敌方飞机的方法
		createEveryEnemy()

		// //调用移动敌方飞机的方法
		moveEveryEnemy();



	});

	// 定义一个背景偏移 的方法
	function movebg(){
		// 计时器
		bgInterval = setInterval(function(){
			if(bgy==game.height()){
				bgy=0;
			}
			// 背景图片移动2像素
			bgy+=2;
			game.css('background-position-y',bgy+'px');
		},5)
	};


	// 鼠标移动事件
	function movemouse(){
		layout.mousemove(function(e){    //=> 事件对象e
		x = e.offsetX;   //拿到鼠标X坐标
		y = e.offsetY;	 //拿到鼠标Y坐标

	/*把飞机的中点挪动到鼠标位置*/
		planX = x - myWidth/2;   
	    planY = y -myHeight/2;	

	    // 边界控制  => 三目运算 or 三元运算
	    // 判断语句 ？ true : false 


	    //飞机左边是否小于0 ？0 ： 飞机左边是否大于最大宽度 ？ 最大宽度 ： 原本的值 ；
		planX = planX < 0 ? 0 : planX > maxX ? maxX : planX;

		planY = planY < 0 ? 0 : planY > maxY ? maxY : planY;

		// 移动飞机  .css() 用于设置 更改样式
		plan.css({
			left:planX +'px' ,
			top:planY +'px'
		})

	})
	}
	


	// 构造函数  面向对象 => 封装  继承  多态
	// 子弹类 抽象的 初始化
	function Bullet (){
		// 每颗子弹都有的属性
		// 子弹宽高
		this.bulletWidth = 8;
		this.bulletHeight =14;

		//子弹移动坐标
		this.bulletX = 0;
		this.bulletY = 0;

		// 子弹的DOM元素
		this.currentBullet = null;

		//子弹图片路径
		this.bulletSrc = './images/bullet.png'
	}
	// 在构造函数里面  挂载一个 原型方法 （创建子弹）
	Bullet.prototype.createBullet = function(){
		// 创建一个图片标签
		this.currentBullet = document.createElement('img');
		// 把img标签 转换为 jQuery 对象


		//设置子弹的坐标  先拿到我方飞机的 左上角位置
		var myPlanX = plan.position().left;
		var myPlanY = plan.position().top;

		// 子弹创建的位置
		this.bulletX = myPlanX + myWidth/2 - this.bulletWidth/2;
		// this.bulletY = myPlanY - this.bulletWidth;
		this.bulletY = myPlanY - this.bulletHeight;


		$(this.currentBullet).css({
			'width':this.bulletWidth,
			'height':this.bulletHeight,
			'position':'absolute',
			'left': this.bulletX,
			'top':this.bulletY
		}).attr('src',this.bulletSrc);
		// 把创建出来的img标签，放到game view中
		game.append(this.currentBullet);
	}

	//在构造函数里面  挂载一个 原型方法 （移动子弹）
	Bullet.prototype.moveBullet = function(index){
		//让子弹每次移动两个像素
		this.bulletY -= 2;
		
		//如果子弹超出页面顶部时  移除子弹 （包括img标签 和 数组）
		if (this.bulletY<0) {
			//子弹超出页面顶部的时候  移除子弹 标签
			this.currentBullet.remove();

			//数组.splice(i,l)  移除数组数据  i从哪里开始裁切  l裁切几个
			bullets.splice(index,1);

		}else{
			// 移动 子弹top
			$(this.currentBullet).css({
				'top':this.bulletY
			})
		}
	}

	//子弹碰撞敌方飞机
	Bullet.prototype.shootEnemyPlane = function(index){

		//检测所有的敌方飞机  是否被当前子弹撞到
		for(var i=0 ; i<enemys.length ; i++){
			//碰撞逻辑
			// 子弹的left> 敌机的left-子弹的宽度
			if(this.bulletX>=enemys[i].EnemyPlaneX - this.bulletWidth && this.bulletX <= enemys[i].EnemyPlaneX+enemys[i].EnemyPlaneWidth && this.bulletY >= enemys[i].EnemyPlaneY - this.bulletHeight && this.bulletY <= enemys[i].EnemyPlaneY + enemys[i].EnemyPlaneHeight){
				//击中地方飞机  移除子弹
				bullets.splice(index,1);
				this.currentBullet.remove();

				//击中敌机，扣除敌机血量
				enemys[i].EnemyPlaneBlood -=1;

				if (enemys[i].EnemyPlaneBlood <= 0) {
					// $('<img></img>')[0] == document.createElement('img')

					

					//敌机血量 <= 0 , 让敌方飞机爆炸 （把敌方飞机的图片换成爆炸的图片）
					//创建一个敌机爆炸图 DOM
					var boomEnemyPlane = $('<img></img>')[0];
					boomEnemyPlane.src = enemys[i].EnemyPlaneDieSrc;


					$(boomEnemyPlane).css({
						width:enemys[i].width+'px',
						height:enemys[i].height+'px',
						//让敌机爆炸图 出现在 飞机被打死的地方
						position:"absolute",
						left:enemys[i].EnemyPlaneX + 'px',
						top:enemys[i].EnemyPlaneY + 'px'
					})

					//	把创建的敌机爆炸图 添加到页面上
					game[0].append(boomEnemyPlane);
					// 让敌方飞机爆炸图 4秒钟后删除掉


					//敌机爆炸的第二种做法
					// $(enemys[i].currentEnemyPlane).Attr('src',enemys[i].EnemyPlaneDieSrc);
					 //再让当前敌机停止位移

					(function(){
						setInterval(function(){
							boomEnemyPlane.remove();
						},400)
					})()


					//移除 敌方飞机
					enemys[i].currentEnemyPlane.remove();
					enemys.splice(i,1);


				}
			}

		}
	}

	// 数组 用来存储 new 出来的 子弹对象
	var bullets = [];

	// 创建每一颗子弹的方法
	function createEveryBullet(){
		createBulletInterval = setInterval(function(){
			// 实例化 子弹 对象
			var bullet = new Bullet();

			// 使用实例化出来的子弹对象 创建子弹
			bullet.createBullet();

			// 把括号中的东西 存储到数组中
			bullets.push(bullet);

		},100)
	}
	
	// 移动每一颗子弹
	function moveEveryBullet(){
		// 通过for循环 便历子弹数组 获取每一颗子弹
		moveBulletInterval = setInterval(function(){
				for(var i = 0; i< bullets.length ; i++){
					
					bullets[i].moveBullet(i);
					// console.log(bullets);

					// bullets[0] 

					//bullets[0] = new Bullet()
					if (bullets[i] != undefined) {
						bullets[i].shootEnemyPlane(i);
					}


				}
			},5)
		
	}


	//存放敌方飞机数据  对象数组  用来随机生成敌方飞机
	var enemy = [
		{
			img:'./images/enemy1.png',
			dieImg:'./images/enemy1b.gif',
			width:34,
			height:24,
			blood:1
		},{
			img:'./images/enemy2.png',
			dieImg:'./images/enemy2b.gif',
			width:46,
			height:60,
			blood:5
		},{
			img:'./images/enemy3.png',
			dieImg:'./images/enemy3b.gif',
			width:110,
			height:164,
			blood:10
		}
	]


	// 构建一个敌机类 （构造函数）
	function EnemyPlane(){
		var emy = null; /*emy 用来存储对象*/

		//Math.random() 生成一个随机数 [0,1)
		//0-0.5 小飞机
		//0.5-0.9 中飞机
		//0.9-1 大飞机
		var random = Math.random();
		if (random < 0.5) {
			emy=enemy[0]; //小型飞机
		}else if(random < 0.9){
			emy=enemy[1];//中型飞机
		}else{
			emy=enemy[2];//大型飞机
		}
		console.log(emy)
		// 敌方飞机的宽高
		this.EnemyPlaneWidth = emy.width;
		this.EnemyPlaneHeight = emy.height;

		//随机创建 敌机的 X，Y 坐标
		// 随机数 0-1  0*gamewidth=0； 1*gamewidth=gamewidth
		this.EnemyPlaneX = Math.random()*(game.width()-this.EnemyPlaneWidth);
		this.EnemyPlaneY = -this.EnemyPlaneHeight; /*TODO*/

		//敌方飞机的图片路径
		this.EnemyPlaneSrc = emy.img;
		this.EnemyPlaneDieSrc = emy.dieImg;

		//敌方飞机的血量
		this.EnemyPlaneBlood = emy.blood;

		//敌方飞机的DOM
		this.currentEnemyPlane = null;

	}

	//挂载一个 创建敌方 飞机的原型方法
	EnemyPlane.prototype.createEnemyPlane = function(){
		// 创建 敌方飞机 img标签 document.createElement('img')
		this.currentEnemyPlane = document.createElement('img');
		$(this.currentEnemyPlane).css({
			'width':this.EnemyPlaneWidth,
			'height':this.EnemyPlaneHeight,
			'position':'absolute',
			'left':this.EnemyPlaneX,
			'top':this.EnemyPlaneY
		}).attr('src',this.EnemyPlaneSrc);

		game.append(this.currentEnemyPlane);

	}
	// 移动敌方飞机
	EnemyPlane.prototype.moveEnemyPlane = function(index){
		this.EnemyPlaneY += 2;

		if(this.EnemyPlaneY>game.height()){
			$(this.currentEnemyPlane).remove();
			enemys.splice(index,1);
		}else{
			$(this.currentEnemyPlane).css({
				'top':this.EnemyPlaneY
			})
		}
	}

	// 存储敌方飞机的数组
	var enemys=[];
	
	//创建每一个敌方飞机	
	function createEveryEnemy(){
	 createEveryEnemyInterval = setInterval(function(){
	 	//实例化出来的敌方飞机对象
	 		var enemyplane = new EnemyPlane();
			enemyplane.createEnemyPlane();
			// 把敌机对象 push到数组中
			enemys.push(enemyplane);
		},1000)
	}

	//创建移动敌方飞机的方法  移动每一架 敌方飞机
	function moveEveryEnemy(){
		moveEveryEnemyInterval = setInterval(function(){
			for(var i=0 ; i<enemys.length ; i++){
				// 使用for循环  移动每一架敌方飞机
				enemys[i].moveEnemyPlane(i);

				//每一架敌方飞机移动一次 都要判断是否会碰撞到我方飞机
					/*myWidth
					myHeight
					planX
					planY*/
				if (planX >= enemys[i].EnemyPlaneX - myWidth && planX <= enemys[i].EnemyPlaneX+enemys[i].EnemyPlaneWidth && planY >= enemys[i].EnemyPlaneY - myHeight &&  planY<= enemys[i].EnemyPlaneY + enemys[i].EnemyPlaneHeight) {

					//我方飞机被炸毁：

					clearInterval(bgInterval);
					clearInterval(createBulletInterval);
					clearInterval(moveBulletInterval);
					clearInterval(createEveryEnemyInterval);
					clearInterval(moveEveryEnemyInterval);


					

					//移除鼠标事件的方式1
					layout.unbind('mousemove');
					// layout.mousemove();
					
					//把飞机图片变成爆炸的图片
					plan.css({
						backgroundImage: 'url(./images/planeb.gif)',
					})

					// 初始化游戏
					setTimeout(function(){

						plan.css({
							backgroundImage:'url(./images/plane.gif)',
							left:'calc(50% - 30px)',
							top:'600px'
						})
					//清除 game 里面 的所有的  img 标签（子弹 和 敌方飞机）
						$('.game>img').remove();
						bullets=[];
						enemys=[]


						$('.star').show();
						$('.game').hide();
					},2000)


				}
			}
		},10)
	}

})