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
	var _getKeyName = function(tag){
		return tag.attr('editable_name');
	}
	var _getKeyValue = function(tag){
		return tag.attr('editable_id');
	}
	var _reset = function(tag){
		if(!tag) return;
		var saved_value = tag.data('eeditablegrid_value');
		tag.html(saved_value);
		tag.data('eeditablegrid_state','');
	}
	var _accept = function(tag){
		if(!tag) return;
		var saved_value = tag.data('eeditablegrid_value');
		var new_value = tag.find('input').val();
		if((new_value != null) && (new_value != saved_value)){
			tag.find('input').attr('disabled','disabled');
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
	}
	var _editBox = function(tag){
		if('edit' == tag.data('eeditablegrid_state')){
			
		}else{
			var value = tag.html();
			tag.data('eeditablegrid_state','edit');
			tag.data('eeditablegrid_value',value);
			tag.html('<input type=\'text\' />');
			tag.find('input').val(value);
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
		$(this).find('[editable_type=editbox]').each(function(index,tag){
			$(tag).click(function(){
				var _tag = $(this);
				if('edit' != _tag.data('eeditablegrid_state')){
					var _prevtag = _getPrevious();
					_accept(_prevtag);
					_setCurrent(_tag);
					_editBox(_tag);
				}
			});
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
