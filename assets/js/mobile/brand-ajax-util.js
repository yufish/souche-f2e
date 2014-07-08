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
		              code:brandCode,
                      type:'car-subdivision'
		            },
		            success:success
		          });
		},
		getModel:function(success,brandCode,loading){
			
		},
		getRecomBrands:function(success,loading){
			var ctxPath = this.config.contextPath; 
			loading=loading||true;

			$.ajax({
              url:ctxPath+ '/pages/dicAction/loadRootLevel.json',
              dataType:"json",
              data:{
                  type:'car-subdivision'
              },
              success:success

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