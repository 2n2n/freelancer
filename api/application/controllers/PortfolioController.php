<?php
class PortfolioController extends CI_Controller
{
    function all()
    {
        $user_id = 1;
        $portfolios = $this->Portfolio_model->getPortfolios($user_id);
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($portfolios));
    }

    function update()
    {

    }
}
