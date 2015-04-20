<?php
/*****************************************************************************
 *   Copyright (C) 2006-2009, onPHP's MetaConfiguration Builder.             *
 *   Generated by onPHP-1.1 at 2011-01-27 13:49:36                           *
 *   This file will never be generated again - feel free to edit.            *
 *****************************************************************************/

	class ResponseFormatType extends Enumeration
	{
		// implement me!
		
		const TYPE_XHTML			= 1;
		
		const TYPE_XML				= 2;
		
		const TYPE_JSON				= 3;
		
		const TYPE_RSS				= 4;
		
		const TYPE_JSONXSS			= 5;
		
		const TYPE_JSONP			= 6;

		const TYPE_CTPP				= 7;
		
		const DEFAULT_INTERFACE				= 'Controller';
		const DEFAULT_INTERFACE_METHOD		= 'handleRequest';
		
		protected $names = array(
			self::TYPE_XHTML => 'html',
			self::TYPE_XML => 'xml',
			self::TYPE_JSON => 'json',
			self::TYPE_JSONP => 'jsonp',
			self::TYPE_JSONXSS => 'jsonxss',
			self::TYPE_RSS	=> 'rss',
			self::TYPE_CTPP	=> 'ctpp',
		);
		
		
		protected $interfaces = array(
			self::TYPE_JSON => 'ControllerAjax',
			self::TYPE_JSONP => 'ControllerAjax',
			self::TYPE_JSONXSS => 'ControllerAjax',
			self::TYPE_CTPP		=> 'ControllerCtpp',
			
			self::TYPE_RSS => 'ControllerRss',
			self::TYPE_XML => 'ControllerXml',
		);
		
		protected $interfaceMethods	= array(
			self::TYPE_JSON => 'handleAjaxRequest',
			self::TYPE_JSONP => 'handleAjaxRequest',
			self::TYPE_JSONXSS => 'handleAjaxRequest',
			self::TYPE_CTPP => 'handleCtppRequest',
			
			self::TYPE_RSS => 'handleRssRequest',
			self::TYPE_XML => 'handleXmlRequest',
		);
		
		/*
		 * Какие интерфейсы нужно резолвить на шаблоны
		 * Необходимо для дополнительного ресолвинга шаблонов, в противном случае 
		 * не будет происходить ресолвинг т.е. не будет доп. нагрузки.
		 */
		protected $templateResolvable = array(
			self::TYPE_XHTML => self::TYPE_XHTML,
			
		);
		
		/**
		 * @param integer $id
		 * @return ResponseFormatType
		 */
		public static function wrap($id)
		{
			return new self($id);
		}
		
		
		public static function getByName($name)
		{
			$enum = new self( self::TYPE_XHTML );
			$nameList = $enum->getNameList();
			if( 
				($key = array_search($name, $nameList) ) &&
				$key !== FALSE
			)
				return new self($key);
				
//			throw new ObjectNotFoundException(
//				__METHOD__.': '.
//				_('Cannot find object by name:').
//				'"'.$name.'"'
//			);

			//Default value
			return new self(self::TYPE_XHTML);
		}
		
		/**
		 * @return string
		 */
		public function toInterface()
		{
			if( isset( $this->interfaces[$this->id] ) )
				return $this->interfaces[$this->id];
				
			return self::DEFAULT_INTERFACE;
		}
		
		/**
		 * @return string
		 */
		public function toInterfaceMethod()
		{
			if( isset( $this->interfaceMethods[$this->id] ) )
				return $this->interfaceMethods[$this->id];
				
			return self::DEFAULT_INTERFACE_METHOD;
		}
		
		/**
		 * @param HttpRequest $request
		 * @return View|JsonView|string
		 */
		public function toView(HttpRequest $request)
		{
			switch ( $this->id )
			{
				case self::TYPE_JSON :
					return JsonView::create();
				break;

				case self::TYPE_CTPP :
					return CtppView::create();
				break;
				
				case self::TYPE_JSONP :
					
					$form = Form::create()->add(
						Primitive::string('callback')->
							required()->
							setAllowedPattern(
								'/^[a-zA-Z\_\$]+[a-zA-Z0-9\_\.]*$/'
							)
					);
					
					$form->import( $request->getGet() );
					$form->importMore( $request->getPost() );
					
					if( !$form->getErrors() )
					{
						$view = JsonPView::create();
						$view->setCallback( $form->getValue('callback') );
						return $view;
					}
					
					return JsonView::create();
					
				break;
				
				case self::TYPE_JSONXSS:
					
					$form = Form::create()->add(
						Primitive::string('attr')->
							setAllowedPattern(
								'/^[a-zA-Z\_\$]+[a-zA-Z0-9\_\.]*$/'
							)->setValue('name')
					);
					
					$form->import( $request->getGet() );
					$form->importMore( $request->getPost() );
					
					if( !$form->getErrors() )
					{
						$view = JsonXssView::create();
						$view->setCallback( $form->getValue('attr') );
						return $view;
					}
					
					return JsonView::create();
					
				break;
			}
			
			return null;
		}
		
		/**
		 * @return boolean
		 */
		public function isResorveable()
		{
			return isset( $this->templateResolvable[$this->id] );
		}

		/**
		 * @return bool
		 */
		public function isCtppable()
		{
			return ( $this->id == self::TYPE_CTPP);
		}


		/**
		 * @return ResponseFormatType
		 */
		public static function typeXhtml()
		{
			return new self( self::TYPE_XHTML );
		}
		
		/**
		 * @return ResponseFormatType
		 */
		public static function typeXml()
		{
			return new self( self::TYPE_XML );
		}
		
		/**
		 * @return ResponseFormatType
		 */
		public static function typeJson()
		{
			return new self( self::TYPE_JSON );
		}
		
		/**
		 * @return ResponseFormatType
		 */
		public static function typeJsonP()
		{
			return new self( self::TYPE_JSONP );
		}
		
		/**
		 * @return ResponseFormatType
		 */
		public static function typeJsonXss()
		{
			return new self( self::TYPE_JSONXSS );
		}
		
		/**
		 * @return ResponseFormatType
		 */
		public static function typeRss()
		{
			return new self( self::TYPE_RSS );
		}

		/**
		 * @return ResponseFormatType
		 */
		public static function typeCtpp()
		{
			return new self( self::TYPE_CTPP );
		}

		
	}
?>