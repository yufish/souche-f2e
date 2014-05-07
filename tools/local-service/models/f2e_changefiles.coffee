module.exports = 
    id:
        type:"int"
        autoIncrement: true
        primaryKey: true
    path:"varchar(1000)"
    is_publish:"tinyint"
    commiter:"varchar(100)"
    commit_time:"datetime"
    log:"varchar(1000)"