<?php

/**
 * Description of BaseController
 *
 * @author Ivan Pesochenko
 */
abstract class BaseController implements Controller{

    protected $pathRoute = array('id');


    /**
     * @var ModelAndView
     */
    public $mav = null;
    
    protected $loggedUser = null;
    
    
    /**
     *
     * @var HttpRequest
     */
    protected $request = null;
    
    public function __construct() {
        $this->mav = ModelAndView::create();
    }


    public function handleRequest(HttpRequest $request) {
        $this->request = $request;
        if ($this->request->hasAttachedVar('loggedUser')){
//            LoggerUtils::log('has logged user!');
            $this->loggedUser = $this->request->getAttachedVar('loggedUser');
        }
    }
    
    protected function setMav($name, $var){
        $this->mav->getModel()->set($name, $var);
    }
    
    /**
     *
     * @param String $path
     * @param HttpRequest $request 
     */
    public function routePath($path, HttpRequest $request){
        $a = explode('/', $path);
        for ($i = 0; $i<count($a) && $i<count($this->pathRoute); $i++){
            $request->setGetVar($this->pathRoute[$i], $a[$i]);
        }
        return $request;
    }
    
    
    
    /**
     * Reurns all the Model or its element if $name is specified
     * @return Model
     */
    public function getModel($name = null){
        return $name ? $this->mav->getModel()->get($name) : $this->mav->getModel();
    }

    
    public function getTemplated($templateName){
        
    }
}



?>
