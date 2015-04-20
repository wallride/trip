<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:08                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoAuthToken extends IdentifiableObject
	{
		protected $user = null;
		protected $userId = null;
		protected $lifeTimeMinutes = null;
		protected $createDate = null;
		protected $lastActivityDate = null;
		protected $expireDate = null;
		protected $ip = null;
		
		public function __sleep()
		{
			return array('id', 'userId', 'lifeTimeMinutes', 'createDate', 'lastActivityDate', 'expireDate', 'ip');
		}
		
		/**
		 * @return User
		**/
		public function getUser()
		{
			if (!$this->user && $this->userId) {
				$this->user = User::dao()->getById($this->userId);
			}
			
			return $this->user;
		}
		
		public function getUserId()
		{
			return $this->userId;
		}
		
		/**
		 * @return AuthToken
		**/
		public function setUser(User $user)
		{
			$this->user = $user;
			$this->userId = $user->getId();
			
			return $this;
		}
		
		/**
		 * @return AuthToken
		**/
		public function setUserId($id)
		{
			$this->user = null;
			$this->userId = $id;
			
			return $this;
		}
		
		/**
		 * @return AuthToken
		**/
		public function dropUser()
		{
			$this->user = null;
			$this->userId = null;
			
			return $this;
		}
		
		public function getLifeTimeMinutes()
		{
			return $this->lifeTimeMinutes;
		}
		
		/**
		 * @return AuthToken
		**/
		public function setLifeTimeMinutes($lifeTimeMinutes)
		{
			$this->lifeTimeMinutes = $lifeTimeMinutes;
			
			return $this;
		}
		
		/**
		 * @return Timestamp
		**/
		public function getCreateDate()
		{
			return $this->createDate;
		}
		
		/**
		 * @return AuthToken
		**/
		public function setCreateDate(Timestamp $createDate)
		{
			$this->createDate = $createDate;
			
			return $this;
		}
		
		/**
		 * @return AuthToken
		**/
		public function dropCreateDate()
		{
			$this->createDate = null;
			
			return $this;
		}
		
		/**
		 * @return Timestamp
		**/
		public function getLastActivityDate()
		{
			return $this->lastActivityDate;
		}
		
		/**
		 * @return AuthToken
		**/
		public function setLastActivityDate(Timestamp $lastActivityDate)
		{
			$this->lastActivityDate = $lastActivityDate;
			
			return $this;
		}
		
		/**
		 * @return AuthToken
		**/
		public function dropLastActivityDate()
		{
			$this->lastActivityDate = null;
			
			return $this;
		}
		
		/**
		 * @return Timestamp
		**/
		public function getExpireDate()
		{
			return $this->expireDate;
		}
		
		/**
		 * @return AuthToken
		**/
		public function setExpireDate(Timestamp $expireDate)
		{
			$this->expireDate = $expireDate;
			
			return $this;
		}
		
		/**
		 * @return AuthToken
		**/
		public function dropExpireDate()
		{
			$this->expireDate = null;
			
			return $this;
		}
		
		public function getIp()
		{
			return $this->ip;
		}
		
		/**
		 * @return AuthToken
		**/
		public function setIp($ip)
		{
			$this->ip = $ip;
			
			return $this;
		}
	}
?>