<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:08                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoUserAccount extends CreatedAndModified
	{
		protected $freeUntilDate = null;
		protected $balance = 0;
		protected $bonus = 0;
		protected $issues = null;
		
		public function __sleep()
		{
			return array_merge(
				parent::__sleep(),
				array('id', 'freeUntilDate', 'balance', 'bonus')
			);
		}
		
		/**
		 * @return Date
		**/
		public function getFreeUntilDate()
		{
			return $this->freeUntilDate;
		}
		
		/**
		 * @return UserAccount
		**/
		public function setFreeUntilDate(Date $freeUntilDate)
		{
			$this->freeUntilDate = $freeUntilDate;
			
			return $this;
		}
		
		/**
		 * @return UserAccount
		**/
		public function dropFreeUntilDate()
		{
			$this->freeUntilDate = null;
			
			return $this;
		}
		
		public function getBalance()
		{
			return $this->balance;
		}
		
		/**
		 * @return UserAccount
		**/
		public function setBalance($balance)
		{
			$this->balance = $balance;
			
			return $this;
		}
		
		public function getBonus()
		{
			return $this->bonus;
		}
		
		/**
		 * @return UserAccount
		**/
		public function setBonus($bonus)
		{
			$this->bonus = $bonus;
			
			return $this;
		}
		
		/**
		 * @return UserAccountIssuesDAO
		**/
		public function getIssues($lazy = false)
		{
			if (!$this->issues || ($this->issues->isLazy() != $lazy)) {
				$this->issues = new UserAccountIssuesDAO($this, $lazy);
			}
			
			return $this->issues;
		}
		
		/**
		 * @return UserAccount
		**/
		public function fillIssues($collection, $lazy = false)
		{
			$this->issues = new UserAccountIssuesDAO($this, $lazy);
			
			if (!$this->id) {
				throw new WrongStateException(
					'i do not know which object i belong to'
				);
			}
			
			$this->issues->mergeList($collection);
			
			return $this;
		}
	}
?>