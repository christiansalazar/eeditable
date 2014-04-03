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
[1]:https://raw.githubusercontent.com/christiansalazar/eeditable/master/eeditable1.png
[2]:https://raw.githubusercontent.com/christiansalazar/eeditable/master/eeditable2.png
