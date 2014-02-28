var contextPath = contextPath||"";
var Souche = Souche||{};
Souche.Util = function(){
	var appearKV = {
			
	};
	return {
		/**
		 * 混合配置
		 */
		mixin:function(target,source){
			for(var i in source){
				target[i]=source[i];
			}
		},
		/**
		 * 元素第一次出现的时候执行某方法，之后不再执行
		 */
		appear:function(id,bindFunc){
			appearKV[id]=appearKV[id]||[];
			appearKV[id].push(bindFunc);
		},
		init:function(){
			var viewportWidth = $(window).width();
			var viewportHeight = $(window).height();
			
			$(window).scroll(function(){
				var windowScrollTop = $(window).scrollTop();
				for(var i in appearKV){
					var offset = $(i).offset();
					
					if(offset.top-windowScrollTop>0&&offset.top-windowScrollTop<viewportHeight){
						for(var b =0;b<appearKV[i].length;b++){
							appearKV[i][b]();
						}
						appearKV[i]=[];
					}
				}
			});
		}
	};
}();

Souche.Util.init();

Souche.UI = Souche.UI||{};
	Souche.UI.Select = function(){
	/**
	* 优化调用方式，同时优化请求数，用最少的代码和逻辑完成最多的工作！
		Souche.UI.Select.init({
			eles:['#sell_brand','#sell_set','#sell_type'],
			type:"car-subdivision",
			defaultValues:[]
		})
	*
	* @time 2013-9-3
	* @author 芋头
	*/
	var Select = function(_config){
		this.config = {
			eles:['#J_buybrand','#J_buyset',''],
			type:"car-subdivision",
			defaultValues:[]
		};
		Souche.Util.mixin(this.config,_config);
		this.init();
	};
	Select.prototype = {
		init:function(){
			var c = this.config;
			for(var i=0;i<c.eles.length;i++){
					c.defaultValues[i]=c.defaultValues[i]||"";
					c.eles[i]="#"+c.eles[i];
			}
				//没有默认值，则只需要一个请求即可初始化
				$.ajax({
					url:contextPath+"/pages/dicAction/loadRootLevel.json",
					dataType:"json",
					data:{
						type:c.type
					},
					success:function(data){
					    $(c.eles[0]).append($("<option value=''>-请选择-</option>"));
						for(var i in data.items){
							var item = data.items[i];
							$(c.eles[0]).append('<option value="'+item.code+'" '+(c.defaultValues[0]==item.code?"selected":"")+'>'+item.name+'</option>');
						}
						if(c.defaultValues[0]){
							$(c.eles[0]).change();
						}
					},	
					error:function(){

					},
					failure:function(){

					}
				});
			for(var i in c.eles){

				$(c.eles[i]).attr("data-index",i).change(function(){
					var code = this.value;
					if(code==null) return;
					var a = code.split("-")[0];
					var index = $(this).attr("data-index")*1;

					if(index>=c.eles.length-1) return;
					if(a == 'brand'){
						$.ajax({
							url:contextPath+"/pages/dicAction/loadRootLevelForCar.json",
							dataType:"json",
							data:{
								type:c.type,
								code:code
							},
							success:function(data){
									
									$(c.eles[1]).empty();
									$(c.eles[1]).append($("<option value=''>-请选择-</option>"));
									for(var j=0;j< data['keys'].length;j++){
										var key = data['keys'][j];
										var group = $("<optgroup label='"+key+"' style='color:green;font-style: italic;background-color:#f5f5f5;'></optgroup>");
										$(c.eles[1]).append(group);
										for(var a=0;a < data['codes'][key].length;a++){
											var o = data['codes'][key][a];
											group.append($("<option style='background-color:#ffffff;color:#000000;font-style: normal;' value='" + o['code'] + "' "+(c.defaultValues[1]==o['code']?"selected":"")+">" + o['name'] + "</option>"));
										}
										$(c.eles[1]).append($(""));
									}
									if(c.defaultValues[1]){
										$(c.eles[1]).change();
									}
								
							}
						});
						}else{
						$.ajax({
							url:contextPath+"/pages/dicAction/loadNextLevel.json",
							dataType:"json",
							data:{
								type:c.type,
								code:code
							},
							success:function(data){
								$(c.eles[index+1]).empty();
								$(c.eles[index+1]).append($("<option value=''>-请选择-</option>"));
								for(var i in data.items){
									var item = data.items[i];
									$(c.eles[index+1]).append('<option value="'+item.code+'" '+(c.defaultValues[index+1]==item.code?"selected":"")+'>'+item.name+'</option>');
								}
							}
						});
					}
				});
			}
			
		}
	};
	return {
		init:function(config){
			return new Select(config);
		}
	};
}();
Souche.Form = Souche.Form||{};
Souche.Form = function(){
    if(jQuery.validator){
        jQuery.validator.addMethod("exactlength", function(value, element, param) {
            return this.optional(element) || value.length == param;
           }, jQuery.format("请输入 {0} 字符."));
           jQuery.validator.addMethod("vin", function(value, element) {
               return this.optional(element) || /^[A-Z0-9]{8}[0-9X][A-Z0-9]{2}[A-Z0-9]{6}$/.test(value.toUpperCase());
           }, jQuery.format("vin编码格式错误."));
    }
	
	var form = function(config){
		this.config = {
			ele:"loginform",
			isAsync:false, //提交方式，默认同步提交，直接提交form，如果设为true，则异步提交
			beforeSubmit:function(){
				return true;
			},
			validateFail:function(message,element){
				
			},
			success:function(data){
				
			},
			error:function(){
				
			}
		};
		Souche.Util.mixin(this.config,config);
	};
	form.prototype = {
		submit:function(_config){
			var c = this.config;

			$("#"+c.ele).validate({
				messages:c.messages||{},
				submitHandler: function(form) {
					if(c.beforeSubmit()){
						if(c.isAsync){
							$("*[type='submit']").attr("disabled",true);
							$.ajax({
								url:$(form).attr("action")||"",
								type:$(form).attr("method")||"get",
								dataType:"json",
								data:$(form).serialize(),
								success:function(data){
									$("*[type='submit']").attr("disabled",false);
									if(data.errorMessage){
										c.error(data.errorMessage);
									}else{
										c.success(data);
									}

								},
								error:function(){
									$("*[type='submit']").attr("disabled",false);
									c.error();
								}
							});
						}else{
							form.submit();
						}
						
					}
				},
				errorPlacement:function(message,element){
					c.validateFail(message.html(),element);
				}
			});
		}
	};
	return {
		submit:function(_config){
			new form(_config).submit();
		}
	};
}();

Souche.UI.CustomDropdown = function(){
	var select = function(id){
		this.id = id;
		this.ele = typeof(id)!="string"?$(id):$("#"+this.id);
		this.init();
	};
	select.prototype = {
		 init:function(){
		 	var self = this;
	 		$(".sc-option-hd",this.ele).click(function(e){
	 			var list =$(".sc-option-list",self.ele);
	 			if($(".sc-option-list",self.ele).hasClass("hidden")){
	 				$(".sc-option-list").addClass("hidden");
	 				$(".sc-option-list",self.ele).removeClass("hidden");
	 				if(list.offset().top+list.height()>$(window).scrollTop()+$(window).height()){
	 					list.css({
	 						top:$(window).scrollTop()+$(window).height()-list.offset().top-list.height()+23
	 					});
	 					
	 				}else{
	 					list.css({
	 						top:25
	 					});
	 				}
	 				$(list[0].parentNode).css({
 						zIndex:Souche.UI.CustomDropdown.zIndex++
 					});
	 			}else{
	 				$(".sc-option-list").addClass("hidden");
	 				list.css({
	 						top:25
	 					});
	 			}
	 			
	 			e.stopPropagation();
	 		});
	 		if($(".sc-option-list li",this.ele).length>10){
	 			$(".sc-option-list",this.ele).css("height",300);
	 		}
	 		$(document.body).click(function(){
	 			$(".sc-option-list",self.ele).addClass("hidden");
	 			$(".sc-option-list").css({
	 						top:25
	 					});
	 		});
		 }
	};
	return select;
}();
Souche.UI.CustomDropdown.zIndex =10000;



$(document).ready(function(){
	$("*[data-ui='dropdown']").each(function(i,ele){
		$(ele).css({
			zIndex:1000-i
		});
		new Souche.UI.CustomDropdown(ele);
	});
	
});

Souche.MiniLogin = Souche.MiniLogin||{};
Souche.MiniLogin = function(){
	var static_login_url = contextPath+"/pages/minlogin.html";
	var minilogin = null;
	var minilayer = null;
	var callback = function(){
		
	};
	return {
		callback:function(){
			this.close();
			callback();
		},
		close:function(){
			if(minilogin){
				minilogin.css({
					display:"none"
				});
			}
			if(minilayer){
				minilayer&&minilayer.css({
					display:"none"
				});
			}
			
		},
		_show:function(){
			if(minilogin){
				minilogin.attr("src",static_login_url);
				minilogin.css({
					display:"block"
				});
				minilayer.css({
					display:"block"
				});
			}else{
				minilogin = $("<iframe id='minilogin' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
				
				minilogin.attr("src",static_login_url);
				minilogin.css({
					display:"block",
					width:580,
					height:500,
					position:"fixed",
					top:100,
					left:$(window).width()/2-290,
					zIndex:100000001
				});
				
				minilayer = $("<div id='minilayer'></div>");
				minilayer.css({
					display:"block",
					width:$(document.body).width(),
					left:0,
					top:0,
					height:$(document.body).height(),
					position:"absolute",
					opacity:0.7,
					background:"#111",
					zIndex:100000000
				});
				$(document.body).append(minilayer);
				$(document.body).append(minilogin);
//				$(window).scroll(function(){
//					minilogin.css({
//						top:$(window).scrollTop()+100,
//						left:$(window).width()/2-300
//					})
//				})
			}
		},
		checkLogin:function(_callback){
			callback = _callback;
			var self = this;
			$.ajax({
				url:contextPath+"/pages/evaluateAction/isLogin.json", 
				type:"post",
				dataType:"json",
				success:function(data){
					if(data.result=="true"){
						self.callback&&self.callback();
					}else{
						self._show();
					}
				},
				error:function(){
					self._show();
				}
			});
		}
	};
}();
//检查是否填过手机号
Souche.checkPhoneExist = function(callback){
	$.ajax({
		url:contextPath+"/pages/evaluateAction/isNoRegisterLogin.json", 
		type:"post",
		dataType:"json",
		success:function(data){
			if(data.result=="true"){
				callback(true)
			}else{
				callback(false)
			}
		},
		error:function(){
			callback(false)
		}
	})
};
//一步注册手机号
Souche.PhoneRegister = function(phone,callback){
	$.ajax({
		url:contextPath+"/pages/evaluateAction/noRegisterLogin.json", 
		type:"post",
		dataType:"json",
		data:{phone:phone},
		success:function(data){
			if(data.errorMessage){
				callback(false)
			}else{
				callback(true)
			}
		},
		error:function(){
			callback(false)
		}
	})
}
	
	
	
	
	
	
	
	