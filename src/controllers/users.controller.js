/* const  UserDto = require ("../dto/user.dto"); */
const UserService = require ("../services/users.service");
const handlePolicies = require("../middleware/handle-policies.middleware");
const { HttpResponse } = require("../middleware/errors.middleware");
const { EnumErrors } = require("../middleware/errors.middleware");
const { StatusCodes } = require("http-status-codes");

class UserCtrl {
    constructor() {
        this.userService = new UserService();
        this.httpResp = new HttpResponse();
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
        const response = await this.userService.createUser(req.body);

        switch (response.status) {
            case StatusCodes.BAD_REQUEST:
                return this.httpResp.BadRequest(res, response.message);
            case StatusCodes.INTERNAL_SERVER_ERROR:
                return this.httpResp.Error(res, response.message);
            case StatusCodes.OK:
                return res.json({
                message: response.message,
                product: response.data,
                });
            default:
                return this.httpResp.Error(res, response.message);
        }
        } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `${EnumErrors.CONTROLLER_ERROR} - ${error.message}`,
        });
        }
    };

    updateUserById = async (req, res) => {
        console.log("updateUserById from CONTROLLER executed");

        try {

        const response = await this.userService.updateUserById(req.params.uid, req.body);

        switch (response.status) {
            case StatusCodes.BAD_REQUEST:
                return this.httpResp.BadRequest(res, response.message);
            case StatusCodes.INTERNAL_SERVER_ERROR:
                return this.httpResp.Error(res, response.message);
            case StatusCodes.OK:
                return res.json({
                message: response.message,
                user: response.data,
                });
            default:
                return this.httpResp.Error(res, response.message);
        }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: `${EnumErrors.CONTROLLER_ERROR} - ${error.message}`,
            });
        }
    }

    deleteUserById = async (req, res) => {
        console.log("deleteUserById from CONTROLLER executed");

        try {
        const response = await this.userService.deleteUserById(req.params.uid)
        
        switch (response.status) {
            case StatusCodes.BAD_REQUEST:
                return this.httpResp.BadRequest(res, response.message);
            case StatusCodes.INTERNAL_SERVER_ERROR:
                return this.httpResp.Error(res, response.message);
            case StatusCodes.OK:
                return res.json({
                message: response.message,
                });
            default:
                return this.httpResp.Error(res, response.message);
        }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: `${EnumErrors.CONTROLLER_ERROR} - ${error.message}`,
            });
        }
    }

    deleteInactiveUsers = async (req, res) => {
        console.log("deleteInactiveUsers from CONTROLLER executed");
        

        try {
        const data = await this.userService.deleteInactiveUsers()
        
        if (!data) {
            return res.json({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error processing Inactive Users',
            });
            }

        return res.json({
            message: "Inactive Users Processed",
            data: data
        });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    }
};

module.exports =  UserCtrl;
