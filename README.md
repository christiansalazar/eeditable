#EEditable

EEditable is a jQuery extension for Yii Framework applications enabling your 
application to make a tag editable by the end user. A Special class is provided
for CGridView: EEditableColumn, this class enabling your CGridView to make
an editable column.

![Example][1]
![Example][2]

This extension is designed to be used with/without Yii Framework application
this not limit the usage outside the Yii Framework limits, please refeer
to the first example below this lines to know how.

##Example 1: In a non-yiiframework application.

	<table id='some'>
		<tr>
			<!-- this will select a editbox when clicking over it -->
			<td editable_type='editbox' 
				editable_action='some url to send a post via ajax request'
				editable_id='someUniqueId', editable_name='someColName1'>
				value to be edited when clicking over it
			</td>
			<!-- this will display a select having the values provided 
			in the inner select tag -->
			<td editable_type='select' 
				editable_action='some url to send a post via ajax request'
				editable_id='someUniqueId', editable_name='someColName2'>
					<select style='display:none;' class='editable_options'>
						<option value='1'>Yes</option>
						<option value='0'>No</option>
					</select>
				No
			</td>
		</tr>
	</table>
	<script>$('#some').EEditable();</script>

##Example 2: In a Yii Framework application: As a CGridView column.
	
This jQuery Extension can be used via special column inserted into your
CGridView, using the attribute: class='EEditableColumn'.

	<?php
	Yii::import('application.extensions.eeditable.*');

	$grid_id = 'some-grid-view';
	$this->widget('zii.widgets.grid.CGridView', array(
		'id'=>$grid_id,
		'dataProvider'=>$dataProvider,
		'columns'=>array(
			array('name'=>'firstname'),
			array('name'=>'example_field',
				'class'=>'EEditableColumn', 'editable_type'=>'editbox',
				'action'=>array('/some/ajaxeditcolumn'),
				// see also: 'How-To Customize the User Input' about more attributes.
			),
			array('name'=>'example_field_2',
				'class'=>'EEditableColumn', 'editable_type'=>'select',
				'editable_options'=>
					array(-1=>'--select--','1'=>'Yes','0'=>'No','3'=>'maybe!'),
				'action'=>array('/some/ajaxeditcolumn'),
			),
		),
	));
	?>

#At Server Side

This jQuery extension send a POST to the action defined in the tag attribute named: 'editable_action'. When used as a EEditableColumn then this url is provided via 'action' option (example: 'action'=>array('/some/ajaxeditcolumn')). The action send a POST (via ajax) to your server having this keys:

	keyvalue	commonly identifyes the primary key value
	name		the 'name' attribute value in your column definition
	old_value	the original value previous to edition
	new_value	the new value typed by the end user

As return, the ajax call expects from you to 'echo' the accepted value.

	public function actionAjaxEditColumn(){
		$keyvalue	= $_POST["keyvalue"];  	// ie: 'userid123'
		$name		= $_POST["name"];	// ie: 'firstname'
		$old_value  = $_POST["old_value"];	// ie: 'patricia'
		$new_value  = $_POST["new_value"];	// ie: '  paTTy '

		// do some stuff here, and return the value to be displayed..
		$new_value = ucfirst(trim($new_value));
		echo $new_value;			// Patty
	}

#How-To Customize the User Input

The following item is related to YiiFramework. (For non-yiiframework applications take a look at raw html to see how it works, is very easy).

Two things comes in help with this issue:

a) The attribute 'input_options', is an array declared for each column defining customized values for the input element.

	'input_options'=>array('data-mask'=>'000-000','class'=>'someclass','rel'=>'abc'),

b) An optional callback js function declared in your page having this format, it will be used only if declared:

	<?php
	Yii::app()->getClientScript()->registerScript("some_script_id","
		/*
			called only if declared. hardwired.

		 	event_name	string	'on_create', 'on_ajax'
			input		object	the jquery wrapped input object
			tag			object	the jquery wrapped object containing more info
		 */
		function eeditable_callback(event_name, input,tag){
			if('on_create' == event_name) {
				// example using the jQuery.mask plugin
				if(undefined != input.attr('data-mask'))
					input.mask(input.attr('data-mask'));
			}
			if('on_ajax' == event_name){
				
				return true;
			}
		}
	",CClientScript::POS_HEAD);
	?>

#Exception Thrown when using CArrayDataProvider, why ?

An exception is thrown when a CArrayDataProvided is used and when the keyField 
is not defined:

	The provided keyField 'id' is not defined in your data columns or array indexes 

How to fix:

Set a value in the 'keyField' attribute, look at the provided example below this lines:

	$yourData = array(array("firstname"=>"jhonn","lastname"=>"doe"), ... );
	$dp = new CArrayDataProvider($yourData,array(
		'id'=>'someid',
		'keyField'=>'firstname',
		'pagination'=>array('pageSize'=>10),
	));

When using this extension on a CActiveDataProvider then this problem doesn't occurs.

#Implementing CSRF Tokens

Please refeer to [issue #4](https://github.com/christiansalazar/eeditable/issues/4) to know more about how to successfully implement a CSRF token. (Thanks to: [Daniel](https://github.com/dadinugroho))  


[1]:https://raw.githubusercontent.com/christiansalazar/eeditable/master/eeditable1.png
[2]:https://raw.githubusercontent.com/christiansalazar/eeditable/master/eeditable2.png


