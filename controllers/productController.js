const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const product = require("../modals/product");

const Product = require('../modals/product');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort('-created_on');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            stats: "Failure",
            err
        })
    }
}
exports.createProduct = async (req, res) => {
    try {
        let product = new Product(req.body);
        await product.save()
        res.status(200).json(product);
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate user
            return res.status(422).send({ status: "Failue", message: 'Product already exist!' });
        }
        else if (err.errors) {
            return res.status(422).send({ status: "Failue", message: err.message });
        }
        res.status(500).send(err);
    }
}

exports.editProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.updateOne(product);

        res.status(200).json(product);

    } catch (err) {
        console.log(err)
        res.status(500).json({ 'error': err })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        console.log("delete req")
        //  let id = req
        await product.findByIdAndDelete(req.params.id);
        console.log({ "id": req.params.id })
        res.status(200).json({
            id: req.params.id,
            message: "Deleted succesfully"
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'error': err })
    }
}

exports.protectRoute = async (req, res, next) => {
    if (req.method != 'GET' && req.user) {
        //  console.log(req);
        if (req.user.isAdmin) {
            next();
        }
        else {
            res.status(401).json({
                "status": "UnAuthorized",
                "message": "please contact your admin"
            })
        }
    } else {
        next()
    }
}