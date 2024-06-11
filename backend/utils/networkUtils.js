const { spawn } = require('child_process');

function calculateNetworkSolution(networkIp, departments) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['utils/networkUtils.py', networkIp, JSON.stringify(departments)]);

    pythonProcess.stdout.on('data', (data) => {
      resolve(JSON.parse(data.toString()));
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
}

module.exports = { calculateNetworkSolution };
