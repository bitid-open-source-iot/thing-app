var router = require('express').Router();

router.use((req, res, next) => {
    next();
});

router.post('/statu', (req, res) => {
    res.json({
        "success": true
    });
});

module.exports = router;