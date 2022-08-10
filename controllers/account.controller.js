const pool = require('../dbConfig');

const  getAllAccounts = async (req, res, next) => {

    const allAccounts = await pool.query("SELECT * FROM accounts");
res.json({status: 200,data: allAccounts.rows});
// pool.end();
};

const createNewAccount = async (req, res) => {
    const {acc_no, acc_type, amount} = req.body;

    const newAccount = await pool.query(
        "INSERT INTO accounts (acc_no, acc_type, amount) VALUES ($1, $2, $3) RETURNING *",
        [acc_no, acc_type, amount]
    );

    if(newAccount.rowCount === 0) {
        return res.json({status: 400, message: 'bad request'});
    }
    return res.json({status: 200, message: 'account created', data: newAccount.rows});
};

const findAccountById = async (req, res) => {
    const {id} = req.params;
    try {
        const acc = await pool.query("SELECT * FROM accounts WHERE acc_id = $1", [id]); 
        
        if (acc.rowCount === 0) {
            return res.json({status: 400, message: 'account does not exist'});
            // throw new Error (createError(404, "product not exist")); 

        } 
            // console.log(product);
        res.json({status: 200, data: product.rows[0]});

    

        } 
        catch (error) {
            console.error(`account does not exist: ${error}`);
            // if (error instanceof Pool.CastError) {
            //     return next(createError(400, "Invalid Request"));
            // }
            // next(error);
        }
};

const updateAccount= async (req, res, next) => {
    
        const {id} =req.params;
        const {acc_no, acc_type, amount} = req.body;
        const updateAccount = await pool.query("UPDATE accounts SET acc_no = $1, acc_type = $2, amount = $3 WHERE acc_id = $4", [acc_no, acc_type, amount, id]);
        
        if (updateAccount.rowCount === 0) {

            return res.json({status: 400, message: 'account does not exist'});

        } 
            return res.json({status: 200, message: 'account updated'});
};

const deleteAccount= async (req, res, next) => {
    try {
    const {id} = req.params;
        
            const deleteAccount = await pool.query("DELETE FROM accounts WHERE acc_id = $1", [id]);
            if (deleteAccount.rowCount === 0) {
                return res.json({status: 400, message: 'account does not exist'});
            }  
                return res.json({status: 200, message: 'account deleted', res: deleteAccount});
            
            
    } catch (error) {
        console.log(`account does not exist: ${error}`)
        return res.json({status: error.statusCode, message: error.message});
    }
}

module.exports = {
    getAllAccounts,
    createNewAccount,
    updateAccount,
    deleteAccount,
    findAccountById
}