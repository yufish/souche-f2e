Souche.UI. = function(){
	var select = function(id){
		this.id = id;
		this.ele = typeof(id)==='string'?$('#'+this.id):$(id);
		this.config ={
			isAutoDrop:true,
			maxDisplayItems:10,
			placeholder:'请您选择'
		}
		this.selected = [];
		this.$head = $('.sc-select-hd',this.ele);
		this.$list = $('.sc-select-list',this.ele);
		this.$content = $('.sc-select-content',this.ele);
		this._defaultHeadHeight = 30;
		this._init();
	}

	var fn = select.prototype;
	fn._init=function(_config){
		var self = this;
		for(var i in _config){
			this.config[i] = _config[i];
		}
		var $head = this.$head
			,$list = this.$list;
		this._defaultHeadHeight = $head.height();
		$list.css({
			height:this.config.maxDisplayItems*30
		});
		$(document.body).on('click',function(){
			self.hideOptions();
		})
		this._inputClick();
		this._contentClick();
		this._listClick();
	}

	fn.addOption = function(key,value){
		var li = $('<li data-value='+key+'><a href="#"><input type="checkbox" /><span class="value">'+value+'</span></a></li>')
		this.$list.append(li);
	}

	fn.removeOption = function(key){
		$('li[data-value='+key+']',this.$list).remove();
	}
	fn.removeAll=function(){
		this.$list.html('');
	}
	fn.showOptions =function(){
		this.$list.removeClass('hidden');
	}
	fn.hideOptions=function(){
		this.$list.addClass('hidden');
	}
	//包括selected,$content,$list中内容的添加
	fn.addSelected=function(key,value){
		var $content = this.$content
			,$list = this.$list;
		if(this.selected.length===0){
			$('span',$content).remove();
		}
		var select_item = $('<div class="sc-selected-item" data-value='+key+'>'+value+'<i class="sc-close">x</i></div>')	
		$content.append(select_item);

		var $list = this.$list;
		$('li[data-value='+key+'] input[type=checkbox]',$list).attr('checked',true);

		var height = Math.max($content.height(),this._defaultHeadHeight)
		$list.css({top:height})

		this.selected.push({key:key,value:value});
	}
	//包括selected,$content,$list中内容的删除
	fn.removeSelected=function(key){
		var $content = this.$content;
		$('div[data-value='+key+']',$content).remove();
		
		var selected = this.selected;
		for(var i =0;i<selected.length;i++){
			if(selected[i].key ==key){
				selected.splice(i,1);
				break;
			}
		}

		var $list = this.$list;
		$('input[type=checkbox]',$list).attr('checked',false);

		if(selected.length===0){
			$content.html("<span class='placeholder'>"+this.config.placeholder+"</span>");
		}
		var height = Math.max(this.$content.height(),this._defaultHeadHeight)
		$list.css({top:height})
	}

	fn._inputClick  =function(){
		var self = this;
		var $list =this.$list;
		var $head = this.$head;
		$head.click(function(e){
			$list.removeClass('hidden');
			$list.scrollTop(0);
			var height = Math.max(self.$content.height(),self._defaultHeadHeight)
			$list.css({top:height})
			e.stopPropagation();
		});
	}

	fn._contentClick =function(e){
		var self = this;
		this.$content.on('click','.sc-selected-item',function(e){
			var key = $(this).attr('data-value');
			self.removeSelected(key);
			e.stopPropagation();
		})
		
	}
	fn._listClick =function(){
		var self = this;
		$(self.$list).on('click','li',function(e){
			var key = $(this).attr('data-value');
			var value = $('span',$(this)).html();
			var checkbox = $('input[type=checkbox]',self.$list);
			if(checkbox.attr("checked")){
				self.removeSelected(key);
			}else{
				self.addSelected(key,value);
			}
			e.stopPropagation();
		})
	}
	return select;
}();