<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2012-02-02 18:20:11                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/

	abstract class CreatedAndModified extends AutoCreatedAndModified implements Prototyped
	{
		// your brilliant stuff goes here
            
            public function toArray() {
                return array('id'=>$this->getId());
            }
            
            public function toExtendedArray() {
                return array_merge($this->toArray(),
                        array(
                            'date'=>array(
                                'create'=>$this->getDateCreate()->toString(),
                                'modify'=>$this->getDateModify()->toString(),
                            )
                        )
                );
            }
	}
?>