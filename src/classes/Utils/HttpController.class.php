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


	final class HttpController extends Singleton implements Instantiatable
	{

		protected $templatePaths	=	array();

		/**
		 * @var ResponseFormatType
		 */
		protected $responseFormat	=	null;

		/**
		 * @var ModuleType
		 */
		protected $module			= null;

		/**
		 * @var RouterRewrite
		 */
		protected $routerRewrite	= null;

		/**
		 * @return string
		 */
		protected $userClassName		= 'User';


		/**
		 * Молчать при отсутствии статуса
		 * @var boolean
		 */
		protected $statusSilent		= true;



		/**
		 * Запрос
		 * @var HttpRequest
		 */
		protected $request			= null;

		/**
		 * Включение XHProfiling-а
		 * @var boolean
		 */
		protected $xhprofiling		= null;

		/**
		 * @return HttpController
		 */
		public static function me()
		{
			return self::getInstance(__CLASS__);
		}



		/**
		 * @param ModuleType $module
		 * @return HttpController
		 */
		public function setModule(ModuleType $module)
		{
			$this->module = $module;

			return $this;
		}

		/**
		 * @param boolean $boolean
		 * @return HttpController
		 */
		public function setXHProfiling($boolean)
		{
			$this->xhprofiling = (true == $boolean);

			return $this;
		}

		/**
		 * @param boolean $boolean
		 * @return HttpController
		 */
		public function setStatusSilent($boolean)
		{
			$this->statusSilent = (true == $boolean);

			return $this;
		}

		/**
		 * @param array $paths
		 * @return HttpController
		 */
		public function setTemplatePaths(/* array */$paths)
		{
			Assert::isArray($paths);

			$this->templatePaths = $paths;

			return $this;
		}

		/**
		 * @param string $className
		 * @return HttpController
		 */
		public function setUserClassName($className)
		{
			Assert::classExists($className);
			$this->userClassName = $className;

			return $this;
		}

		/**
		 * @param array $paths
		 * @return HttpController
		 */
		public function addIncludePaths($paths)
		{
			Assert::isArray($paths);

			set_include_path(
				get_include_path().PATH_SEPARATOR.implode(PATH_SEPARATOR, $paths)
			);

			return $this;
		}

		/**
		 * @return UserDAO
		 */
		protected function getUserDAO()
		{
			return call_user_func(
				array( $this->userClassName, 'dao' )
			);
		}

		/**
		 * Вся инициализация тут
		 * @param HttpRequest $request
		 */
		protected function init(HttpRequest $request)
		{
			$this->request = $request;

			$this->initResponseFormat($this->request);

			$this->initUtoken($this->request);

		}

		/**
		 * @param HttpRequest $request
		 * @return HttpController
		 */
		protected function initResponseFormat(HttpRequest $request)
		{
			$form = Form::create()->add(
				Primitive::choice('_fmt')
					->setList(
						array_combine(
							array_values(
								ResponseFormatType::typeXhtml()->getNameList()
							),
							array_keys(
								ResponseFormatType::typeXhtml()->getNameList()
							)
						)
					)
				->setValue('html')
			);

			$form->import( $request->getPost() );
			$form->importMore( $request->getGet() );

			if( !$form->getErrors() )
			{
				$this->responseFormat = ResponseFormatType::wrap(
					$form->getChoiceValue('_fmt')
				);

			} else{
				// Default response format
				$this->responseFormat = ResponseFormatType::typeXhtml();
			}

			return $this;
		}


		/**
		 * @param HttpRequest $request
		 * @throws ObjectNotFoundException
		 * @return HttpController
		 */
		protected function initUtoken(HttpRequest $request)
		{
			$form = Form::create()->add(
				Primitive::uuidIdentifier('utoken')->
					of('AuthToken')->
					required()
			);

                        
                        if ($request->hasCookieVar('utoken'))
                            $form->importValue('utoken', $request->getCookieVar('utoken'));
			$form->importMore( $request->getGet() );
			$form->importMore( $request->getPost() );

			if( !$form->getErrors() )
			{
				try{

					$token = $form->getValue('utoken');
					//$token = AuthToken::create();

					if(
                                            !$token->isValid()
					){
                                            throw new ObjectNotFoundException();
					}

					AuthToken::dao()->update($token);

					$dao = $this->getUserDAO();
					$object = $dao->getById( $token->getUserId() );
//                                        LoggerUtils::log($object->getId());
                                        
					$this->request->setAttachedVar(
						'loggedUser',
						$object
					);

					// Обновляем дату последней активности
//					$dao->updateLastActivity( $object );

				} catch (ObjectNotFoundException $e) {/*_*/}

			}

			return $this;
		}

		/**
		 * @param HttpRequest $request
		 * @throws WrongArgumentException
		 * @return Ambigous <string, multitype:>
		 */
		protected function getControllerName(HttpRequest $request)
		{
			$controllerName =
				defined('MAIN_CONTROLLER')
					?  MAIN_CONTROLLER :
					'main';

			if(
                            $request->hasGetVar('_controller') &&
                            ClassUtils::isClassName($request->getGetVar('_controller') )
			){
                            $controllerName = $request->getGetVar('_controller');

			}elseif(
                            $request->hasPostVar('_controller') &&
                            ClassUtils::isClassName($request->getPostVar('_controller') )
			){
				$controllerName = $request->getPostVar('_controller');
			}

			return $controllerName;
		}

		/**
		 * Создаем контроллер
		 * @param string $controllerName
		 * @return classNotFoundController|unauthorizated|forbidden|Ambigous <IDependentLoggedUser, IDependentLoggedCompany, unknown>
		 */
		protected function makeController($controllerName)
		{

			try{
				Assert::classExists($controllerName);
			} catch (WrongArgumentException $e) {
				return new classNotFoundController();
			}
			$controller = new $controllerName;
			$request = $this->request;

			if(
				(
					(
						$controller instanceof IDependentLoggedUser

					) &&
					!(
						$request->hasAttachedVar('loggedUser') &&
						$request->getAttachedVar('loggedUser') instanceof User
					)
				)

			){
				error_log(
					__METHOD__.': '.
					'unauthorized - loggedUser needed!'
				);

				return new unauthorizated();
			}


			return $controller;

		}

		/**
		 * Стартуем контроллер
		 * @param string $controllerName
		 */
		protected function runController($controllerName)
		{
			$class = $this->makeController($controllerName);

			$request = $this->request;
//			$interface = $this->responseFormat->toInterface();
//                        var_dump($this->responseFormat->toInterfaceMethod());
/*

			if($class instanceof $interface) {
                            $mav = call_user_func(
                                array($class, $this->responseFormat->toInterfaceMethod() ),
                                $request
                            );
			} else {
                            $mav = $class->handleRequest($request);
			}
 */
                        $form = Form::create()
                                ->add(Primitive::string('_action'))
                                ->add(Primitive::string('_path'))
                                ->import($request->getGet());
 
                        if ($form->getValue('_path') && method_exists($class, 'routePath')){
                            $request = $class->routePath($form->getValue('_path'), $request);
                        }
                        $class->handleRequest($request);
                        $action = 'action_'.$form->getValue('_action');
                        if ($action && method_exists($class, $action)){
                            call_user_func(array($class, $action));
                        }
                        //Now decorate to specific format
//                        $fmt= $form->getValue('_fmt');
                        switch ($this->responseFormat->getId()) {
                            case ResponseFormatType::TYPE_JSON:
                                echo($class->getJSON());break;
                            case ResponseFormatType::TYPE_JSONP:
                                echo($class->getJSONP());break;
                            case ResponseFormatType::TYPE_XML:
                                echo($class->getXML());break;

                            default: echo($class->getJSON()); break;
                        }
                        return;
//                        $mav = $class->mav;
//                        
//                        
//			$view 	= $mav->getView();
//			$model 	= $mav->getModel();
////                        var_dump($model);
//			$template = null;
//
//			if(is_string($view))
//				$template = $view;
//
//			if(!$view || is_string($view))
//			{
//				$responseView = $this->responseFormat->toView($request);
//				if( $responseView )
//					$view = $responseView;
//			}
//
//			if(
//				$this->responseFormat->isResorveable() ||
//				$this->responseFormat->isCtppable()
//			) {
//
//				if (!$view instanceof View) {
//					$viewName = ($view)
//									? $view
//									: $controllerName;
//
//					$viewResolver =
//						MultiPrefixPhpViewResolver::create()->
//						setViewClassName('SimplePhpView');
//
//						foreach ( $this->templatePaths as $path )
//							$viewResolver->addPrefix( $path );
//
//					$view = $viewResolver->resolveViewName($viewName);
//
//				}
//
//				if(
//					$request->hasAttachedVar('loggedUser')
//				){
//					$model->set('loggedUser', $request->getAttachedVar('loggedUser') );
//				}
//
//				// $controllerName
//				if(
//					isset( $controllerName )
//				) {
//					$model->set('controllerName', $controllerName );
//				}
//
//			}
//
//			if(
//				!$this->statusSilent &&
//				!$this->responseFormat->isResorveable() &&
//				!$model->has('status')
//			){
//				throw new WrongStateException(
//					__METHOD__.': '.
//					_('You mus specifie "status" in response mav!')
//				);
//			}
//			/*
//			 * Init current time
//			 */
////			if(
////				!$this->responseFormat->isResorveable()
////			){
////				$this->injectTime($model);
////			}
//
//			/*
//			 * Ctpp X-Template
//			 */
////			if(
////				$this->responseFormat->isCtppable() &&
////				!HeaderUtils::hasHeader(CtppView::HEADER_NAME)
////			)
////			{
////				if(
////					!$template ||
////					!is_string($template)
////				)
////					$template = $controllerName;
////
////				 HeaderUtils::sendCustomHeader(
////					CtppView::HEADER_NAME.': '.$template.'.'.CtppView::CEXTENSION
////				);
////			}
////
////	
//			$view->render($model);
//
//			return /* void */;

		}

		/**
		 * @param Model $model
		 * @return HttpController
		 */
		protected function injectTime(Model $model)
		{
			if( $model->has('time') )
			{
				$time = $model->get('time');
				if(
					is_array( $time ) &&
					!isset( $time['now'] )
				)
					$time['now'] = Timestamp::makeNow()->toString();
			} else {
				$model->set('time', array( 'now' => Timestamp::makeNow()->toString() ) );
			}

			return $this;
		}

		public function run(HttpRequest $request)
		{
			$this->init($request);
			$controllerName = $this->getControllerName($request);
			try{
				$this->runController($controllerName);
			}
			catch (Exception $e) {

//				if(
//					!$this->responseFormat->isResorveable()
//				){
					LoggerUtils::logException($e);
					LoggerUtils::log($e->getMessage());
					LoggerUtils::log($e->getTraceAsString());

					$request->setAttachedVar('errorMessage', $e->__toString() );
//                                        var_dump($e->getTraceAsString());
//					$this->runController('faild');

					return /* void */;
//				}

				throw $e;
			}

		}

	}