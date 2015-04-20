<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:07                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoCreatedAndModified extends IdentifiableObject implements IArrayable, IExtendedArrayable
	{
		protected $dateCreate = null;
		protected $dateModify = null;
		
		public function __sleep()
		{
			return array('id', 'dateCreate', 'dateModify');
		}
		
		/**
		 * @return Timestamp
		**/
		public function getDateCreate()
		{
			return $this->dateCreate;
		}
		
		/**
		 * @return CreatedAndModified
		**/
		public function setDateCreate(Timestamp $dateCreate)
		{
			$this->dateCreate = $dateCreate;
			
			return $this;
		}
		
		/**
		 * @return CreatedAndModified
		**/
		public function dropDateCreate()
		{
			$this->dateCreate = null;
			
			return $this;
		}
		
		/**
		 * @return Timestamp
		**/
		public function getDateModify()
		{
			return $this->dateModify;
		}
		
		/**
		 * @return CreatedAndModified
		**/
		public function setDateModify(Timestamp $dateModify)
		{
			$this->dateModify = $dateModify;
			
			return $this;
		}
		
		/**
		 * @return CreatedAndModified
		**/
		public function dropDateModify()
		{
			$this->dateModify = null;
			
			return $this;
		}
	}
?>