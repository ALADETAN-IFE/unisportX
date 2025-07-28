const User = require('../models/User');

exports.allUser = async (req, res) => {
    try {
        // const users = await User.find()
        const users = await User.find({},  { password: 0, resetPasswordExpires: 0, resetPasswordToken: 0 }); // Exclude some field
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params
    if (!id){
      return res.status(400).json({ message: 'User ID is required' });
    }
    try{
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: `User ${user.username || user.email} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};