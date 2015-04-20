<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2014-09-25 16:55:17                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/

class EnumObjectStatus extends Enumeration
{
    const NEW_STATUS = 1;
    const ACTIVE_STATUS = 2;
    const DELETED_STATUS = 3;

    protected $names= array(
        self::NEW_STATUS=>'New',
        self::ACTIVE_STATUS=>'Active',
        self::DELETED_STATUS=>'Deleted',
    );

    /**
     * @return \self 
     */
    public static function statusNew(){
        return new self(self::NEW_STATUS);
    }
    /**
     * @return \self 
     */
    public static function statusActive(){
        return new self(self::ACTIVE_STATUS);
    }
    /**
     * @return \self 
     */
    public static function statusDeleted(){
        return new self(self::DELETED_STATUS);
    }
    public function toArray() {
        return array('code'=>$this->getName());
    }
    
}
?>