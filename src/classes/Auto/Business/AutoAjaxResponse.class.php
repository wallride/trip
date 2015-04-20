<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:08                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoAjaxResponse implements IArrayable, IJsonable
	{
		protected $name = null;
		protected $description = null;
		protected $status = null;
		protected $statusId = null;
		
		public function __sleep()
		{
			return array('name', 'description', 'statusId');
		}
		
		public function getName()
		{
			return $this->name;
		}
		
		/**
		 * @return AjaxResponse
		**/
		public function setName($name)
		{
			$this->name = $name;
			
			return $this;
		}
		
		public function getDescription()
		{
			return $this->description;
		}
		
		/**
		 * @return AjaxResponse
		**/
		public function setDescription($description)
		{
			$this->description = $description;
			
			return $this;
		}
		
		/**
		 * @return AjaxStatusType
		**/
		public function getStatus()
		{
			if (!$this->status && $this->statusId) {
				$this->status = new AjaxStatusType($this->statusId);
			}
			
			return $this->status;
		}
		
		public function getStatusId()
		{
			return $this->statusId;
		}
		
		/**
		 * @return AjaxResponse
		**/
		public function setStatus(AjaxStatusType $status)
		{
			$this->status = $status;
			$this->statusId = $status->getId();
			
			return $this;
		}
		
		/**
		 * @return AjaxResponse
		**/
		public function setStatusId($id)
		{
			$this->status = null;
			$this->statusId = $id;
			
			return $this;
		}
		
		/**
		 * @return AjaxResponse
		**/
		public function dropStatus()
		{
			$this->status = null;
			$this->statusId = null;
			
			return $this;
		}
	}
?>