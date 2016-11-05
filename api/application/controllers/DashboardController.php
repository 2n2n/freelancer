<?php
class DashboardController extends CI_Controller
{
    function my_account()
    {
        $userid = $this->input->post('id');
        $userdata = $this->db
            ->select('id, last_name, first_name, email')
            ->where('id', $userid)
            ->get('users')
            ->row();

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($userdata));
    }

    function update_account()
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
                'rules' => 'required|valid_email'
            ]
        ]);

        if($this->form_validation->run())
        {
            if( $data = $this->User_model->update($this->input->post('id')) )
            {
                $updated_info = $this->db->where('id', $this->input->post('id'))->get('users')->row();
                $response = ['response' => true, 'msg' => 'Update sucess!', 'user' => $updated_info];
            }
            else
            {
                $response = ['Something went wrong during the update.'];
            }
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($response));
        }
        else
        {
            $errors = $this->form_validation->error_array();
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($errors));
        }
    }

    function all_profiles()
    {
        $userdata = $this->db
            ->select('id, last_name, first_name, email')
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
            $email = $this->input->post('email');
            $this->User_model->change_password($email);
            $this->output
                 ->set_content_type('application/json')
                 ->set_output(json_encode(['response' => true, 'msg' => 'Reset Success.']));
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
