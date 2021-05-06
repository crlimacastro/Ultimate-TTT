const { AccountModel } = require('../models/Account.js');

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const login = (req, res) => {
  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Authenticate user and return client redirection
  return AccountModel.authenticate(username, password, (err, account) => {
    if (err) {
      return res.status(400).json({ error: 'An error ocurred trying to authenticate' });
    }

    if (!account) {
      return res.status(400).json({ error: 'Wrong username or password' });
    }

    // Set session account cookie
    req.session.account = AccountModel.getSimplified(account);

    // Return redirect
    return res.json({ redirect: '/app' });
  });
};

const signup = (req, res) => {
  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Create user and return client redirection
  return AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new AccountModel(accountData);

    newAccount.save((err, doc) => {
      if (err) {
        console.log(err);

        if (err.code === 11000) {
          return res.status(400).json({ error: 'Username already in use' });
        }

        return res.status(400).json({ error: 'An error ocurred creating the account' });
      }

      req.session.account = AccountModel.getSimplified(doc);
      return res.json({ redirect: '/app' });
    });
  });
};

const resetPassword = (req, res) => {
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return AccountModel.findOneByUsername(req.session.account.username, (findErr, doc) => {
    if (findErr) {
      console.log(findErr);
      return res.status(500).json({ error: 'An error ocurred retrieving your account' });
    }

    if (!doc) {
      return res.status(400).json({ error: 'No account found with the username specified' });
    }

    return AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const docEdits = doc;

      docEdits.salt = salt;
      docEdits.password = hash;

      doc.save((saveErr) => {
        if (saveErr) {
          console.log(saveErr);

          return res.status(500).json({ error: 'An error ocurred updating your password' });
        }

        req.session.destroy();

        // Return redirect
        return res.json({ redirect: '/' });
      });
    });
  });
};

const account = (req, res) => {
  // If there is an account in session
  if (req.session.account) {
    // Look for it in DB by username
    return AccountModel.findOneByUsername(req.session.account.username, (findErr, doc) => {
      if (findErr) {
        console.log(findErr);
        return res.status(500).json({ error: 'An error ocurred retrieving your account' });
      }

      if (!doc) {
        return res.status(400).json({ error: 'No account found with the username specified' });
      }

      // Update account in session
      req.session.account = AccountModel.getSimplified(doc);

      // Return it
      return res.json(req.session.account);
    });
  }

  // Otherwise return an error
  return res.status(400).json({ error: 'No account found in session' });
};

module.exports = {
  logout,
  login,
  signup,
  resetPassword,
  account,
};
