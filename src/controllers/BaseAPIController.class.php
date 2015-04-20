<?php

/**
 * Description of BaseController
 *
 * @author Ivan Pesochenko
 */
abstract class BaseAPIController extends BaseController implements Controller{
    /**
     * All controller data container
     * @var AjaxModelAndView
     */
    public $mav = null;
    
    public function __construct() {
//        parent::__construct();
        $this->mav = AjaxModelAndView::create();
        $this->mav->setModel(AjaxModel::create());
//        var_dump($this->mav->getModel());
        $this->mav->getModel()->setStatus(AjaxStatusType::success());
    }
    public function handleRequest(HttpRequest $request) {
        parent::handleRequest($request);
    }
    
    protected function setFormErrors(Form $form){
        $this->mav->getModel()->setFormErrors($form);
        return $this;
    }
    
    protected function setStatus(AjaxStatusType $status){
        $this->mav->getModel()->setStatus($status);
    }


    protected function setResultObject($var){
        $this->setMav('object', $var);
    }
    protected function setResultList($var){
        $this->setMav('list', $var);
    }


    public function getArray(){
//        var_dump($this->mav->getModel()->getAll());
        return $this->makeArray(
//            array_merge(
                $this->mav->getModel()->getAll()
//                array('status'=>$this->mav->getModel()->getStatus()->toString())
//            )
        );
    }
    

    public function getJSON(){
        return json_encode($this->getArray(), JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP);
    }
    public function getJSONP(){
        $callback = $this->request->hasGetVar('callback') ? $this->request->getGetVar('callback') : 'callback';
        return $callback.'('.$this->getJSON().');';
        
    }
    public function getXML(){
        // @todo getXML controller implementation
    }

    
    public function return403() {
        $this->setStatus(AjaxStatusType::forbidden());
    }


    /**
     *
     * @param array $array
     * @param int $level
     * @param bool $extended
     * @return \SimplifiedArrayAccess 
     */
    protected function makeArray($array, $level=20, $extended=false)
    {
            $data = array();
            foreach ( $array as $key => $value )
            {
                    if( $value instanceof IExtendedArrayable && $extended )
                            $data[$key]= $this->makeArray($value->toExtendedArray(), --$level, $extended);
                    elseif( $value instanceof IArrayable )
                            $data[$key]= $this->makeArray($value->toArray(), --$level, $extended);
                    elseif(
                            is_array($value) &&
                            $level > 0
                    )
                            $data[$key]=$this->makeArray($value, --$level, $extended);
                    elseif (
                            $value instanceof SimplifiedArrayAccess &&
                            $level > 0
                    )
                            $data[$key]=$this->makeArray($value->getList(), --$level, $extended);
                    elseif( is_scalar( $value ) || is_null($value) )
                    {
                            $data[$key] = $value;
                    }					
                    else 
                            $data[$key] = $value;
            }


            return $data;
    }
}



?>
