const axiosZoho = require('../config/axiosZoho');

exports.getLeads = async (req, res) => {
  try {
    const response = await axiosZoho.get('/crm/v2/Leads');
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};




exports.captureLeadAndSendToZoho  = async (req, res) => {
    const leadData = req.body; // Extract lead data from the request
    const data = {
        "data": [leadData]
      };
      
    console.log(data);
    // Insert code to save leadData in your database here

    try {
        const zohoResponse = await axiosZoho.post('/crm/v6/Leads', data);
        res.json({ success: true, data: zohoResponse.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
