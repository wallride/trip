<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:07                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoProtoCreatedAndModified extends AbstractProtoClass
	{
		protected function makePropertyList()
		{
			return array(
				'id' => LightMetaProperty::fill(new LightMetaProperty(), 'id', null, 'integerIdentifier', 'CreatedAndModified', 8, true, true, false, null, null),
				'dateCreate' => LightMetaProperty::fill(new LightMetaProperty(), 'dateCreate', 'date_create', 'timestamp', 'Timestamp', null, true, true, false, null, null),
				'dateModify' => LightMetaProperty::fill(new LightMetaProperty(), 'dateModify', 'date_modify', 'timestamp', 'Timestamp', null, false, true, false, null, null)
			);
		}
	}
?>