<?php
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
class EEditable {
	public function __construct($gridview_id){
		$cs = Yii::app()->getClientScript();
		$assets_url = Yii::app()->getAssetManager()->publish(
			rtrim(dirname(__FILE__),"/")."/assets")."/";
		$cs->registerScriptFile($assets_url."eeditable.js");
		Yii::app()->getClientScript()->registerScript(
		"eeditable_script",
		"$('#$gridview_id').EEditable();",CClientScript::POS_LOAD);
	}
}
