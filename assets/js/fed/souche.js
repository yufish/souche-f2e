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
Souche.NoRegLogin = Souche.NoRegLogin || {};
Souche.NoRegLogin = function() {
    var minilogin = null;
    var minilayer = null;
    var phoneReg = /^1[3458][0-9]{9}$/;
    var callback = function() {

    };
    return {
        callback: function() {
            this.close();
            callback();
        },
        close: function() {
            if (minilogin) {
                minilogin.css({
                    display: "none"
                });
            }
            if (minilayer) {
                minilayer && minilayer.css({
                    display: "none"
                });
            }

        },
        _show: function() {
            var self = this;
            if (minilogin) {
                minilogin.css({
                    display: "block"
                }).removeClass("hidden");
                minilayer.css({
                    display: "block"
                });
            } else {
                minilogin = $('<div id="noreg-popup" class="apply_popup">      <span class="apply_close"></span>      <h1 class="popup-title">手机号一键登录</h1>      <form id="noreg-phone-form" action="">      <div class="result_p">      <div class="tip">输入您的手机号码，完成后续操作</div>            <div class="phone">            <label>手机号码</label>            <input type="text" name="" value="" id="noreg-phone"  placeholder="在此输入手机号码"/>            <s class="warning hidden">请输入正确的手机号码</s>            </div>      </div>      <button type="submit" class="submit">确认</button>      </form>    </div>');
                minilogin.css({
                    display: "block",
                    zIndex: 100000001
                });

                minilayer = $("<div id='minilayer'></div>");
                minilayer.css({
                    display: "block",
                    width: $(document.body).width(),
                    left: 0,
                    top: 0,
                    height: $(document.body).height(),
                    position: "absolute",
                    opacity: 0.7,
                    background: "#111",
                    zIndex: 100000000 
                }).removeClass("hidden");
                $(document.body).append(minilayer);
                $(document.body).append(minilogin);
                //              $(window).scroll(function(){
                //                  minilogin.css({
                //                      top:$(window).scrollTop()+100,
                //                      left:$(window).width()/2-300
                //                  })
                //              })
                $("#noreg-phone-form").on("submit", function(e) {
                    e.preventDefault();
                    if (!phoneReg.test($("#noreg-phone").val())) {
                        $(".warning", this).removeClass("hidden");
                    } else {
                        Souche.PhoneRegister($("#noreg-phone").val(), function() {
                            self.callback && self.callback();
                        })
                    }
                })
                $("#noreg-popup .apply_close").on("click", function(e) {
                    self.close();
                })
            }
        },
        checkLogin: function(_callback) {
            callback = _callback;
            var self = this;
            Souche.checkPhoneExist(function(isLogin) {
                if (isLogin) {
                    self.callback && self.callback();
                } else {
                    self._show();
                }
            })

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
};
	
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function() {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function(key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };
})();
	
	
	
	
	
	