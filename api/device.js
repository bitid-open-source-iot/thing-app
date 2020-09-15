var router = require('express').Router();

router.use((req, res, next) => {
    next();
});

router.post('/signin', (req, res) => {
    res.json(true);
});

router.post('/status', (req, res) => {
    res.json(__settings.status);
});

router.post('/change-credentials', (req, res) => {
    res.json(true);
});

module.exports = router;