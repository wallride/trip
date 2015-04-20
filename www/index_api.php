<?php
require '../config/global.inc.php';
set_include_path(
    get_include_path()
    .PATH_CONTROLLERS.'API'.PATH_SEPARATOR
);

Session::start();

$request = HttpRequest::create()->
    setGet($_GET)->
    setPost($_POST)->
    setCookie($_COOKIE)->
    setServer($_SERVER)->
    setSession($_SESSION)->
    setFiles($_FILES);
$loggedUser=null;
if(SecurityManager::me()->isLoggedIn()) {
    $loggedUser = SecurityManager::me()->getUser(); 
        $request->setAttachedVar(
            'loggedUser',
            $loggedUser
        );
}
//LoggerUtils::log(var_export($_GET));

$form = Form::create()
        ->add(Primitive::string('_object'))
        ->add(Primitive::string('_method'))
        ->add(Primitive::string('_path'))
        ->add(Primitive::string('_fmt')->setAllowedPattern('/^(json|jsonp|xml)$/i'))
        ->import($request->getGet());

$class = 'Controller'.$form->getValue('_object');
//if (!($class && preg_match('/[a-zA-Z_]+/i', $class) && class_exists($class))){
//    $class = 'Test';
//}


//$application = HttpController::me();
//$application->run($request);
// Now we got the Controller to work with.
$controller = new $class();
//let's see if the path can be routed
if ($form->getValue('_path') && method_exists($controller, 'routePath')){
    $request = $controller->routePath($form->getValue('_path'), $request);
}
if (!$controller instanceof IDependentLoggedUser || $loggedUser){
    // Do basic actions
    $controller->handleRequest($request);

    // Do some specific actions
    $action = 'action_'.$form->getValue('_method');
    if ($action && method_exists($controller, $action)){
        call_user_func(array($controller, $action));
    }
}
else{
    $controller->return403();
}
//Now decorate to specific format
$fmt= $form->getValue('_fmt');
switch ($fmt) {
    case 'json':echo($controller->getJSON());break;
    case 'jsonp':echo($controller->getJSONP());break;
    case 'xml':echo($controller->getXML());break;

    default: echo($controller->getJSON()); break;
}



?>
