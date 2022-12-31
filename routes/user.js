const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModels');

const {
    validationName,
    validationEmail,
    validationPassword
} = require('../util/validator');


/**
*  @swagger 
*  components:
*   schemas: 
*    User:
*      type: object
*      required:
*      - name
*      - email 
*      - password
*      - isSeller
*      properties:
*       id:
*          type: INTEGER
*          description:  auto-generated id
*       name:
*          type: STRING
*          description: Name of user
*       email:
*           type: STRING
*           description: Email of user
*       password:
*           type: STRING
*           description: Password of user
*       isSeller:
*           type: BOOLEN
*           description: IS SELLER OR NOT
*      example:
*        name: Nurudeen
*        email: ade@gmail.com
*        isSeller: true
*/
/**
*  @swagger 
*  components:
*   schemas: 
*    product:
*      type: object
*      required:
*      - name 
*      - price
*      - image
*      properties:
*       id:
*          type: INTEGER
*          description:  auto-generated id
*       name:
*          type: STRING
*          description: Name of the products
*       price:
*           type: STRING
*           description: price of the product
*       image:
*           type: STRING
*           description: Image URL
*      example:
*        name: Bag
*        price: 500$
*        image: .png/jpeg
*/

/**
 * @swagger
 * /api/user/signup:
 *  post:
 *    summary: Creates a new User
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *         description: The user is successfully created    
 *      404:
 *         description: The user is already exists
 *      400:
 *         description: The user is validation failed
 *      500: 
 *         description: internal Server Error
 *          
 *          
 *          
 */

/**
 * @swagger
 * /api/user/signin:
 *  get:
 *    summary: Log User in
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *         description: user has successfully login    
 *      404:
 *         description: The user is already exists
 *      400:
 *         description: The user is validation failed
 *      500: 
 *         description: internal Server Error
 */

/**
 * @swagger
 * /api/product/create:
 *  post:
 *    summary: post product details
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/product'
 *    responses:
 *      200:
 *         description: product has successfully upload
 *      400:
 *         description: upload product failed
 *      500: 
 *         description: internal Server Error
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, isSeller } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(403).json({ message: "User has already exist" })
        }

        // if (!validationName(name)) {
        //     return res.status(400).json({ message: "Name validate Failed" })
        // }
        // if (!validationEmail(email)) {
        //     return res.status(400).json({ message: "Email validate Failed" })
        // }
        // if (!validationPassword(password)) {
        //     return res.status(400).json({ message: "Password validate Failed" })
        // }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = {
            name,
            email,
            password: hashedPassword,
            isSeller
        };

        const createUser = await User.create(user);
        return res.status(201).json({
            message: `Welcome ${createUser.name}`
        })
    } catch (e) {
        console.log('>>>>', e);
        return res.status(500).send(e);
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // if (email || password === 0) {
        //     return res.status(201).json({
        //         message: "incorrect input"
        //     });
        // }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({
                message: "User doesn't exist"
            });

        }
        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatched) {
            return res.status(400).json({
                message: "email or password does'not exist"
            });
        }

        const payload = { user: { id: existingUser.id } };
        const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
            expiresIn: 360000
        });

        res.cookie('t', bearerToken, { expire: new Date() + 9999 });


        return res.status(200).json({
            bearerToken,
            message: `welcome back you have sucessfull login ${existingUser.name}`
        });
    } catch (e) {
        console.log('>>>>', e);
        return res.status(500).send(e);
    }
});

router.get('/signout', (req, res) => {
    try {
        res.clearCookie('t');
        return res.status(200).json({
            message: 'logout sucessfully'
        });
    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = router;