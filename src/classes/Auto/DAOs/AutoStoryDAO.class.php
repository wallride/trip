<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-04-02 00:08:41                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoStoryDAO extends CreatedAndModifiedDAO
	{
		public function getTable()
		{
			return 'story';
		}
		
		public function getObjectName()
		{
			return 'Story';
		}
		
		public function getSequence()
		{
			return 'story_id';
		}
		
		public function uncacheLists()
		{
			StoryPeriod::dao()->uncacheLists();
			
			return parent::uncacheLists();
		}
	}
?>