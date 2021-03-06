<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-04-21 21:29:01                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/

	class Trip extends AutoTrip implements Prototyped, DAOConnected
	{
		/**
		 * @return Trip
		**/
		public static function create()
		{
			return new self;
		}
		
		/**
		 * @return TripDAO
		**/
		public static function dao()
		{
			return Singleton::getInstance('TripDAO');
		}
		
		/**
		 * @return ProtoTrip
		**/
		public static function proto()
		{
			return Singleton::getInstance('ProtoTrip');
		}
		
		// your brilliant stuff goes here
	}
?>