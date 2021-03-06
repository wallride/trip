<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2011-02-07 20:39:13                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/

	class AuthTokenDAO extends AutoAuthTokenDAO
	{
		// your brilliant stuff goes here
		
		/**
		 * @param uuid $id
		 * @param integer $expires
		 * @return AuthToken
		 */
		public function getByActualId($id, $expires=Cache::EXPIRES_MEDIUM)
		{
			return 
				$this->getByLogic(
					Expression::andBlock(
						Expression::eq(
							DBField::create(
								AuthToken::proto()->getPropertyByName('id')->getColumnName(),
								$this->getTable()
							),
							DBValue::create($id)
						),
						Expression::gtEq(
							DBField::create(
								AuthToken::proto()->getPropertyByName('expireDate')->getColumnName(),
								$this->getTable()
							),
							SQLFunction::create('now')
						)
					), 
					$expires
				);
		}
		
		
		/**
		 * @param uuid $id
		 * @param integer $expires
		 * @return AuthToken
		 */
		public function clean(AuthToken $token)
		{
			$logic = Expression::andBlock(
				Expression::notEq(
					DBField::create(
						AuthToken::proto()->getPropertyByName('id')->getColumnName(),
						$this->getTable()
					),
					DBValue::create($token->getId() )
				),
				Expression::eq(
					DBField::create(
						AuthToken::proto()->getPropertyByName('user')->getColumnName(),
						$this->getTable()
					),
					DBValue::create($token->getUserId() )
				)
			);
			
			try{
				$list = 
					$this->getListByLogic($logic, Cache::DO_NOT_CACHE);
				foreach ( $list as $item )
					$this->drop($item);
					
			} catch (ObjectNotFoundException $e) {/**/}
			
		}
		
		
		
		/**
		 * Быстрое обновление состояний
		 * @param AuthToken $object
		 * @param Timestamp $expire
		 * @return AuthToken
		 */
		public function update(AuthToken $object)
		{
			$minutes = $object->getLifeTimeMinutes();
			
			if($minutes)
			{
				$expire = Timestamp::create('+ '.$minutes.' minutes');
				$object->setExpireDate($expire);
			}
			
			$object->setLastActivityDate(
				Timestamp::makeNow()
			);
			
			return $this->take($object);
		}
		
	}
?>