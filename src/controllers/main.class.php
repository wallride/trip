<?php


class main extends BaseAjaxController{
    public function handleAjaxRequest(HttpRequest $request) {
        return $this->mav;
    }
}

?>
