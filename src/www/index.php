<?php
/***************************************************************************
 *   Copyright (C) 2010 by Kutcurua Georgy Tamazievich                     *
 *   email: g.kutcurua@gmail.com, icq: 723737, jabber: soloweb@jabber.ru   *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU Lesser General Public License as        *
 *   published by the Free Software Foundation; either version 3 of the    *
 *   License, or (at your option) any later version.                       *
 *                                                                         *
 ***************************************************************************/
/* $Id$ */

require '../../config/common/current/config.inc.php';


	try {
		
//		XHProfUtils::begin();
		
		//Start session
		Session::start();

		$request = HttpRequest::create()->
			setGet($_GET)->
			setPost($_POST)->
			setCookie($_COOKIE)->
			setServer($_SERVER)->
			setSession($_SESSION)->
			setFiles($_FILES);
		
		if(SecurityManager::me()->isLoggedIn()) {
			$request->setAttachedVar(
				'loggedUser',
				SecurityManager::me()->getUser()
			);
		}
		
//		if(SecurityManager::me()->getCompanyByAlias()) {
//			$request->setAttachedVar(
//				'loggedCompany',
//				SecurityManager::me()->getCompanyByAlias()
//			);
//		}


		$templatesPaths = array(
			PATH_TEMPLATES_COMMON.'common'.DS,
			PATH_TEMPLATES_COMMON.'common'.DS.'web'.DS,
		);

		$includePaths = array(
			PATH_CONTROLLERS_COMMON . 'common' . PATH_SEPARATOR,
		);

		$rewrites = include PATH_BASE_COMMON.'config'.DS. 'common' .DS. 'current'.DS.'config.rewrite.inc.php';

		$rewrite = RouterRewrite::me();

		foreach ($rewrites as $name => $rule)
			$rewrite->addRoute(
				$name,
				$rule
			);

		$application = HttpController::me();
		$application->addIncludePaths($includePaths);
		$application->setTemplatePaths($templatesPaths);

		$application->setRouterRewrite($rewrite);

		$application->run($request);

//		XHProfUtils::end();
			
	} 
	catch (Exception $e) {
		
		LoggerUtils::sendException($e);
	}
