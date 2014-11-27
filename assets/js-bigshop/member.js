$(function(){
			$(".member-close").mouseenter(function(){
				$(this).addClass("close-hover");
			}).mouseleave(function(){
				$(this).removeClass("close-hover");
			});

			$(".member-controller").click(function(){
				var $this = $(this);
				var remind = $this.find(".member-input-remind");
				var input = $this.find("input");
				if(remind.is(":visible")){
					remind.hide();
					input.focus();
					input.blur(function(){
						if(input.val() == ""){
							remind.show();
						}
					});
				}
			});
			var timer1 = null,timer2 = null,timer3 = null;
			timer1 = setInterval(function(){
				var $this = $(".member-psd");
				if($this.val() != ""){
					$this.parent().find(".member-input-remind").hide();
					clearInterval(timer1);
				}
			},50);
			timer2 = setInterval(function(){
				var $this = $("#member-tel");
				if($this.val() != ""){
					$this.parent().find(".member-input-remind").hide();
					clearInterval(timer2);
				}
			},50);
			timer3 = setInterval(function(){
				var $this = $("#member-yz");
				if($this.val() != ""){
					$this.parent().find(".member-input-remind").hide();
					clearInterval(timer3);
				}
			},50)
		});