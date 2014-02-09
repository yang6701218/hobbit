//1、前进后退value和text不丢失
//2、value和text属性
//3、弹性功能定义文本宽度和列数后，根据内容自动调整
//   a、配置0行自动撑高
//   b、配置n行，文本内容则为n行
//   c、不配置或配置1行，文本内容限制1行
//   d、支持不同位置（百分比）的省略符号，
//4、宽度为百分比时，支持横竖屏
$.extend($.fn, {
	span: function(options){
		var This = this;
		var ui = This.parent("span");
		var $text = This.prev("span");
		var lineHeight = this.css("line-height");
		var paddingTop = this.css("padding-top");
		
		var $hiddenText = ui.clone();
		$hiddenText.css({
			"visibility": "hidden",
			"postion": "absolute"
		});
		
		options = $.extend({
			text: This.val(),
			displayText: function(txt){
				return txt;
			},
			rows: 1,
			//sl: 1.0,
			minFontSize: 10 
		},options);
		
		this.text = function(txt){
			if(txt === undefined){
				return This.val();
			}
			This.val(txt);
			$text.text(options.displayText(txt));
			
			return txt;
		};
		
		var init = (function(){
			if (!ui || ui.length == 0) {
                This.wrap("<span class='span'></span>");
                ui = This.parent("span");
            }
            
            if(!$text || $text.length == 0){
            	This.before("<span class=''>");
            	$text = This.prev("span");
            }
            
            This.transferCssTo(ui);
            This.text(options.text);
			
			var height = lineHeight * options.rows;
			
			//if($hiddenText)
		})();
		
		return this;
	}
});
function getStrLength(str) {
    var len = str.length;
    var result = 0;
    for (var i = 0; i < len; i++) {
        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
            result += 2;
        } else {
            result++;
        }
    }
    return result;
}


/*
 * @author:tqtan
 * @date:13/10/10
 * @name:实现多行省略
 * 
*/


/*
 *	@method:node.mlellipsis(row)
 *  @node:dom节点
 *  @row:行数
 *	
*/
Element.prototype.getText=function(){
	if(this.innerText==undefined){return this.textContent;}
	else{return this.innerText;}
};

Element.prototype.setText=function(str){
	if(this.innerText==undefined){this.textContent=str||"";}
	else{this.innerText=str||"";}
};

Element.prototype.getFinalStyle=function(property,fontSize){
	var s;
	if(window.getComputedStyle){
		s = window.getComputedStyle(this, null)[property];
	}
	else{
		s = this.currentStyle[property];
	}

	//兼容IEbug:IE解析getComputedStyle或currentStyle,然而若line-height=1.5，它会获取计算后是1.5，而其他浏览器获得1.5*line-height
	if(fontSize!=undefined){
		s = s*fontSize + "px";
	}
	return s.substring(0,s.toString().length-2);
		
};

Element.prototype.mlellipsis=function(row){	
	//省略后加上title
	var str = this.getText();
	var title = this.getAttribute("title");
	if(title==null){this.setAttribute("title",str);}
	else{this.setText(title);}

	//获取计算后的样式
	var fontSize = this.getFinalStyle("fontSize");
	if(/msie/i.test(navigator.userAgent)){
		var lineHeight = this.getFinalStyle("lineHeight",fontSize);
	}
	else{
		var lineHeight = this.getFinalStyle("lineHeight");
	}
	var height  = this.clientHeight;

	if(lineHeight == "norm"){
		lineHeight = Number(fontSize*1.5);
		var nowStyle = this.getAttribute("style")||"";
		this.setAttribute("style",nowStyle+";line-height:"+lineHeight+"px");
	}
	else{lineHeight = Number(lineHeight);}

	
	//若高度足够，则不用省略
	var dheight = Math.floor(row*lineHeight);
	if(height >= dheight){
		str = this.getText();

		while(dheight*3<this.clientHeight){
			this.setText(str.substring(0,str.length/2));
			str = this.getText();
		}
		//减去末尾文字
		while(dheight<this.clientHeight){
			str = this.getText();
			this.setText(str.replace(/(\s)*([a-zA-Z0-9]?|\W)(\.\.\.)?$/,"..."));
		}
	}
};

/*
 *	/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/ 正则:
 *	(\s)* 0或多个空白
 *	([a-zA-Z0-9]+|\W) 一个或多个字母数字 或 任意不是字母，数字，汉字的字符
 *	(\.\.\.)? 零个或一个...
 */
