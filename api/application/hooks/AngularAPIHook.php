<?php
class AngularAPIHook
{
    function parsePostMethod()
    {
        if (strcasecmp($_SERVER['REQUEST_METHOD'], 'post') === 0 && stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== FALSE) {
            // POST is actually in json format, do an internal translation
            $_POST += json_decode(file_get_contents('php://input'), true);
        }
    }
}
