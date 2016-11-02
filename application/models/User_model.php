<?php
class User_model extends CI_Model
{

    function authenticate()
    {

        $affected = $this->db
            ->where('email', $this->input->post('email'))
            ->where('password', $this->input->post('password'))
            ->get('users')
            ->row_array();
        if( count($affected) > 0 )
        {
            return true;
            // do some session shits here.
        }
        else
        {
            return false;
        }
    }

    function register()
    {
        try {
            $postdata = $this->input->post();
            unset($postdata['password_confirm']);
            $this->db->insert('users', $postdata);
            return true;
        }
        catch (Exception $e)
        {
            return false;
        }
    }
}
