<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-03-25 00:59:32                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/

	final class StoryUsersDAO extends ManyToManyLinked
	{
		public function __construct(Story $story, $lazy = false)
		{
			parent::__construct(
				$story,
				User::dao(),
				$lazy
			);
		}
		
		/**
		 * @return StoryUsersDAO
		**/
		public static function create(Story $story, $lazy = false)
		{
			return new self($story, $lazy);
		}
		
		public function getHelperTable()
		{
			return 'story_user';
		}
		
		public function getChildIdField()
		{
			return 'user_id';
		}
		
		public function getParentIdField()
		{
			return 'story_id';
		}
	}
?>