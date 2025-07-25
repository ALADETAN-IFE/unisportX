// const fetch = require('node-fetch');
const axios = require('axios');

exports.universitiesProxy = async (req, res) => {
  const { country } = req.query;
  try {
    // const response = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    // const data = await response.json();
    // res.json(data);
    // const response = await axios.get(`http://universities.hipolabs.com/search`, {
    //   params: { country }
    // });
    const response = await axios.get(`http://universities.hipolabs.com/search?country=${country}`);
    console.log("country:", country)
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
};
