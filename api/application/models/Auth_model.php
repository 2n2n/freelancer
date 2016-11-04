<?php
class Auth_model extends CI_Model
{
    function generateURL($email)
    {
        $base_url = "http://localhost/freelancer/frontend";
        $token = generateRandomString($email);
        // do some insertion on db;
        $this->db->trans_start();
        $this->db->where('email', $email);
        $this->db->insert('users', ['forgot_password' => $token]);
        $this->db->trans_complete();
        return $base_url.'?'.http_build_query(['t'=> generateRandomString($email)]);;
    }

    /**
     * @return { 'id' }
     */
    function validate_token()
    {
        $token = $this->input->get('t');
        $this->db->where('forgot_password', $token);
        return $this->db->select('id')->get('users')->row();
    }
}
