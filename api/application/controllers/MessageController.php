<?php
class MessageController extends CI_Controller
{
    function contact()
    {
        $postdata = $this->input->post();
        $this->db->insert('contacts', $postdata);
    }
}
