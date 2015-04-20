<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2010-11-25 20:32:06                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/
	
	/**
	 * @author motivator
	 * @deprecated
	 * @uses AjaxStatusResponse
	 */
	class AjaxResponse extends AutoAjaxResponse implements Prototyped
	{
		/**
		 * @return AjaxResponse
		**/
		public static function create()
		{
			return new self;
		}
		
		
		/**
		 * @return ProtoAjaxResponse
		**/
		public static function proto()
		{
			return Singleton::getInstance('ProtoAjaxResponse');
		}
		
		// your brilliant stuff goes here
		
		/**
		 * @return array
		 */
		public function toArray()
		{
			$array = array();
			
			if(
				$this->getName()
			)
				$array['name']=$this->getName();
				
			if(
				$this->getDescription()
			)
				$array['description']=$this->getDescription();
				
			if(
				$this->getStatus()
			)
				$array['code']=$this->getStatus()->getName();
				
			

			return $array;
		}
		
		/**
		 * @return string
		 */
		public function toJson()
		{
			if(
				$this instanceof IArrayable
			)
				return json_encode($this->toArray() );

			throw new WrongStateException(
				__METHOD__
				.': '
				._('This class must implement the interface IArrayable because json_encode, like working with the data type of the array')
			);			
		}
	}
?>