<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-24 13:38:09                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/

	final class UserAccountIssuesDAO extends OneToManyLinked
	{
		public function __construct(UserAccount $userAccount, $lazy = false)
		{
			parent::__construct(
				$userAccount,
				UserAccountIssue::dao(),
				$lazy
			);
		}
		
		/**
		 * @return UserAccountIssuesDAO
		**/
		public static function create(UserAccount $userAccount, $lazy = false)
		{
			return new self($userAccount, $lazy);
		}
		
		public function getParentIdField()
		{
			return 'user_account_id';
		}
	}
?>