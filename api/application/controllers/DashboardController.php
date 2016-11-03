<?php
class DashboardController extends CI_Controller
{
    function my_account()
    {
        $userid = 1; // for now static data.
        $userdata = $this->db
            ->select('last_name, first_name, email')
            ->where('id', $userid)
            ->get('users')
            ->result();
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($userdata));
    }

    function reset_password()
    {
        $this->form_validation->set_rules([
            [
                'field' => 'password',
                'label' => 'password',
                'rules' => 'required'
            ],
            [
                'field' => 'password_confirm',
                'label' => 'password confirmation',
                'rules' => 'required|matches[password]'
            ]
        ]);

        if( $this->form_validation->run() )
        {
            $email = "ayolachll@gmail.com";
            $this->User_model->change_password($email);
            $this->output
                 ->set_content_type('application/json')
                 ->set_output(json_encode('fucker!'));
        }
        else
        {

            $errors = $this->form_validation->error_array();
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($errors));
        }


    }
}
