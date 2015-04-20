<?php
/**
 * @author Ivan Pesochenko
 */
class ControllerStory extends BaseAPIController implements IDependentLoggedUser {
    /**
     * @var StoryDAO
     */
    private $dao = null;
    /**
     * @var ProtoStory
     */
    private $proto = null;
    
    /**
     * @var Story
     */
    private $object = null;
    
    public function handleRequest(HttpRequest $request) {
        parent::handleRequest($request);
        $this->object = Story::create();
        $this->dao = Story::dao();
        $this->proto = Story::proto();
    }
    
    public function action_list(){
        $form = $this->proto->makeForm();
        $form->drop('name');
        $form->drop('dateStart');
        $form->add(Primitive::enumeration('memberType')->of('MemberType'));
        $form->get('id')->optional();
        $form->get('owner')->optional();
        $form->import($this->request->getGet())->importMore($this->request->getPost());
//        $form->get('dateStart')->optional();
        if ($form->getErrors()){
            $this->setFormErrors($form);
            $this->setStatus(AjaxStatusType::badRequest());
            return $this->mav;
        }
        
        $criteria = Criteria::create($this->dao);
        $criteria->add(
                Expression::andBlock()->expAnd(
                    Expression::eq('members.user.id', $this->loggedUser->getId())
                )->expAnd(
                    Expression::notEq('status', MemberStatus::BANNED)
                )
            );
        if ($form->exists('status')) $criteria->add(Expression::eq('status', $form->getValue('status')));
        if ($form->getValue('memberType')) $criteria->add(Expression::eq('members.type', $form->getValue('memberType')->getId()));
        
        $this->setResultList($criteria->getList());
    }

    
    
    public function action_create(){
        $form = $this->makeForm();
        $form->drop('id');
        $form->drop('owner');
        if ($form->getErrors()){
            $this->setFormErrors($form);
            $this->setStatus(AjaxStatusType::badRequest());
            return $this->mav;
        }
        $this->object = Story::create();
        FormUtils::form2object($form, $this->object);
        $this->object->setOwner($this->loggedUser);
        
        $member = Member::create();
        $member->setStatus(MemberStatus::active());
        $member->setType(MemberType::owner());
        $member->setUser($this->loggedUser);
        $db = DBPool::me()->getLink();
        $db->begin();
        try{
            $this->dao->add($this->object);
            $member->setStory($this->object);
            Member::dao()->add($member);
            $db->commit();
        } catch (Exception $e){
            $db->rollback();
            LoggerUtils::log(__CLASS__.'@'.__LINE__.': '.$e->getMessage());
            LoggerUtils::log(__CLASS__.'@'.__LINE__.': '.$e->getTraceAsString());
            $this->setStatus(AjaxStatusType::failed());
            return $this->mav;
        }
        $this->setResultObject($this->object);
    }
    
    
    /**
     * @param HttpRequest $this->request
     * @return Form
     */
    private function makeForm(){
        $form = $this->proto->makeForm();
        $form->drop('members');
        $form->import($this->request->getGet())->importMore($this->request->getPost());
        return $form;
    }
    
    
}

?>
