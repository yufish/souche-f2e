var BrandAjaxUtil=(function(){
	var noopFunc = function(){};
	
	return {
		config:{},
		init:function(_config){
			$.extend(this.config,_config);
		},
		getBrands:function(success){
			
		},
		
		getSeries:function(success,brandCode,loading){
			var ctxPath = this.config.contextPath;
			 $.ajax({
		            url:ctxPath+"/pages/dicAction/loadRootLevelForCar.json",
		            dataType:"json",
		            data:{
		              type:"car-subdivision",
		              code:brandCode
		            },
		            success:success,
		            error:function(){},
		            failure:function(){}
		          });
		},
		getModel:function(success,brandCode,loading){
			
		},
		getRecomBrands:function(success,loading){
			var ctxPath = this.config.contextPath; 
			loading=loading||true;

			$.ajax({
              url:ctxPath+ '/mobile/carCustomAction/listRecommandBrands.json',
              dataType:"json",
              success:success,
              error:noopFunc,
              failure:noopFunc
          })
		}
	}
	
})()


/*getRecomBrands:success
 * 
 * 	var brands = data.brands;
 *  for(var i in brands){
		  
	}	 
 * 
 */