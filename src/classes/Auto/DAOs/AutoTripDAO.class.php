<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-04-21 21:29:01                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoTripDAO extends CreatedAndModifiedDAO
	{
		public function getTable()
		{
			return 'trip';
		}
		
		public function getObjectName()
		{
			return 'Trip';
		}
		
		public function getSequence()
		{
			return 'trip_id';
		}
	}
?>