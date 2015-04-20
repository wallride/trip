<?php
/***************************************************************************
 *   Copyright (C) 2011 by Kutcurua Georgy Tamazievich                     *
 *   email: g.kutcurua@gmail.com, icq: 723737, jabber: soloweb@jabber.ru   *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU Lesser General Public License as        *
 *   published by the Free Software Foundation; either version 3 of the    *
 *   License, or (at your option) any later version.                       *
 *                                                                         *
 ***************************************************************************/
/* $Id$ */

	class classNotFoundController implements Controller, ControllerAjax
	{
		
		/**
		 * @return void
		 */
		protected function sendHeader()
		{
//			if( !HeaderUtils::isHeaderSent() )
//				HeaderUtils::sendHttpStatus( HttpStatus::wrap( HttpStatus::CODE_403 ) );
				
			return /*void*/;
		}
		
		/* (non-PHPdoc)
		 * @see main/Flow/Controller::handleRequest()
		 */
		public function handleRequest(HttpRequest $request)
		{
			$mav = ModelAndView::create();
			$mav->setView( EmptyView::create() );
			
			$this->sendHeader();
						
			return $mav;
		}
		
		/**
		 * @param HttpRequest $request
		 * @return ModelAndView
		 */
		public function handleAjaxRequest(HttpRequest $request)
		{
			$mav = ModelAndView::create();
			$this->sendHeader();
			
			$status['code'] = AjaxStatusType::notFound()->getName();
			
			$mav->getModel()->set('status', $status);
			
			return $mav;
		}
		
	}