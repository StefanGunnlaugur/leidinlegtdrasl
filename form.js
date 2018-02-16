const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { Client } = require('pg')
const xss = require('xss');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/notes';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

function form(req, res) {
  const data = {name: "asd", email: "", ssn: "", fjoldi: ""};
  res.render('form', { data });
}
async function addNote(note) {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query('INSERT INTO datebase (note) VALUES ($1)', [note]);
  await client.end();
}
router.get('/', form);

router.post(
  '/post',

  // Þetta er bara validation! Ekki sanitization
  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1 }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),

  async (req, res) => {
    const {
      name = '',
      email = '',
      ssn = '',
      fjoldi = '',
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(i => i.msg);
      const data = {};
      return res.render('form', { villur:
        `p>Villur:</p>
        <ul>
          <li>${errorMessages.join('</li><li>')}</li>
        </ul`
       });
    }

    const { note } = req.body;

    await addNote(xss(note));

    return res.get('/thanks', (req, res) => {
      res.render('thanks', { });
    })
  }
);

module.exports = router;
