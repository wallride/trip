<?php
/**
 * Registration and authorization
 *
 * @author Ivan Pesochenko
 */
class ControllerUser extends BaseAPIController{
    /**
     * @var UserDAO
     */
    private $dao = null;
    /**
     * @var ProtoUser
     */
    private $proto = null;
    
    /**
     * @var User
     */
    private $object = null;
    
    public function handleRequest(HttpRequest $request) {
        parent::handleRequest($request);
        $this->object = User::create();
        $this->dao = User::dao();
        $this->proto = User::proto();
    }
    
    public function action_logout(){
        if (!$this->loggedUser){
            $this->setStatus(AjaxStatusType::forbidden());
            return;
        }
        StaticSecurityManager::me()->logout();        
    }
    
    public function action_login(){
        if ($this->loggedUser){
            $utoken = Criteria::create(AuthToken::dao())->add(Expression::eq('user.id', $this->loggedUser->getId()))->getList();
            $utoken = reset($utoken);
            $this->setMav('token', $utoken);
//            $this->setMav('test', $this->loggedUser);
            $this->setResultObject($this->loggedUser);
            
            return $this->mav;
        }
        
        $criteria = Criteria::create(User::dao())->setLimit(1);
        $form = $this->makeEmailForm($this->request);
        if ($form->getErrors()){
            $this->setFormErrors($form);
            $this->setStatus(AjaxStatusType::badRequest());
            return $this->mav;
        }
        $criteria->add(Expression::eq('auth.email', $form->getValue('email')));
        $criteria->add(Expression::eq('auth.password', Auth::encodePassword($form->getValue('pass'))));
        $criteria->setLimit(1);
        try{
            $res = $criteria->getList();
            $this->object = reset($res);
        } catch (Exception $e){}
        if (!$this->object){
            $form->markWrong('email');
            $form->markWrong('pass');
            $this->setFormErrors($form);
            $this->setStatus(AjaxStatusType::forbidden());
            return;
        }

            
        $utoken = AuthToken::make($this->object, 60*24 );
        AuthToken::clean($utoken);
        StaticSecurityManager::me()->setToken( $utoken, true );
        $this->setMav('token', $utoken);
        $this->setResultObject($this->object);
        $this->setStatus(AjaxStatusType::success());
        
    }
    
    public function action_register(){
        // check
        $userForm = $this->makeUserForm($this->request);
        if ($userForm->getErrors()){
            $this->setFormErrors($userForm);
            $this->setStatus(AjaxStatusType::badRequest());
            return $this->mav;
        }
        
        $email = $userForm->getValue('email');
        if (count(
                Criteria::create(User::dao())
                    ->add(Expression::eq('email', $email))
                    ->getList()
            )>0
        ){
            $userForm->markWrong('email');
            $this->setFormErrors($userForm);
            $this->setStatus(AjaxStatusType::badRequest());
            return $this->mav;
        }
        
        
        $authForm = $this->makeEmailForm($this->request);
        /**
        * Invites only!! 
        */
//        $authForm->add(Primitive::string('invite')->setAllowedPattern('/^for_friends$/')->required());
        $authForm->import($this->request->getGet())->importMore($this->request->getPost());

        if ($authForm->getErrors()){
            $this->setFormErrors($authForm);
            $this->setStatus(AjaxStatusType::badRequest());
            return $this->mav;
        }
        $auth = Auth::create()
                ->setEmail($authForm->getValue('email'))
                ->setPassword(Auth::encodePassword($authForm->getValue('pass')))
        ;
        $this->object = User::create();
        FormUtils::form2object($userForm, $this->object);
        $this->object->setEmail($auth->getEmail());

        $db = DBPool::me()->getLink();
        $db->begin();
        try{
            Auth::dao()->add($auth);
            $this->object->setAuth($auth);
            User::dao()->add($this->object);
            $utoken = AuthToken::make($this->object, 60*24 );
            AuthToken::clean($utoken);
            StaticSecurityManager::me()->setToken( $utoken, true );
            $db->commit();
        } catch (Exception $e){
            $db->rollback();
            LoggerUtils::log(__CLASS__.'@'.__LINE__.': '.$e->getMessage());
            LoggerUtils::log(__CLASS__.'@'.__LINE__.': '.$e->getTraceAsString());
//                var_dump($e->getMessage());
            $this->setStatus(AjaxStatusType::failed());
            return $this->mav;
        }
//        mail ($this->object->getEmail(),'Registration complete', 'OK');


        $this->setResultObject($this->object);
    }

    
    
    /**
     *
     * @param HttpRequest $this->request
     * @return Form
     */
    private function makeUserForm(HttpRequest $request){
        $form = User::proto()->makeForm();
        $form->drop('id')->drop('email')->drop('auth')->drop('name');
        $form->add(Primitive::string('email')
                ->setImportFilter(
                        FilterChain::create()
                        ->add(Filter::trim())
                        ->add(Filter::lowerCase())
                )
                ->setAllowedPattern(PrimitiveString::MAIL_PATTERN)->required());
        $form->import($this->request->getGet())->importMore($this->request->getPost());
        return $form;
    }    
    
    /**
     * Make email-authorization form
     * @param HttpRequest $this->request
     * @return Form
     */
    private function makeEmailForm(HttpRequest $request){
        $form = Form::create();
        $form->add(Primitive::string('email')
                ->setImportFilter(
                        FilterChain::create()
                        ->add(Filter::trim())
                        ->add(Filter::lowerCase())
                )
                ->setAllowedPattern(PrimitiveString::MAIL_PATTERN)->required());
//        $form->add(Primitive::string('pass')->setAllowedPattern('/^[a-z0-9!@#$%^&*()_+-=,.]{6;15}$/')->required());
        $form->add(Primitive::string('pass')->setAllowedPattern('/^.+$/')->required());
        $form->add(Primitive::boolean('is_remember'));
        $form->import($this->request->getGet())->importMore($this->request->getPost());
        return $form;
    }    
    
    
}

?>
