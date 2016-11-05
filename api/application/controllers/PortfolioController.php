<?php
class PortfolioController extends CI_Controller
{
    function inbox()
    {
        $messages = $this->db
            ->where('userid', $this->input->post('id'))
            ->get('contacts')
            ->result();
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($messages));
    }

    function send()
    {
        $this->form_validation->set_rules([
            [
                'field' => 'name',
                'label' => 'name',
                'rules' => 'required'
            ],
            [
                'field' => 'message',
                'label' => 'message',
                'rules' => 'required'
            ],
            [
                'field' => 'email',
                'label' => 'email',
                'rules' => 'required|valid_email'
            ],
            [
                'field' => 'subject',
                'label' => 'subject',
                'rules' => 'required'
            ]
        ]);

        if( $this->form_validation->run() )
        {
            $this->db->trans_start();
            $this->db->insert('contacts', $this->input->post());
            $this->db->trans_complete();
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['response' => true, 'msg' => 'Message Sent!']));
        }
        else
        {
            $errors = $this->form_validation->error_array();
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($errors));
        }
    }
    function decode($val)
    {
        $val->images = json_decode($val->images);
        return $val;
    }
    function get()
    {
        $user_id = $this->input->post('id');
        $response = $this->Portfolio_model->getPortfolio($user_id);

        $response->images = json_decode($response->images);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($response));
    }
    function all()
    {
        $user_id = $this->input->get('id');
        $portfolios = $this->Portfolio_model->all($user_id);
        $portfolios = array_map([$this,'decode'], $portfolios);
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($portfolios));
    }

    function add() {
        $user_id = $this->input->post('id');
        $this->form_validation->set_rules([
            [
                'field' => 'title',
                'label' => 'title',
                'rules' => 'required'
            ],
            [
                'field' => 'description',
                'label' => 'short description',
                'rules' => 'required'
            ],
            [
                'field' => 'price',
                'label' => 'price',
                'rules' => 'required'
            ]
        ]);
        if( $this->form_validation->run() )
        {
            if( $this->Portfolio_model->add($user_id) )
            {
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(['response' => true, 'msg' => 'Add Success!']));
            }
            else
            {
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(['response' => false, 'msg' => 'Something went wrong inserting']));
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
    function update()
    {
        $this->form_validation->set_rules([
            [
                'field' => 'title',
                'label' => 'title',
                'rules' => 'required'
            ],
            [
                'field' => 'description',
                'label' => 'short description',
                'rules' => 'required'
            ],
            [
                'field' => 'price',
                'label' => 'price',
                'rules' => 'required'
            ]
        ]);
        if( $this->form_validation->run() )
        {
            if( $this->Portfolio_model->update($this->input->post('id')) )
            {
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(['response' => true,'msg' => 'Update Success!']));
            }
            else
            {
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(['response' => false,'msg' => 'Update Failed!']));
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
