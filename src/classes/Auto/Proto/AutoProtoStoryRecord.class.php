<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-03-30 23:34:59                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoProtoStoryRecord extends ProtoCreatedAndModified
	{
		protected function makePropertyList()
		{
			return
				array_merge(
					parent::makePropertyList(),
					array(
						'id' => LightMetaProperty::fill(new LightMetaProperty(), 'id', null, 'integerIdentifier', 'StoryRecord', 8, true, true, false, null, null),
						'story' => LightMetaProperty::fill(new LightMetaProperty(), 'story', 'story_id', 'integerIdentifier', 'Story', null, true, false, false, 1, 3),
						'storyPeriod' => LightMetaProperty::fill(new LightMetaProperty(), 'storyPeriod', 'story_period_id', 'integerIdentifier', 'StoryPeriod', null, true, false, false, 1, 3),
						'description' => LightMetaProperty::fill(new LightMetaProperty(), 'description', null, 'string', null, null, false, true, false, null, null),
						'date' => LightMetaProperty::fill(new LightMetaProperty(), 'date', null, 'timestamp', 'Timestamp', null, true, true, false, null, null),
						'owner' => LightMetaProperty::fill(new LightMetaProperty(), 'owner', 'owner_id', 'integerIdentifier', 'Member', null, true, false, false, 1, 3),
						'public' => LightMetaProperty::fill(new LightMetaProperty(), 'public', null, 'boolean', null, null, false, true, false, null, null)
					)
				);
		}
	}
?>