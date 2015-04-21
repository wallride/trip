<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-04-21 21:29:01                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoAbstractPoint extends IdentifiableObject implements IArrayable, IExtendedArrayable
	{
		protected $pointType = null;
		protected $pointTypeId = null;
		protected $POIType = null;
		protected $POITypeId = null;
		protected $name = null;
		protected $lat = null;
		protected $lng = null;
		
		public function __sleep()
		{
			return array('id', 'pointTypeId', 'POITypeId', 'name', 'lat', 'lng');
		}
		
		/**
		 * @return PointType
		**/
		public function getPointType()
		{
			if (!$this->pointType && $this->pointTypeId) {
				$this->pointType = new PointType($this->pointTypeId);
			}
			
			return $this->pointType;
		}
		
		public function getPointTypeId()
		{
			return $this->pointTypeId;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function setPointType(PointType $pointType)
		{
			$this->pointType = $pointType;
			$this->pointTypeId = $pointType->getId();
			
			return $this;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function setPointTypeId($id)
		{
			$this->pointType = null;
			$this->pointTypeId = $id;
			
			return $this;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function dropPointType()
		{
			$this->pointType = null;
			$this->pointTypeId = null;
			
			return $this;
		}
		
		/**
		 * @return POIType
		**/
		public function getPOIType()
		{
			if (!$this->POIType && $this->POITypeId) {
				$this->POIType = new POIType($this->POITypeId);
			}
			
			return $this->POIType;
		}
		
		public function getPOITypeId()
		{
			return $this->POITypeId;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function setPOIType(POIType $POIType)
		{
			$this->POIType = $POIType;
			$this->POITypeId = $POIType->getId();
			
			return $this;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function setPOITypeId($id)
		{
			$this->POIType = null;
			$this->POITypeId = $id;
			
			return $this;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function dropPOIType()
		{
			$this->POIType = null;
			$this->POITypeId = null;
			
			return $this;
		}
		
		public function getName()
		{
			return $this->name;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function setName($name)
		{
			$this->name = $name;
			
			return $this;
		}
		
		public function getLat()
		{
			return $this->lat;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function setLat($lat)
		{
			$this->lat = $lat;
			
			return $this;
		}
		
		public function getLng()
		{
			return $this->lng;
		}
		
		/**
		 * @return AbstractPoint
		**/
		public function setLng($lng)
		{
			$this->lng = $lng;
			
			return $this;
		}
	}
?>