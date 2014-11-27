(function(){
	$("#register, #login, #loginInner").each(function(){
		
		var $this = $(this);

		var remind = $this.find(".input_remind");
		remind.hide();

		$(this).find("input").focus(function(){
			$(this).parent().find(".input_remind").show();
		}).blur(function(){
			$(this).parent().find(".input_remind").hide();
		})

		$this.find("input:first").trigger("focus");
	});
})();	