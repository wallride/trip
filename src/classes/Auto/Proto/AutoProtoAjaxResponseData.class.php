<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:08                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoProtoAjaxResponseData extends ProtoAjaxResponse
	{
		protected function makePropertyList()
		{
			return
				array_merge(
					parent::makePropertyList(),
					array(
						'data' => LightMetaProperty::fill(new LightMetaProperty(), 'data', null, 'binary', null, null, false, true, false, null, null)
					)
				);
		}
	}
?>