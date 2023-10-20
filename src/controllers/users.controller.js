/* const  UserDto = require ("../dto/user.dto"); */
const UserService = require ("../repository/users.repository");
const handlePolicies = require("../middleware/handle-policies.middleware");


class UserCtrl {
    constructor() {
        this.userService = new UserService();
    }


    currentUser = async (req, res) => {
        console.log("currentUser from CONTROLLER executed");

        try {
            const userForRepository = req.session.email;
            const user = await this.userService.currentUser(req, res);
            console.log("user: ", user)
            return res.json({ message: `Current user`, user});
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

            const userToken = req.session.token

            if (!userToken) {
                return res.status(401).json({ message: "User token not found" });
            }
    
            req.headers.authorization = `Bearer ${userToken}`;
    
            handlePolicies(["ADMIN"])(req, res, async () => {
                const user = await this.userService.getUserById(uid);

                if (!user) {
                    return res.status(404).json({
                        message: `User ID ${uid} not found`,
                    });
                    }

                return res.json({ message: `User ID ${uid} successfully fetched`, user });
            });
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

    deleteInactiveUsers = async (req, res) => {
        console.log("deleteInactiveUsers from CONTROLLER executed");
        

        try {
        const userToDelete = await this.userService.deleteInactiveUsers()
        
        if (userToDelete === null) {
            return res.status(404).json({
                message: `No inactive Users `,
            });
            }

        return res.json({
            message: `user/s successfully deleted`,
        })
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
};

module.exports =  UserCtrl;
