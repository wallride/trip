<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:08                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoUserDAO extends CreatedAndModifiedDAO
	{
		public function getTable()
		{
			return 'user';
		}
		
		public function getObjectName()
		{
			return 'User';
		}
		
		public function getSequence()
		{
			return 'user_id';
		}
	}
?>