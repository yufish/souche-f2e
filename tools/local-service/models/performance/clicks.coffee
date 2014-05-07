module.exports = 
    id:
        type:"int"
        autoIncrement: true
        primaryKey: true
    page_x:"int" #点击位置
    page_y:"int" #
    element_id:"varchar(20)" #点击元素id
    page_url:"varchar(300)" #当前页面url
    refer_url:"varchar(300)" #页面来源
    user_phone:"varchar(11)" #点击用户
    user_tag:"varchar(20)" #用户tag
    user_ip:"varchar(20)" #用户ip
    user_agent:"varchar(200)" #浏览器信息
    user_screenwidth:"int" #浏览器大小
    user_screenheight:"int" 
    user_viewwidth:"int"
    user_viewheight:"int"
    

