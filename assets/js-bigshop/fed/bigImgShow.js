var Slider = null;
(function(){
			Slider = function(){
				var container = $(".slider-container"),
					panels = $(".panel"),
					current = panels.first(),
					related = current.next().first(),
					leftBtn = $(".scrollBtn-left"),
					rightBtn = $(".scrollBtn-right"),
					currentClass = "current-panel",
					imgWrapClass = "picWrap",
					tabActiveClass = "pic-tab-active",
					tabClass = "pic-tab",
					tabs = $(".pic-tabs"),
					tabWidth = 437,
					title = $(".pic-title"),
					top = 188,
					length = panels.length,
					baseWidth = 875,
					currentWidth = 875,
					currentHeight = 575,
					relatedWidth = 500,
					relatedHeight = 330,
					dir,
					changeSpeed = 700,
					scrollSpeed = 500,
					timeout = null,
					viewHeight = 575 ;
				
				function changeSize(obj){
					obj.targetO.find("." + imgWrapClass).css({width: obj.w, height: obj.h, marginTop: obj.mTop});
					obj.targetO.find("img").css({width: obj.w});
				}
				function changeScrollSize(obj){
					obj.targetO.find("." + imgWrapClass).animate({width: obj.w, height: obj.h, marginTop: obj.mTop}, changeSpeed);
					obj.targetO.find("img").animate({width: obj.w}, changeSpeed);
				}
				function changeTitle(cur,index){
					var text = cur.attr("title");
						title.html("<ins>" + (index + 1) + "</ins>/" + length + "&nbsp;" + text);
						$("."+tabClass).removeClass(tabActiveClass).eq(index).addClass(tabActiveClass);
				}
				function setBtnShow(index){
					if(index == 0){
						leftBtn.hide();
						rightBtn.show();
					}else if(index == length-1){
						rightBtn.hide();
						leftBtn.show();
					}else{
						leftBtn.show();
						rightBtn.show();
					}
				}
				function startScroll(cur, dir){
					clearTimeout(timeout);
					timeout = setTimeout(function(){
						var index = cur.index();
						related = current;
						current = cur;
						container.animate({marginLeft: dir + "=" + baseWidth + "px"}, scrollSpeed);
						changeScrollSize({
							targetO: current,
							w: currentWidth,
							h: currentHeight,
							mTop: 0
						});
						changeScrollSize({
							targetO: related,
							w: relatedWidth,
							h: relatedHeight,
							mTop: top
						});
						changeTitle(current,index);
						setBtnShow(index);
					}, 200);
				}
				function setCur(cur){
					var index = cur.index();
					related = current;
					current = cur;
					setImg(cur);
					container.css("margin-left", "-" + (index * baseWidth) + "px");
					changeSize({
						targetO: current,
						w: currentWidth,
						h: currentHeight,
						mTop: 0
					});
					if(cur != current){
						changeSize({
							targetO: related,
							w: relatedWidth,
							h: relatedHeight,
							mTop: top
						});
					}
					changeTitle(current,index);
					setBtnShow(index);
					setImg(cur.next().first());
					setImg(cur.prev().last());
				}
				function createTabs(){
					var tabList = "";
					tabList = "<i class='pic-tab-intro'>外观</i>";
					var hasAddNeishi = false;
					for(var i=1;i<length+1;i++){
						if(i==1)
							tabList += "<i class='pic-tab pic-tab-active' index='"+i+"'>.</i>";
						else
							tabList += "<i class='pic-tab' index='"+i+"'>.</i>";
						if($(".panel:nth-child("+(i-1)+")").attr("dindex")>=12&&!hasAddNeishi){
							tabList += "<i class='pic-tab-intro'>内饰</i>"
								hasAddNeishi = true;
						}
					}
					tabs.append(tabList);
				}
				function setImg(cur){
					var src = cur.attr("imgSrc"),
						img = cur.find("img");
					if(!img.attr("src")){
						img.attr("src", src);
					}
				}
				leftBtn.click(function(){
					var cur = panels.eq(current.index() - 1);
					startScroll(cur, "+");
					setImg(cur.prev().last());
				});
				rightBtn.click(function(){
					var cur = panels.eq(current.index() + 1);
					startScroll(cur, "-");
					setImg(cur.next().first());
				})
				tabs.click(function(event){
					var target = $(event.target);
					if(target.attr("class") == tabClass){
						setCur(panels.eq(parseInt(target.attr("index")) - 1));
					}
				})
				$(".slider-close").mouseenter(function(){
					$(this).addClass("close-hover");
				}).mouseleave(function(){
					$(this).removeClass("close-hover");
				}).click(function(){
					$(window.parent.document.getElementById('bigImages')).css("display","none");
				})

				return {
					"init":function(args){
						container = args.container || container;
						panels = args.panels || panels;
						length = args.length || length;
						leftBtn = args.leftBtn || leftBtn;
						rightBtn = args.rightBtn || rightBtn;
						baseWidth = args.baseWidth || baseWidth;
						currentWidth = args.currentWidth || currentWidth;
						currentHeight = args.currentHeight || currentHeight;
						relatedWidth = args.relatedWidth || relatedWidth;
						relatedHeight = args.relatedHeight || relatedHeight;
						currentClass = args.currentClass || currentClass;
						imgWrapClass = args.imgWrapClass || imgWrapClass;
						tabs = args.tabs || tabs;
						tabsWidth = args.tabWidth || tabWidth;
						title = args.title || title;
						top = args.marginTop || top;
						scrollSpeed = args.scrollSpeed || scrollSpeed;
						changeSpeed = args.changeSpeed || changeSpeed;
						viewHeight = args.viewHeight || viewHeight;
						container.width(length * baseWidth);
						tabs.width(tabsWidth);

						createTabs();
						changeTitle(current,0)
						setBtnShow(0);
						if(viewHeight<636){
							baseWidth =(viewHeight-40)*875/575
							currentWidth = baseWidth
							currentHeight =viewHeight-40
							relatedWidth = currentWidth
							relatedHeight = currentHeight
							$(".panel").css({
								width:baseWidth,
								height:viewHeight-40
							})
							$(".slider-scroll").css({
								width:baseWidth,
								height:viewHeight-40
							})
							$("#slider").css({
								width:baseWidth,
								height:viewHeight-40
							})
							$(".scrollBtn").css({
								top:viewHeight/2-45
							})
						}

						
					},
					"setCurrent":function(index){
						setCur(panels.eq(index));
					}
				}
			}();
//			$(".wrapGrayBg").css({"opacity": 0.9, height: $(window.parent.document.body).height()});
		})();