<?php
class unauthorizated extends BaseAjaxController{
    //put your code here
    public function handleAjaxRequest(HttpRequest $request) {
        $this->setAjaxStatus(AjaxStatusType::forbidden());
        return $this->mav;
    }
}

?>
