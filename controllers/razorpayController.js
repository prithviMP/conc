const axiosZoho = require('../config/axiosRazorpay');

exports.getLeads = async (req, res) => {
  try {
    const response = await axiosZoho.get('/crm/v2/Leads');
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
