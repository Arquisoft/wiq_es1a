const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Group, User, UserGroup } = require('./user-model');

const app = express();
const port = 8001;

app.use(bodyParser.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

// Obtener la lista de grupos en la base de datos
app.get('/group/list', async (req, res) => {
    try {
        const allGroups = await Group.find();
        res.json({ groups: allGroups });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Obtener un grupo por su nombre
app.get('/group/:name', async (req, res) => {
    try {
        const groupName = req.params.name;
        const group = await Group.findOne({ name: groupName });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupUsers = await UserGroup.find({ group: group._id }).populate('user');

        res.json({ group, users: groupUsers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Crear un nuevo grupo
app.post('/group/add', async (req, res) => {
    try {
        const { name, userId } = req.body;

        // Verifica si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Crea un nuevo grupo
        const newGroup = new Group({ name });
        await newGroup.save();

        // Agrega al usuario como miembro del grupo
        const userGroup = new UserGroup({ user: userId, group: newGroup._id });
        await userGroup.save();

        res.json({ message: 'Group created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Unirse a un grupo existente
app.post('/group/join', async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        // Verifica si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verifica si el grupo existe
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Verifica si el usuario ya es miembro del grupo
        const existingMembership = await UserGroup.findOne({ user: userId, group: groupId });
        if (existingMembership) {
            return res.status(400).json({ error: 'User already a member of this group' });
        }

        // Agrega al usuario como miembro del grupo
        const userGroup = new UserGroup({ user: userId, group: groupId });
        await userGroup.save();

        res.json({ message: 'User joined the group successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const server = app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server;
