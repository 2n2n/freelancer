<?php
class AuthController extends CI_Controller
 {

    function forgot()
    {
        $this->load->model('Auth_model');
        $this->form_validation->set_rules('email', 'email', 'required|valid_email');
        if($this->form_validation->run())
        {
            $tokenURL = $this->Auth_model->generateURL($this->input->post('email'));
            #email messaging here.
            $from = new SendGrid\Email(null, "ayolachll@gmail.com");
            $subject = "Hello World from the SendGrid PHP Library!";
            $to = new SendGrid\Email(null, $this->input->post('email'));
            $content = new SendGrid\Content("text/plain", "Hello, Email! ". $tokenURL);
            $mail = new SendGrid\Mail($from, $subject, $to, $content);

            $apiKey = "gnrBtIk0SmONhzD8_BPXYQ";
            $sg = new \SendGrid($apiKey);

            $response = $sg->client->mail()->send()->post($mail);
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode([$response]));

        }
        else
        {
            $errors = $this->form_validation->error_array();
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($errors));
        }
    }

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
            if($user = $this->User_model->authenticate())
            {
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['response' => true, 'user' => $user]));
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
                    ->set_output(json_encode(["response" => true, "msg" => "Successfully Registered User."]));

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
