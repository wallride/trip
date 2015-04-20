<?php
/**
 * zelenov.mikhail@gmail.com
 */
	class StaticSecurityManager extends SecurityManager {

		// Название hash ключа идинтификатора пользователя
		const COOKIE_USER_IDETIFICATION				=	'utoken';

		// Название hash ключа ip
		const COOKIE_USER_IDETIFICATION_IP			=	'extensip';

		// Секретный ключь :-)
		const CRYPT_SALT							=	'bestofthebestofthebestsalt';


		/**
		 * @return SecurityManager
		 */
		static public function me() {
			return Singleton::getInstance(__CLASS__);
		}

		protected function __construct() {
			parent::__construct();
		}

		/**
		 * @param AuthToken $utoken
		 * @param boolean $isRemember
		 * @return void
		 */
		public function setToken(AuthToken $utoken, $isRemember = true)
		{
			//Записываем куки
			return $this->setCookiesToken($utoken, $isRemember);
		}

		/**
		 * Разлогиниваем пользователя
		 *
		 * @return void
		 */
		public function logout() {
			$this->unsetCookies();


			return /*void*/;
		}

	/**
		 * Обнуляем авторизационные данные!
		 *
		 * @return void
		 */
		private function unsetCookies() {

			$cookie = Cookie::create(self::COOKIE_USER_IDETIFICATION);
			$cookie->setPath('/');
			CookieUtils::unsetCookie($cookie);

			if($this->isSecureLogin() ) {
				$cookie = Cookie::create(self::COOKIE_USER_IDETIFICATION_IP);
				$cookie->setPath('/');
				CookieUtils::unsetCookie($cookie);
			}

			return /*void*/;
		}

		/**
		 * Возвращает id из сесси пользователя
		 *
		 * @return string || null
		 */
		private function getUserIdFromCookie() {
			$utokenId = CookieUtils::getById(self::COOKIE_USER_IDETIFICATION);
			$userId = null;

			if(
				Assert::checkUniversalUniqueIdentifier( $utokenId )
			){

				try{

					$utoken = AuthToken::dao()->getById($utokenId);

					if(
						$utoken->isValid()
					){
						$userId = $utoken->getUserId();
					}

				} catch ( ObjectNotFoundException $e ){/**/}

			}


			return $userId;
		}


		/**
		 * Возвращает utoken, если есть
		 *
		 * @return utoken || null
		 */
		public function getUtoken() {
			$utokenId = CookieUtils::getById(self::COOKIE_USER_IDETIFICATION);
			if(
				Assert::checkUniversalUniqueIdentifier( $utokenId )
			){

				try{

					$utoken = AuthToken::dao()->getById($utokenId);
					if(
						$utoken->isValid()
					){
						return $utoken;
					}

				} catch ( ObjectNotFoundException $e ){/**/}
			}
			return null;
		}


		/**
		 * @param AuthToken $utoken
		 * @param boolean $isRemember
		 * @return void
		 */
		private function setCookiesToken(AuthToken $utoken, $isRemember=true) {
			$expire = 0; // До закрытия браузера

			if($isRemember) {
				$expire=2 * 604800; // Неделя * 2 = 2 недели :-)
			}

			// Сохраняем id в куки
			$cookieUserId=Cookie::create(self::COOKIE_USER_IDETIFICATION);
			$cookieUserId->setDomain(COOKIE_DOMAIN);
			$cookieUserId->setPath('/');
			$cookieUserId->setValue( $utoken->getId() );
			$cookieUserId->setMaxAge($expire);
			CookieUtils::setCookie($cookieUserId);
//                        LoggerUtils::log(__CLASS__.':'.__METHOD__.'@'.__LINE__.' - '.COOKIE_DOMAIN.' : '.$cookieUserId->getValue());


			if($this->isSecureLogin() ) {
				// Сохраняем ip в куки
				$cookieUserIp=Cookie::create(self::COOKIE_USER_IDETIFICATION_IP);
				$cookieUserIp->setDomain(COOKIE_DOMAIN);
				$cookieUserIp->setPath('/');
				$cookieUserIp->setValue( self::encrypt( $this->getIp() ) );
				$cookieUserIp->setMaxAge($expire);
				CookieUtils::setCookie($cookieUserIp);
			}

			return /*void*/;
		}


	}
