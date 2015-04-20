<?php

	class User extends AutoUser implements Prototyped, DAOConnected, IArrayable
	{
		/**
		 * @return User
		**/
		public static function create()
		{
			return new self;
		}
		
		/**
		 * @return UserDAO
		**/
		public static function dao()
		{
			return Singleton::getInstance('UserDAO');
		}
		
		/**
		 * @return ProtoUser
		**/
		public static function proto()
		{
			return Singleton::getInstance('ProtoUser');
		}
		
                public function setFirstName($firstName) {
                    parent::setFirstName($firstName);
                    $this->setName(trim($this->getFirstName().' '.$this->getLastName()));
                }
                public function setLastName($lastName) {
                    parent::setLastName($lastName);
                    $this->setName(trim($this->getFirstName().' '.$this->getLastName()));
                }
                


                // Array object decoration
                
                public function toArray() {
                    return array(
                        'id'=>$this->getId(),
                        'name'=>$this->getName(),
                    );
                }
                
                public function toExtendedArray() {
                    $arr = parent::toExtendedArray();
                    $arr['firstName']=$this->getFirstName();
                    $arr['lastName']=$this->getLastName();
                    $arr['middleName']=$this->getMiddleName();
                    $arr['email']=$this->getEmail();
                    $arr['date']=array(
                        'create'=>$this->getDateCreate()->toString(),
                        'modify'=>$this->getDateModify()->toString(),
                    );
                    
                    return $arr;
                }
                
	}
?>