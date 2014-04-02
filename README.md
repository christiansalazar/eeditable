#EEditable

EEditable is a jQuery extension for Yii Framework applications enabling your 
application to make a tag editable by the end user. A Special class is provided
for CGridView: EEditableColumn, this class enabling your CGridView to make
an editable column.

This extension is designed to be used with/without Yii Framework application
this not limit the usage outside the Yii Framework limits, please refeer
to the first example below this lines to know how.

##Example 1: In a non-yiiframework:

	<table id='some'>
		<tr>
			<td editable_type='editbox' 
				editable_action='some url to send a post via ajax request'
				editable_id='someUniqueId', editable_name='someColName'>
				value to be edited when clicking over it
			</td>
		</tr>
	</table>
	<script>$('#some').EEditable();</script>

##Example 2: In a CGridView
	
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
		),
	));
	?>

#Handling Values Changed at Server Side

This jQuery extension sends a POST to the defined action, having four values, 
defined as follows:

	keyvalue	commonly identifyes the primary key value
	name		the 'name' attribute value in your column definition
	old_value	the original value previous to edition
	new_value	the new value typed by the end user

As return, the ajax call expects from you to return the accepted value.

In order to make this thing works provide the action url (as array url) 
in the column definition 'action'=>array('/some/ajaxeditcolumn'). 
This will fire changes to the provided url in your controller:
	
	public function actionAjaxEditColumn(){
		$keyvalue	= $_POST["keyvalue"];  	// ie: 'userid123'
		$name		= $_POST["name"];		// ie: 'firstname'
		$old_value  = $_POST["old_value"];	// ie: 'patricia'
		$new_value  = $_POST["new_value"];	// ie: '  paTTy '

		// do some stuff here, and return the value to be displayed..
		$new_value = ucfirst(trim($new_value));
		echo $new_value;					// Patty
	}

#Exception Thrown when using CArrayDataProvider, why ?

An exception is thrown when a CArrayDataProvided is used and when the keyField 
is not defined:

	The provided keyField 'id' is not defined in your data columns or array indexes 

How to fix:

	$yourData = array(array("firstname"=>"jhonn","lastname"=>"doe"), ... );
	$dp = new CArrayDataProvider($yourData,array(
		'id'=>'someid',
		'keyField'=>'firstname',
		'pagination'=>array('pageSize'=>10),
	));

When using this extension on a CActiveDataProvider then this problem doesnt occur.
