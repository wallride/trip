<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-25 16:55:18                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoCompanyMemberDAO extends CreatedAndModifiedDAO
	{
		public function getTable()
		{
			return 'company_member';
		}
		
		public function getObjectName()
		{
			return 'CompanyMember';
		}
		
		public function getSequence()
		{
			return 'company_member_id';
		}
	}
?>