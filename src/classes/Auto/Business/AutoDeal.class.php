<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-25 16:55:18                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoDeal extends CreatedAndModified
	{
		protected $client = null;
		protected $clientId = null;
		protected $executor = null;
		protected $executorId = null;
		protected $dateStart = null;
		protected $dateEnd = null;
		protected $costTotal = 0;
		
		public function __sleep()
		{
			return array_merge(
				parent::__sleep(),
				array('id', 'clientId', 'executorId', 'dateStart', 'dateEnd', 'costTotal')
			);
		}
		
		/**
		 * @return Company
		**/
		public function getClient()
		{
			if (!$this->client && $this->clientId) {
				$this->client = Company::dao()->getById($this->clientId);
			}
			
			return $this->client;
		}
		
		public function getClientId()
		{
			return $this->clientId;
		}
		
		/**
		 * @return Deal
		**/
		public function setClient(Company $client)
		{
			$this->client = $client;
			$this->clientId = $client->getId();
			
			return $this;
		}
		
		/**
		 * @return Deal
		**/
		public function setClientId($id)
		{
			$this->client = null;
			$this->clientId = $id;
			
			return $this;
		}
		
		/**
		 * @return Deal
		**/
		public function dropClient()
		{
			$this->client = null;
			$this->clientId = null;
			
			return $this;
		}
		
		/**
		 * @return Company
		**/
		public function getExecutor()
		{
			if (!$this->executor && $this->executorId) {
				$this->executor = Company::dao()->getById($this->executorId);
			}
			
			return $this->executor;
		}
		
		public function getExecutorId()
		{
			return $this->executorId;
		}
		
		/**
		 * @return Deal
		**/
		public function setExecutor(Company $executor)
		{
			$this->executor = $executor;
			$this->executorId = $executor->getId();
			
			return $this;
		}
		
		/**
		 * @return Deal
		**/
		public function setExecutorId($id)
		{
			$this->executor = null;
			$this->executorId = $id;
			
			return $this;
		}
		
		/**
		 * @return Deal
		**/
		public function dropExecutor()
		{
			$this->executor = null;
			$this->executorId = null;
			
			return $this;
		}
		
		/**
		 * @return Timestamp
		**/
		public function getDateStart()
		{
			return $this->dateStart;
		}
		
		/**
		 * @return Deal
		**/
		public function setDateStart(Timestamp $dateStart)
		{
			$this->dateStart = $dateStart;
			
			return $this;
		}
		
		/**
		 * @return Deal
		**/
		public function dropDateStart()
		{
			$this->dateStart = null;
			
			return $this;
		}
		
		/**
		 * @return Timestamp
		**/
		public function getDateEnd()
		{
			return $this->dateEnd;
		}
		
		/**
		 * @return Deal
		**/
		public function setDateEnd(Timestamp $dateEnd)
		{
			$this->dateEnd = $dateEnd;
			
			return $this;
		}
		
		/**
		 * @return Deal
		**/
		public function dropDateEnd()
		{
			$this->dateEnd = null;
			
			return $this;
		}
		
		public function getCostTotal()
		{
			return $this->costTotal;
		}
		
		/**
		 * @return Deal
		**/
		public function setCostTotal($costTotal)
		{
			$this->costTotal = $costTotal;
			
			return $this;
		}
	}
?>