/* const  UserDto = require ("../dto/user.dto"); */
const {UserService} = require ("../repository/repository.index");



class UserCtrl {
    constructor() {
        this.userService = UserService;
    }


    currentUser = async (req, res) => {
        console.log("currentUser from CONTROLLER executed");

        try {
        const user = await this.userService.currentUser(req, res);
        console.log(`Current user: `, user);
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };


    getAllUsers = async (req, res) => {
        console.log("getAllUsers from CONTROLLER executed");

        try {
        const users = await this.userService.getAllUsers();
        return res.json({ message: `All users successfully fetched`, users});
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };

    getUserById = async (req, res) => {
        console.log("getUserById from CONTROLLER executed");

        const uid = req.params.uid;

        try {

            const user = await this.userService.getUserById(uid);

        if (!user) {
            return res.status(404).json({
                message: `User ID ${uid} not found`,
            });
            }

        return res.json({ message: `User ID ${uid} successfully fetched`, user });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };

    createUser = async (req, res) => {
        console.log("createUser from CONTROLLER executed");

        try {
        const userInstDto = /* new userDto */(req.body);
        const newUser = await this.userService.createUser(
            userInstDto
        );
        return res.json({
            message: `User created successfully`,
            user: newUser,
        });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };

    updateUserById = async (req, res) => {
        console.log("updateUserById from CONTROLLER executed");

        const uid = req.params.uid;
        const userData = req.body;

        try {


        const UpdatedUser = await this.userService.updateUserById(uid, userData);

        if (!UpdatedUser) {
            return res.status(404).json({
                message: `User ID ${req.params.uid} not found`,
            });
            }
        
        return res.json({
            message: `User ID ${req.params.uid} successfully updated`,
            user: UpdatedUser,
        });
        
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };

    deleteUserById = async (req, res) => {
        console.log("deleteUserById from CONTROLLER executed");
        
        const uid = req.params.uid;

        try {
        const userToDelete = await this.userService.deleteUserById(uid)
        
        if (!userToDelete) {
            return res.status(404).json({
                message: `User ID ${req.params.uid} not found`,
            });
            }

        return res.json({
            message: `user successfully deleted`,
        })
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
};

module.exports =  UserCtrl;
