const uploadModel = require('../models/Upload');

const dashboard = async (req, res) => {
  const query = { user: req.user.id };
  try {
    const photos = await uploadModel.find(query).sort({ _id: -1 });
    res.render('dashboard', { user: req.user, photos });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const show = async (req, res) => {
  const query = req.query.id;
  try {
    const photo = await uploadModel.find({ _id: `${query}` }).sort({ _id: -1 });
    res.render('show', { photo });
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
};
const welcome = (req, res) => res.render('welcome');

module.exports = { dashboard, welcome, show };
