define(['lib/mustache'],function(Mustache){
	var GuWen = (function() {
		function createBrandsManager(_container) {
			var container = _container;

			var brandsManager = {
				brands : {},//{bCode:{sCode:$}}
				//sCode='' for 不限
				toggleSeries : function(bCode, sCode, jqObjArr) {
					var brands = this.brands;
					var bObj = brands[bCode]// = brands[bCode] || {};

					if (bObj && bObj[sCode]) {
						this.removeSeries(bCode, sCode);
						if ($.isEmptyObject(brands)) {
							container.hide();
						}
					} else {
						if ($.isEmptyObject(brands)) {
							container.show();
						}
						bObj = brands[bCode] = (brands[bCode] || {});
						if (sCode == '') {
							for ( var i in bObj) {
								this.removeSeries(bCode, i);
							}
						} else {
							this.removeSeries(bCode, '');
						}
						this.addSeries(bCode, sCode, jqObjArr);

					}
				},
				removeSeries : function(bCode, sCode) {
					var bObj = this.brands[bCode];
					if (!(sCode in bObj))
						return;
					var sObj = bObj[sCode];
					sObj[0].remove();
					sObj[1].removeClass('selected')
					delete bObj[sCode];
					if ($.isEmptyObject(bObj)) {
						delete this.brands[bCode];
					}
				},
				addSeries : function(bCode, sCode, jqObjArr) {
					var brands = this.brands;
					var bObj = brands[bCode] = (brands[bCode] || {})
					bObj[sCode] = jqObjArr;
					container.append(jqObjArr[0]);
					jqObjArr[1].addClass('selected');
				}
			}
			return brandsManager;
		}

		return {

			init : function() {

				var brandsManager = createBrandsManager($('.selected-brand'));

				var curPageIndex = 1;
				var pageStack = [];
				pageStack.push(0);
				var pages = [ $('#page-1'), $('#page-2'), $('#page-3') ];
				function gotoPage(pageIndex) {
					pageStack.push(curPageIndex);
					pageIndex = pageIndex || (curPageIndex + 1);
					document.body.scrollTop = 0;
					var $curPage = pages[curPageIndex - 1];
					var $page = pages[pageIndex - 1];
					$page.css({
						left : '100%'
					}).show();
					$curPage.animate({
						left : '-100%'
					}, function() {
						$curPage.hide();
					});
					$page.animate({
						left : '0'
					});
					curPageIndex = pageIndex;
				}

				function backPage() {
					document.body.scrollTop = 0
					var pageIndex = pageStack.pop();
					if (pageIndex == 0) {
						history.back();
						return;
					}
					var $curPage = pages[curPageIndex - 1];
					var $page = pages[pageIndex - 1];
					$page.css({
						left : '-100%'
					}).show();
					$curPage.animate({
						left : '100%'
					}, function() {
						$curPage.hide();
					});
					$page.animate({
						left : '0'
					});
					curPageIndex = pageIndex;
				}

				var allBrands = [];
				
				$('#page-1 .next-btn').one('click',function() {
					gotoPage();
					loadingLayer.removeClass('hidden');
					BrandAjaxUtil.getRecomBrands(function(data) {
						var brands = data.brands;
						var index = 0, brandCode, brandName, brand, imgSrc

						for ( var i in brands) {
							brand = brands[i];
							allBrands.push({
								'brandCode' : brand.brand,
								'brandName' : brand.brandName,
								'imgSrc' : brand.picture,
								'index' : (index++ % 4)
							})
						}
						load11(allBrands);
						loadingLayer.addClass('hidden');
					})
					$(this).click(function(){gotoPage()});
				})
				var tplBrand = $('#tpl_brand').text()
					, tplSeries = $('#tpl_series').text();
				
				var initNum = 11;
				
				function load11(brands) {
					var start = '<div class="icon-group">', end = '</div>', html = '';
					var bound;
					var groupNum = Math.ceil(initNum/4)
					for (var i = 0; i < groupNum; i++) {
						bound = Math.min(initNum - 4*i, 4);
						for (var j = 0; j < bound; j++) {
							html += Mustache.render(tplBrand, {
								'brand' : brands[4 * i + j]
							});
						}
						if (bound < 4) {
							html += '<div class="icon-item-more">'
									+ '<div id="more-brand">'
									+ '<div class="more-circle">'
									+ '<div class="more-inner-circle"></div>'
									+ '<div class="more-inner-circle"></div>'
									+ '<div class="more-inner-circle"></div>'
									+ '</div>' + '<div class="text">更多</div>'
									+ '</div>' + '</div>'
						}

						$('#brand-icons-container').append(start + html + end);

						html = '';
					
					}
				}

				$('#page-2 .next-btn').click(function() {
					gotoPage();
				})

				$('.back-icon').click(function() {
					backPage();
				})
				/*$(".selected-brand").on(
						'click',
						'.close-icon',
						function() {
							var $sbItem, $selectedBrand;
							var $parent = $(this).parent();
							while ($parent) {
								if ($parent.hasClass('sb-item')) {
									$sbItem = $parent;
									break;
								}
								$parent = $parent.parent();
							}
							var bCode = $sbItem.attr('brand-code'), sCode = $sbItem
									.attr('series-code');
							brandsManager.toggleSeries(bCode, sCode);
							//$sbItem.remove();
						})*/

				var $curBrandArray;
				var $curFold;
				var curBrandCode;
				var loadingLayer = $('.loading-cover-layer');
				$('#brand-icons-container').on('click','.icon-item',
					function() {
						var $self = $(this);
						
						
						var dataIndex = $self.attr('data-index')
						var localFold = $self.siblings('.fold-series[data-index='
									+ dataIndex + ']');
						var loaclBrandCode = $self.attr('data-code');
						var brandName = $self.find('.brand-name').text();
						
						if(localFold.length===0){
							var start = '<div data-index="'+dataIndex+'" class="fold-series"><div class="wrapper">'
								,end = '</div></div>'
								,html='';
							loadingLayer.removeClass('hidden');
							BrandAjaxUtil.getSeries(function(data){
								var codes = data.codes;
								html='<div data-code="" class="series-item"> <div data-brand-name="'+brandName+'" class="text">全部车系</div></div>'
					            for(var i in codes){
					            	var b = codes[i];
					                var name = i;
					                for(var n =0;n<b.length;n++){
					                  var seriesCode = b[n].code;
					                  var seriesName = b[n].enName;
					                  html+=Mustache.render(tplSeries, {'series':{'seriesCode':seriesCode,'seriesName':seriesName}});
					                } 
					            }
					            $self.parent('.icon-group').append(start+html+end);
					            if (curBrandCode === loaclBrandCode) {
									$curFold.hide();
									$curBrandArray.hide();
									curBrandCode = '';
									return;
								}
								if ($curFold) {
									$curFold.hide();
									$curBrandArray.hide();
								}
								//click '更多'
								if (!loaclBrandCode) {
									return;
								}
								
								curBrandCode = $self.attr('data-code');
								$curFold = $self.siblings('.fold-series[data-index='+ dataIndex + ']');
								$curBrandArray = $self.find('.brand-array');
								$curFold.slideDown(500, function() {
									$curBrandArray.show();
								});
								loadingLayer.addClass('hidden');
							},loaclBrandCode);
							return;
						}
						
						

						if (curBrandCode === loaclBrandCode) {
							$curFold.hide();
							$curBrandArray.hide();
							curBrandCode = '';
							return;
						}
						if ($curFold) {
							$curFold.hide();
							$curBrandArray.hide();
						}
						//click '更多'
						if (!loaclBrandCode) {
							return;
						}
						
						curBrandCode = $self.attr('data-code');
						$curFold = localFold;
						$curBrandArray = $self.find('.brand-array');
						$curFold.slideDown(500, function() {
							$curBrandArray.show();
						});
				})

				var brandIndex = 0;
				$('#brand-icons-container').one('click','#more-brand',function() {
					console.log(allBrands);
					var start = '<div class="icon-group">', end = '</div>', html = '';
					var bound;
					var brands = allBrands;
					var totalNum = brands.length;
					console.log(totalNum);
					//to replace .icon-item#more-brand;
					var firstHtml= Mustache.render(tplBrand,{'brand':brands[initNum]});
					var iconGroup = $(this).closest('.icon-group');
					$(this).parent('.icon-item-more').remove();
					iconGroup.append(firstHtml);
					
					var groupNum = Math.ceil((totalNum)/4);
					var startGroupIndex = Math.ceil((initNum+1)/4);
					for (var i = startGroupIndex; i < groupNum; i++) {
						bound = Math.min(totalNum - 4*i, 4);
						for (var j = 0; j < bound; j++) {
							html += Mustache.render(tplBrand, {
								'brand' : brands[4 * i + j]
							});
						}
						$('#brand-icons-container').append(start + html + end);
						html = '';
					
					}
					//remove self
					//pick first one add to group which contains #more-brand
					//loop to add group(4 icon-item ;4 fold-series )
				});

				$('#brand-icons-container').on('click','.series-item',
						function() {
							var dIndex = $(this).attr('data-index');
							var sCode = $(this).attr('data-code');
							var textDiv = $(this).find('.text');
							var text
							if(textDiv.attr('data-brand-name')){
								text = textDiv.attr('data-brand-name');
							}else{
								text= textDiv.text();
							}
							var html = '<div class="sb-item" brand-code='
									+ curBrandCode + ' series-code=' + sCode + '>'
									+ '<span class="text">' + text + '</span>'
									+ '<i class="close-icon"></i>' + '</div>';
							//$(this).find('.text').toggleClass('selected');
							brandsManager.toggleSeries(curBrandCode, sCode, [
									$(html), textDiv ]);
						})

				$('.year-item').click(function() {
					$('.year-item .text').removeClass('selected');
					$(this).find('.text').addClass('selected')
				})

			}
		}

	})();
	window.GuWen = GuWen;
	return GuWen;
});

