<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2015-04-21 21:29:01                           *
 *   This file is autogenerated - do not edit.                               *
 *****************************************************************************/

	abstract class AutoProtoAbstractPoint extends AbstractProtoClass
	{
		protected function makePropertyList()
		{
			return array(
				'id' => LightMetaProperty::fill(new LightMetaProperty(), 'id', null, 'integerIdentifier', 'AbstractPoint', 8, true, true, false, null, null),
				'pointType' => LightMetaProperty::fill(new LightMetaProperty(), 'pointType', 'point_type_id', 'enumeration', 'PointType', null, true, false, false, 1, 3),
				'POIType' => LightMetaProperty::fill(new LightMetaProperty(), 'POIType', '_p_o_i_type_id', 'enumeration', 'POIType', null, true, false, false, 1, 3),
				'name' => LightMetaProperty::fill(new LightMetaProperty(), 'name', null, 'string', null, 255, true, true, false, null, null),
				'lat' => LightMetaProperty::fill(new LightMetaProperty(), 'lat', null, 'float', null, 4, true, true, false, null, null),
				'lng' => LightMetaProperty::fill(new LightMetaProperty(), 'lng', null, 'float', null, 4, true, true, false, null, null)
			);
		}
	}
?>