<?php
/**
 * EEditableColumn 
 *
 *	Creates an editable column in your CGridView.
 *
 *	please refer to README.md for an example.
 * 
 * @uses CDataColumn
 * @author Cristian Salazar H. <christiansalazarh@gmail.com> @salazarchris74 
 * @license FreeBSD {@link http://www.freebsd.org/copyright/freebsd-license.html}
 */
class EEditableColumn extends CDataColumn {
	public $editable_type;		// "editbox","select" (required array in editable_options)
	public $editable_options;	// array(1=>'yes',0=>'no')
	public $action;				// the action receptor when receiving changes. 
								//	array('someaction')
	public $input_options;		// array('data-mask'=>'000-000', 'class'=>'my')

	public function renderDataCell($row)
	{
		$dummy = new EEditable($this->grid->id);
		$data=$this->grid->dataProvider->data[$row];
		$options=$this->htmlOptions;
		if($this->cssClassExpression!==null) {
			$class=$this->evaluateExpression($this->cssClassExpression,
					array('row'=>$row,'data'=>$data));
			if(!empty($class)){
				if(isset($options['class']))
				$options['class'].=' '.$class;
			else
				$options['class']=$class;
			}
		}
		if(null != $this->editable_type){
			$options['editable_type'] = $this->editable_type;
			$options['editable_name'] = $this->name;
			$keyValue = "0";
			if(isset($this->grid->dataProvider->keyField)){
				$dpKeyField = $this->grid->dataProvider->keyField; 
				if(!isset($data[$dpKeyField]))
					throw new Exception("The provided keyField '$dpKeyField' "
						."is not defined in your data columns or array indexes");
				$keyValue = $data[$dpKeyField];
			}else{
				$keyValue = $data->primarykey;
			}
			$options['editable_action'] = CHtml::normalizeUrl($this->action);
			$options['editable_id'] = $keyValue;
			if($this->input_options) $options['editable_data'] = 
				new CJavaScriptExpression("[".CJavaScript::encode(
					$this->input_options)."]");
		}
		echo CHtml::openTag('td',$options);
			if($this->editable_type=='select'){
				echo "\n<select class='editable_options' style='display:none;'>\n";
				foreach($this->editable_options as $value=>$label)
					echo "\t<option value='$value'>$label</option>\n";
				echo "</select>\n";
			}
		$this->renderDataCellContent($row,$data);
		echo '</td>';
	}
}
