const { calculateNetworkSolution } = require('../utils/networkUtils');

function isValidCidr(cidr) {
  const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/;
  return cidrRegex.test(cidr);
}

exports.calculateNetworkSolution = async (req, res) => {
  const { networkIp, departments } = req.body;
  if (!isValidCidr(networkIp)) {
    return res.status(400).send('Invalid network IP format. Please use x.x.x.x/subnetMask format.');
  }

  try {
    const result = await calculateNetworkSolution(networkIp, departments);
    console.log('Response being sent:', JSON.stringify(result, null, 2)); // Log the complete response
    res.json(result);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send(error.message);
  }
};
