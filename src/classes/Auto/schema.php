<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-04-02 00:08:41                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	$schema = new DBSchema();
	
	$schema->
		addTable(
			DBTable::create('auth_token')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::UUID)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'user_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::INTEGER),
					'life_time_minutes'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'create_date'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'last_activity_date'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'expire_date'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setSize(30),
					'ip'
				)
			)
		);
	
	$schema->
		addTable(
			DBTable::create('autologin_token')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::UUID)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'user_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'create_date'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'last_activity_date'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'expire_date'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setSize(30),
					'last_activity_ip'
				)
			)
		);
	
	$schema->
		addTable(
			DBTable::create('user')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)->
				setAutoincrement(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date_create'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'date_modify'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setNull(false)->
					setSize(255),
					'name'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setNull(false)->
					setSize(255),
					'first_name'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setSize(255),
					'middle_name'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setSize(255),
					'last_name'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setNull(false)->
					setSize(255),
					'email'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'auth_id'
				)
			)
		);
	
	$schema->
		addTable(
			DBTable::create('auth')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)->
				setAutoincrement(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setSize(255),
					'email'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setSize(255),
					'password'
				)
			)
		);
	
	$schema->
		addTable(
			DBTable::create('story')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)->
				setAutoincrement(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date_create'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'date_modify'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setNull(false)->
					setSize(255),
					'name'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TEXT),
					'description'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date_start'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'owner_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BOOLEAN),
					'public'
				)->
				setDefault(false)
			)
		);
	
	$schema->
		addTable(
			DBTable::create('member')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)->
				setAutoincrement(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date_create'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'date_modify'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::VARCHAR)->
					setSize(255),
					'title'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'user_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'story_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'type_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'status_id'
				)
			)
		);
	
	$schema->
		addTable(
			DBTable::create('story_period')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)->
				setAutoincrement(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date_create'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'date_modify'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'story_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TEXT),
					'description'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date'
				)
			)
		);
	
	$schema->
		addTable(
			DBTable::create('story_record')->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'id'
				)->
				setPrimaryKey(true)->
				setAutoincrement(true)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date_create'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP),
					'date_modify'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'story_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'story_period_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TEXT),
					'description'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::TIMESTAMP)->
					setNull(false),
					'date'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BIGINT)->
					setNull(false),
					'owner_id'
				)
			)->
			addColumn(
				DBColumn::create(
					DataType::create(DataType::BOOLEAN),
					'public'
				)->
				setDefault(false)
			)
		);
	
	// auth_token.user_id -> user.id
	$schema->
		getTableByName('auth_token')->
		getColumnByName('user_id')->
		setReference(
			$schema->
				getTableByName('user')->
				getColumnByName('id'),
				ForeignChangeAction::restrict(),
				ForeignChangeAction::cascade()
			);
	
	// autologin_token.user_id -> user.id
	$schema->
		getTableByName('autologin_token')->
		getColumnByName('user_id')->
		setReference(
			$schema->
				getTableByName('user')->
				getColumnByName('id'),
				ForeignChangeAction::restrict(),
				ForeignChangeAction::cascade()
			);
	
?>