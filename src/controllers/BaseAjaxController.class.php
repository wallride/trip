<?php

abstract class BaseAjaxController  implements ControllerAjax {

    /**
     * @var AjaxModelAndView
     */
    protected $mav = null;
    
    /**     
     * @var EnumControllerAction
     */
    protected $action = null;
    /**
     * @var User
     */
    protected $loggedUser = null;
    
    function __construct() {
        $this->mav = AjaxModelAndView::create();
        $this->setAjaxStatus(AjaxStatusType::success());
    }
    
    public function handleAjaxRequest(HttpRequest $request) {
        if ($request->hasAttachedVar('loggedUser'))
            $this->loggedUser = $request->getAttachedVar('loggedUser');
        
        $form = Form::create()->add(Primitive::enumeration('_action')->of('EnumControllerAction'))
                ->import($request->getGet())->importMore($request->getPost());
        $this->action = $form->getValue('_action');
        switch ($this->action) {
            case EnumControllerAction::get():
                    $this->actionGet($request); break;
            case EnumControllerAction::getList():
                    $this->actionGetList($request); break;
            case EnumControllerAction::create():
                    $this->actionCreate($request); break;
            case EnumControllerAction::update():
                    $this->actionUpdate($request); break;
            case EnumControllerAction::delete():
                    $this->actionDelete($request); break;
            case EnumControllerAction::sort():
                    $this->actionSort($request); break;

            default: break;
        }
        return $this->mav;
    }
    
    protected function setFormErrors(Form $form){
        $this->mav->getModel()->setFormErrors($form);
    }
    protected function setAjaxStatus(AjaxStatusType $status){
        $this->mav->getModel()->setStatus($status);
    }
    protected function setMav($name, $data){
        $this->mav->getModel()->set($name, $data);
    }
    
    /**
     * Checks if widget's owner has active balance
     * @param BaseWidget $widget
     * @return Boolean
     */
    protected function checkWidgetOwnerAccount(BaseWidget $widget){
        return $widget->getOwner()->getAccount()->isActive();
    }
    
    
    
    
    protected function actionGet(HttpRequest $request){
    }
    protected function actionGetList(HttpRequest $request){
    }
    protected function actionCreate(HttpRequest $request){
    }
    protected function actionUpdate(HttpRequest $request){
    }
    protected function actionDelete(HttpRequest $request){
    }
    protected function actionSort(HttpRequest $request){
    }
    
}

?>
