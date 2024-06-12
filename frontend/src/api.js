const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const calculateNetworkSolution = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/network`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};
