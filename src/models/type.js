const {DataTypes} = require("sequelize");

module.exports = modelType => {
    modelType.define('type', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, 
        {
            timestamps: false
        }
    )
}