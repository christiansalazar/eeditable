/**
 * EEditable 
 *
 *	jQuery Extension makes an HTML element editable by the final user.
 *
 *	usage:
 *
 *		see README.md
 *
 * @author Cristian Salazar H. <christiansalazarh@gmail.com> @salazarchris74 
 * @license FreeBSD {@link http://www.freebsd.org/copyright/freebsd-license.html}
 */
$.fn.EEditable = function(){
	var on_create = function(input, tag){
		if(typeof eeditable_callback === 'function')
			eeditable_callback('on_create', input, tag);
	}
	var on_ajax = function(input, tag){
		if(typeof eeditable_callback === 'function'){
			return eeditable_callback('on_ajax', input, tag);
		}else
		return true;
	}
	var _getKeyName = function(tag){
		return tag.attr('editable_name');
	}
	var _getKeyValue = function(tag){
		return tag.attr('editable_id');
	}
	var _getInputElement = function(tag){
		if('editbox'==tag.attr('editable_type'))  return tag.find('input');
		if('select'==tag.attr('editable_type'))  return tag.find('select');
		return null;
	}
	var _reset = function(tag){
		if(!tag) return;
		var saved_value = tag.data('eeditablegrid_value');
		if('select' == tag.attr('editable_type')){
			var options = tag.data('editable_options');	
			$.each(options, function(index,entry){
				if(entry.value == saved_value)
					tag.html(entry.label);
			});
		}else
		tag.html(saved_value);
		tag.data('eeditablegrid_state','');
	}
	var _accept = function(tag){
		if(!tag) return;
		var saved_value = tag.data('eeditablegrid_value');
		var new_value = 0;
		if('editbox'==tag.attr('editable_type')) new_value = tag.find('input').val();
		if('select'==tag.attr('editable_type')) {
			new_value = tag.find('select option:selected').val();
		}
		if((new_value != null) && (new_value != saved_value)){
			tag.find('input').attr('disabled','disabled');
			if(true==on_ajax(_getInputElement(tag),tag)){
			$.ajax({
				url: tag.attr('editable_action'), type: 'post',
				data: { keyvalue: _getKeyValue(tag) , 
					name: _getKeyName(tag) , old_value: saved_value, 
						new_value: new_value },
				success: function(response){
					tag.data('eeditablegrid_value',response);
					_reset(tag);
					tag.find('input').attr('disabled',null);
				},
				error: function(e){
					alert(e.responseText);
					_reset(tag);
					tag.find('input').attr('disabled',null);
				}
			});
			}else{
				_reset(tag);
				tag.find('input').attr('disabled',null);
			}
		}else{
			_reset(tag);
			tag.find('input').attr('disabled',null);
		}
	}
	var _editBox = function(tag){
		if('edit' == tag.data('eeditablegrid_state')){
			return null;
		}else{
			var value = tag.html();
			tag.data('eeditablegrid_state','edit');
			tag.data('eeditablegrid_value',value);
			tag.html('<input type=\'text\' />');
			var input = tag.find('input');
			input.val(value);
			return input;
		}
	}
	var _select = function(tag){
		if('edit' == tag.data('eeditablegrid_state')){
			return null;
		}else{
			var options=[];
			tag.find('select.editable_options option').each(
				function(index,option){
				var value = $(option).attr('value');
				var label = $(option).html();
				options.push({value: value, label: label});
			});
			if(options.length > 0){
				tag.data('editable_options',options);
			}else{
				options = tag.data('editable_options');	
			}
			var value = tag.html();
			tag.data('eeditablegrid_state','edit');
			tag.data('eeditablegrid_value',value);
			tag.html('<select></select>');
			var select = tag.find('select');
			$.each(options,	function(index,entry){
				select.append('<option></option>');
				var _option = select.find('option:last');
				_option.attr('value',entry.value);
				_option.html(entry.label);
			});
			return select;
		}
	}
	$(this).each(function(){
		var _this = $(this);
		var _setCurrent = function(p){
			_this.data('eeditablegrid_prev',p);
		}
		var _getPrevious = function(){
			return _this.data('eeditablegrid_prev');
		}
		$(this).find('[editable_type=editbox],[editable_type=select]').each(function(index,tag){
			$(tag).click(function(){
				var _tag = $(this);
				if('edit' != _tag.data('eeditablegrid_state')){
					var _prevtag = _getPrevious();
					_accept(_prevtag);
					_setCurrent(_tag);
					var _type = _tag.attr('editable_type');
					var input_element = null;
					if("editbox"==_type) input_element = _editBox(_tag);
					if("select"==_type) input_element = _select(_tag);
					if(null != input_element){
						if(_tag.attr('editable_data')){
							var data = eval(_tag.attr('editable_data'));
							$.each(data,function(k,v){
								$.each(v, function(name,value){ 
									input_element.attr(name,value);
								})
							});
						}
						on_create(input_element,_tag);
					}
				}
			});
			if('select' == $(tag).attr('editable_type')){
				$(tag).change(function(){
					var _tag = $(this);
					_accept(_tag);	
				});	
			}
			$(tag).keyup(function(e){
				var _tag = $(this);
				if((27 == e.which) || (13 == e.which)){
					if(27 == e.which) _reset(_tag);
					if(13 == e.which) {
						_accept(_tag);
					}
				}
			});
		});
	});
}
