(function($){

	$.fn.imagezoom = function(){
		//zoom-div大小,用户自定义设置
		var zoomWidth = 435;
		var zoomHeight = 435;
		//获得booth-div,image的位置及大小
		var boothLeft = $(".booth").offset().left;
		var boothTop = $(".booth").offset().top;
		var boothWidth = $(".booth").width();
		var boothHeight = $(".booth").height();
		var imageWidth = $(".booth img").width();
		var imageHeight = $(".booth img").height();
		var imageLeft = $(".booth img").offset().left;
		var imageTop = $(".booth img").offset().top;
		//为图片绑定mouseenter事件,$(this)指向img元素
		$(this).bind("mouseenter",function(){
			//添加zoom-div并设置大小和位置
			var bigImageSrc = $(this).parent().attr("href");
			if($(".zoom").length ==0){
				$("body").append("<div class='zoom'><img src='" + bigImageSrc + "'/></div>");
			}
			$(".zoom").css({
				left: boothLeft + boothWidth + 10,
				top: boothTop,
				width: zoomWidth,
				height: zoomHeight
			})
			//添加mask-div
			if($(".mask").length ==0){
				$("body").append("<div class='mask'></div>");
			}

			var maskWidth, maskHeight;
			var scaleX, scaleY;
			//在mouseenter事件内部绑定mousemove事件，防止mousemove在mouseenter之前执行
			$("body").bind("mousemove",function(e){
				//计算大小图片比例
				if ($(".mask").width()==0){
					var bigImageWidth = $(".zoom img").width();
					var bigImageHeight = $(".zoom img").height();
					scaleX = bigImageWidth/imageWidth;
					scaleY = bigImageHeight/imageHeight;
					maskWidth = zoomWidth/scaleX;
					maskHeight = zoomHeight/scaleY;
					$(".mask").width(maskWidth);
					$(".mask").height(maskHeight);

				}
				//获取鼠标所在位置
				var mouseX = e.pageX;
				var mouseY = e.pageY;
				if (mouseX < imageLeft || mouseX > imageLeft + imageWidth || mouseY < imageTop || mouseY > imageTop + imageHeight) {
					$(".zoom").remove();
					$(".mask").remove();
					//解除body绑定的mousemove事件
					$("body").unbind("mousemove");
					return;
				}
				//$("p").html(mouseX+","+mouseY);
				//计算mask位置
				var maskLeft, maskTop;
				if(mouseX - maskWidth/2 < imageLeft){
					maskLeft = imageLeft;
				}
				else if(mouseX + maskWidth/2 > imageLeft + imageWidth){
					maskLeft = imageLeft + imageWidth - maskWidth;
				}
				else{
					maskLeft = mouseX - maskWidth/2;
				}
				if(mouseY - maskHeight/2 < imageTop){
					maskTop = imageTop;
				}
				else if(mouseY + maskHeight/2 > imageTop + imageHeight){
					maskTop = imageTop + imageHeight - maskHeight;
				}
				else{
					maskTop = mouseY - maskHeight/2;
				}
				//$("p").html(imageTop);
				//设置mask位置
				$(".mask").css({
					top: maskTop,
					left: maskLeft
				})
				//计算mask相对于图片的偏移
				var maskOffsetLeft = maskLeft - imageLeft;
				var maskOffsetTop = maskTop - imageTop;
				//设置zoom-div的scroll属性
				$(".zoom").get(0).scrollLeft = maskOffsetLeft * scaleX;
				$(".zoom").get(0).scrollTop = maskOffsetTop * scaleY;
			})
		})
		
		//下面的方法会产生图片闪动的问题，原因是mask层设置了z-index，始终在img上方
		//焦点在mask上时就离开了img
		/*$(this).bind("mousemove",function(e){
			//计算大小图片比例
			//$("p").html($(".mask").width());
			//由于绑定了mouseleave事件，焦点从img移动到mask层必然触发mouseleave将zoom和mask移除，
			//移除后焦点再次回到img，又触发mouseenter将它们重新添加，因此mask的width此时始终是0  
			if ($(".mask").width()==0){
				var bigImageWidth = $(".zoom img").width();
				var bigImageHeight = $(".zoom img").height();
				var scaleX = bigImageWidth/imageWidth;
				var scaleY = bigImageHeight/imageHeight;
				var maskWidth = zoomWidth/scaleX;
				var maskHeight = zoomHeight/scaleY;
				$(".mask").width(maskWidth);
				$(".mask").height(maskHeight);

			}
			//获取鼠标所在位置
			var mouseX = e.pageX;
			var mouseY = e.pageY;
			//计算mask位置
			var maskLeft, maskTop;
			if(mouseX - maskWidth/2 < imageLeft){
				maskLeft = imageLeft;
			}
			else if(mouseX + maskWidth/2 > imageLeft + imageWidth){
				maskLeft = imageLeft + imageWidth - maskWidth;
			}
			else{
				maskLeft = mouseX - maskWidth/2;
			}
			if(mouseY - maskHeight/2 < imageTop){
				maskTop = imageTop;
			}
			else if(mouseY + maskHeight/2 > imageTop + imageHeight){
				maskTop = imageTop + imageHeight - maskHeight;
			}
			else{
				maskTop = mouseY - maskHeight/2;
			}
			//设置mask位置
			$(".mask").css({
				top: maskTop,
				left: maskLeft
			})
			//计算mask相对于图片的偏移
			var maskOffsetLeft = maskLeft - imageLeft;
			var maskOffsetTop = maskTop - imageTop;
			//设置zoom-div的scroll属性
			$(".zoom").get(0).scrollLeft = maskOffsetLeft * scaleX;
			$(".zoom").get(0).scrollTop = maskOffsetTop * scaleY;
		})
		
		$(this).bind("mouseleave",function(){
			//alert("mouseleave");
			$(".zoom").remove();
			$(".mask").remove();
		})*/

		
	}

})(jQuery);

$(".booth img").imagezoom();

$(".thumb li").hover(function(){
	$(this).addClass("tb-selected");
	$(this).siblings().removeClass("tb-selected");
	var midImageLink = $(this).find("img").attr("mid");
	var bigImageLink = $(this).find("img").attr("big");
	$(".booth img").attr("src",midImageLink);
	$(".booth a").attr("href",bigImageLink);
})