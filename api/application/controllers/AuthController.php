<?php
class AuthController extends CI_Controller
 {

    function login()
    {
        $this->form_validation->set_rules([
            [
                'field' => 'email',
                'label' => 'email',
                'rules' => 'required|valid_email'
            ],
            [
                'field' => 'password',
                'label' => 'password',
                'rules' => 'required'
            ]
        ]);
        if($this->form_validation->run())
        {
            if($this->User_model->authenticate())
            {
                    echo "welcome mother fucker!";
                    // do some response here
            }
            else
            {
                    $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(['error' => 'email and password combination failed.']));
            }

        }
        else {
            $errors = $this->form_validation->error_array();
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($errors));
        }
    }
    function register()
    {
        $this->form_validation->set_rules([
            [
                'field' => 'first_name',
                'label' => 'first name',
                'rules' => 'required'
            ],
            [
                'field' => 'last_name',
                'label' => 'last name',
                'rules' => 'required'
            ],
            [
                'field' => 'email',
                'label' => 'email',
                'rules' => 'required|valid_email|is_unique[users.email]'
            ],
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
        if($this->form_validation->run())
        {
            if( $this->User_model->register() )
            {
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(["Successfully Registered User."]));
            }
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
