<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-26 13:10:55                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoProtoTask extends ProtoBaseTaskModel
	{
		protected function makePropertyList()
		{
			return
				array_merge(
					parent::makePropertyList(),
					array(
						'id' => LightMetaProperty::fill(new LightMetaProperty(), 'id', null, 'integerIdentifier', 'Task', 8, true, true, false, null, null),
						'requirement' => LightMetaProperty::fill(new LightMetaProperty(), 'requirement', 'requirement_id', 'integerIdentifier', 'Requirement', null, true, false, false, 1, 3),
						'name' => LightMetaProperty::fill(new LightMetaProperty(), 'name', null, 'string', null, 255, true, true, false, null, null),
						'description' => LightMetaProperty::fill(new LightMetaProperty(), 'description', null, 'string', null, null, false, true, false, null, null),
						'sortOrder' => LightMetaProperty::fill(new LightMetaProperty(), 'sortOrder', 'sort_order', 'integer', null, 4, false, true, false, null, null)
					)
				);
		}
	}
?>