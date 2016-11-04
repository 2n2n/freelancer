<?php
class PortfolioController extends CI_Controller
{
    function decode($val) 
    {
        $val->images = json_decode($val->images);
        return $val;
    }
    function all()
    {
        $user_id = 1;
        $portfolios = $this->Portfolio_model->all($user_id);
        $portfolios = array_map([$this,'decode'], $portfolios);
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($portfolios));
    }

    function add() {
        $user_id = 1;
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

    }
}
