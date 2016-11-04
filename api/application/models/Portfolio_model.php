<?php
class Portfolio_model extends CI_Model
{
    function add($user_id)
    {
        $postdata = [
            "userid" => $user_id,
            "title" => $this->input->post('title'),
            "description" => $this->input->post('description'),
            "price" => $this->input->post('price'),
            "images" => json_encode($this->input->post('images'))
        ];

        $this->db->trans_start();
        $this->db->insert('portfolio', $postdata);
        $this->db->trans_complete();
        return $this->db->trans_status();


        // $config['upload_path']          = './uploads/'.$user_id.'/';
        // $config['allowed_types']        = 'gif|jpg|png';
        // $config['raw_name']             = tempnam($config['upload_path']);
        // $config['max_size']             = 100;
        // $config['max_width']            = 1024;
        // $config['max_height']           = 768;

        // $this->load->library('upload', $config);

        // if ( ! $this->upload->do_upload('userfile') )
        // {
        //     $error = array('error' => $this->upload->display_errors());
        //     $this->output
        //         ->set_content_type('application/json')
        //         ->set_output(json_encode($error));
        // }
        // else
        // {
        //     $data = array('upload_data' => $this->upload->data());
        //     $postdata = [
        //         "userid" => $user_id,
        //         "price" => $this->input->post('price'),
        //         "url" => $config['upload_path'] . $data['orig_name']
        //     ];

        //     $this->db->insert('portfolio', $postdata);
        //     $this->output
        //         ->set_content_type('application/json')
        //         ->set_output(json_encode($data));
        // }

    }

    function update($portfolio_id)
    {
        $postdata = $this->input->post();
        $this->db->where('id', $portfolio_id)->update('portfolio', $postdata);
        return true;
    }

    function all($user_id)
    {
        return $this->db
            ->where('userid', $user_id)
            ->get('portfolio')
            ->result();
    }
}
