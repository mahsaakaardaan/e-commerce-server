const db = require('../../connection');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const q = 'SELECT * FROM user WHERE phone_number = ?';
  db.query(q, [phoneNumber], (err, data) => {
    if (err) return res.status(500).json({ message: 'login error' });

    if (data.length == 0) {
      const q2 =
        'INSERT INTO user (phone_number,password,default_address_id) VALUES (?,?,?)';
      db.query(q2, [phoneNumber, password, 0], (err2, data2) => {
        if (err2)
          return res
            .status(500)
            .json({ message: 'register error' + err2 });

        const token = jwt.sign(
          { id: data2?.insertId },
          process.env.JWT
        );

        return res
          .cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            domain: process.env.COOKIE_DOMAIN || undefined
          })
          .status(200)
          .json({
            data: {
              phone_number: phoneNumber,
              password,
              id: data2?.insertId
            }
          });
      });
    } else {
      if (password != data[0]?.password)
        return res
          .status(401)
          .json({ message: 'password is not correct' });
      const token = jwt.sign(
        { id: data[0]?.user_id },
        process.env.JWT
      );
      return res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          domain: process.env.COOKIE_DOMAIN || undefined,
        })
        .status(200)
        .json({ data: data[0] });
    }
  });
};

const logout = (req, res) => {
  res
    .clearCookie('access_token', {
      secure: true,
      sameSite: 'none'
    })
    .status(200)
    .json({ message: 'logged out' });
};

module.exports = { login, logout };
