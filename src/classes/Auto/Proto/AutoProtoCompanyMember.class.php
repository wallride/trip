<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-25 17:25:39                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoProtoCompanyMember extends ProtoCreatedAndModified
	{
		protected function makePropertyList()
		{
			return
				array_merge(
					parent::makePropertyList(),
					array(
						'id' => LightMetaProperty::fill(new LightMetaProperty(), 'id', null, 'integerIdentifier', 'CompanyMember', 8, true, true, false, null, null),
						'company' => LightMetaProperty::fill(new LightMetaProperty(), 'company', 'company_id', 'integerIdentifier', 'Company', null, true, false, false, 1, 3),
						'user' => LightMetaProperty::fill(new LightMetaProperty(), 'user', 'user_id', 'integerIdentifier', 'User', null, true, false, false, 1, 3),
						'status' => LightMetaProperty::fill(new LightMetaProperty(), 'status', 'status_id', 'enumeration', 'EnumObjectStatus', null, true, false, false, 1, 3),
						'costHour' => LightMetaProperty::fill(new LightMetaProperty(), 'costHour', 'cost_hour', 'float', null, 4, false, true, false, null, null),
						'position' => LightMetaProperty::fill(new LightMetaProperty(), 'position', null, 'string', null, 255, false, true, false, null, null),
						'canAdmin' => LightMetaProperty::fill(new LightMetaProperty(), 'canAdmin', 'can_admin', 'boolean', null, null, true, true, false, null, null),
						'canSeeDeals' => LightMetaProperty::fill(new LightMetaProperty(), 'canSeeDeals', 'can_see_deals', 'boolean', null, null, true, true, false, null, null),
						'canSeeProjects' => LightMetaProperty::fill(new LightMetaProperty(), 'canSeeProjects', 'can_see_projects', 'boolean', null, null, true, true, false, null, null),
						'canSeeRequirements' => LightMetaProperty::fill(new LightMetaProperty(), 'canSeeRequirements', 'can_see_requirements', 'boolean', null, null, true, true, false, null, null)
					)
				);
		}
	}
?>